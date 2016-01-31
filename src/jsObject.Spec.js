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
        trigger = function(el, etype){
            if (el.fireEvent) {
                (el.fireEvent('on' + etype));
            } else {
                var evObj = document.createEvent('Events');
                evObj.initEvent(etype, true, false);
                el.dispatchEvent(evObj);
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
        jsObject.addEvent(document, "keydown", function(){
            doneFn();
        });
        trigger(document,"keydown");
        expect(doneFn).toHaveBeenCalled();
    });
    it("removeEvent should work", function () {
        var addEventFn = jasmine.createSpy("addEvent"),
            removeEventFn = false,
            callBackFun = function(){
                removeEventFn =  true
                addEventFn();
            };

        jsObject.addEvent(document, "keydown", callBackFun);
        trigger(document,"keydown");
        expect(addEventFn).toHaveBeenCalled();
        jsObject.removeEvent(document,"keydown", callBackFun );
        removeEventFn = false
        trigger(document,"keydown");
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