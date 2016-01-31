describe("when jsObject is included", function() {
    var _element,
        resetElement = function(){
            _element.el.style.top = "10px";
            _element.el.style.left = "10px";
            _element.el.style.width = "58px";
            _element.el.style.height = "20px";
            _element.el.className = "classOne";
            _element.el.fontSize = "20px";
            _element.el.backgroundColor= "white";
            _element.html('<b id="test">Hello, World!</b><a><u>Text</u></a>');
        },
        trigger = function(node, eventName) {
            // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
            var doc;
            if (node.ownerDocument) {
                doc = node.ownerDocument;
            } else if (node.nodeType == 9){
                // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
                doc = node;
            } else {
                throw new Error("Invalid node passed to fireEvent: " + node.id);
            }

            if (node.dispatchEvent) {
                // Gecko-style approach (now the standard) takes more work
                var eventClass = "";

                // Different events have different event classes.
                // If this switch statement can't map an eventName to an eventClass,
                // the event firing is going to fail.
                switch (eventName) {
                    case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
                    case "mousedown":
                    case "mouseup":
                    case "mouseover":
                    case "mouseout":
                        eventClass = "MouseEvents";
                        break;

                    case "focus":
                    case "change":
                    case "blur":
                    case "select":
                        eventClass = "HTMLEvents";
                        break;

                    default:
                        throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                        break;
                }
                var event = doc.createEvent(eventClass);

                var bubbles = eventName == "change" ? false : true;
                event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.

                event.synthetic = true; // allow detection of synthetic events
                // The second parameter says go ahead with the default action
                node.dispatchEvent(event, true);
            } else  if (node.fireEvent) {
                // IE-old school style
                var event = doc.createEventObject();
                event.synthetic = true; // allow detection of synthetic events
                node.fireEvent("on" + eventName, event);
            }
        };
    beforeAll(function() {
        document.body.appendChild(jsObject.createElement({
            tagName: "div",
            id:"testID",
            className: "classOne",
            html: "<b id='test'>Hello, World!</b>",
            attributes: {
                style: "position:absolute",
                align: "center"
            },
            children: [{
                tagName: "a",
                html: "<u>Text</u>"
            }]
        }));
        _element = jsObject("testID");
    });

    beforeEach(function(){
        jasmine.Ajax.install();
        resetElement();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it("addClass should work", function () {
        expect(_element.el.className).toEqual("classOne");
        _element.addClass("awesome")
        expect(_element.el.className).toEqual("classOne awesome");
    });
    it("removeClass should work", function () {
        expect(_element.el.className).toEqual("classOne");
        _element.removeClass("classOne")
        expect(_element.el.className).toEqual("")
    });
    it("toggleClass should work", function () {
        expect(_element.el.className).toEqual("classOne");
        _element.toggleClass("awesome")
        expect(_element.el.className).toEqual("classOne awesome")
        _element.toggleClass("awesome")
        expect(_element.el.className).toEqual("classOne")
    });
    it("hasClass should work", function () {
        expect(_element.hasClass("classOne")).toBeTruthy()
    });
    it("html should work", function () {
        _element.html("")
        expect(_element.el.innerHTML).toEqual("")
    });
    it("html should work", function () {
        _element.html("")
        _element.append("awesome")
        expect(_element.el.innerHTML).toEqual("awesome")
    });
    it("css should work", function () {
        _element.css("top","200px")
                .css("font-size","10px")
                .css("background-color","black");
        expect(parseInt(_element.el.style.top)).toEqual(200)
        expect(parseInt(_element.el.style.fontSize)).toEqual(10)
        expect(_element.el.style.backgroundColor).toEqual("black")
    });
    it("click should work", function () {
        var doneFn = jasmine.createSpy("click");
        _element.click(function(){
            doneFn();
        });
        trigger(_element.el,"click")
        expect(doneFn).toHaveBeenCalled();
    });
    it("mouseover should work", function () {
        var doneFn = jasmine.createSpy("mouseover");
        _element.mouseover(function(){
            doneFn();
        });
        trigger(_element.el,"mouseover")
        expect(doneFn).toHaveBeenCalled();
    });
    it("mouseout should work", function () {
        var doneFn = jasmine.createSpy("mouseout");
        _element.mouseout(function(){
            doneFn();
        });
        trigger(_element.el,"mouseout")
        expect(doneFn).toHaveBeenCalled();
    });
    it("addEvent should work", function () {
        var doneFn = jasmine.createSpy("addEvent");
        jsObject.addEvent(document, "focus", function(){
            doneFn();
        });
        trigger(document,"focus");
        expect(doneFn).toHaveBeenCalled();
    });
    it("removeEvent should work", function () {
        var addEventFn = jasmine.createSpy("addEvent"),
            removeEventFn = false,
            callBackFun = function(){
                removeEventFn =  true
                addEventFn();
            };

        jsObject.addEvent(document, "focus", callBackFun);
        trigger(document,"focus");
        expect(addEventFn).toHaveBeenCalled();
        jsObject.removeEvent(document,"focus", callBackFun );
        removeEventFn = false
        trigger(document,"focus");
        expect(removeEventFn).toBeFalsy();
    });
    it("objToParams should work", function () {
        var  testParam = jsObject.objToParams({"def":"awesome","def2":"cool"});
        expect(testParam ).toEqual("def=awesome&def2=cool")
    });
    it("ajxCall should work", function () {
        var doneFn = jasmine.createSpy("success");
        jasmine.Ajax.stubRequest('//url').andReturn({
            "response": 'awesome response'
        });
        jsObject.ajxCall({
            url: "//url",
            data: "GET",
            success: function(response) {
                doneFn(response)
            },
        });
        expect(doneFn).toHaveBeenCalledWith("awesome response");
    });
    it("parseXML should work", function () {
        var dataObject = jsObject.parseXml('<data><name is="awesome">rahul</name></data>')
        expect(dataObject.data.name.value).toEqual("rahul")
        expect(dataObject.data.name.is).toEqual("awesome")
    });
});