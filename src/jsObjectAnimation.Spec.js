describe("when jsObject is included", function() {
    var _element,
        resetElementPosition = function(){
            _element.el.style.top = "10px";
            _element.el.style.left = "10px";
            _element.el.style.width = "58px";
            _element.el.style.height = "20px";
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
        jasmine.clock().install();
        resetElementPosition();
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    it("appendChild should work with DOM", function() {
        expect(_element.hasClass("classOne")).toBeTruthy();
        expect(_element.el.align).toEqual('center')
        expect(_element.el.innerHTML).toEqual('<b id="test">Hello, World!</b><a><u>Text</u></a>')
    });

    it("animate should end with endValue",function(){
        var randomWidth = Math.random() * 200 + 100,
            randomHeight = Math.random() * 200 + 100,
            xpos = 200,
            ypos = 200;
        _element.animate({
            ease: "linearTween",
            time: 100,
            left: xpos,
            top: ypos,
            width: (randomWidth),
            height: (randomHeight),
        });

        jasmine.clock().tick(101);

        expect(parseFloat(_element.el.style.top)).toEqual(xpos);
        expect(parseFloat(_element.el.style.left)).toEqual(ypos);
        expect(parseFloat(_element.el.style.width)).toBeCloseTo(randomWidth);
        expect(parseFloat(_element.el.style.height)).toBeCloseTo(randomHeight);
    });

    it("animate pause and replay",function(){
        var randomWidth = Math.random() * 200 + 100,
            randomHeight = Math.random() * 200 + 100,
            xpos = 200,
            ypos = 200;
        _element.animate({
            ease: "linearTween",
            time: 1000,
            left: xpos,
            top: ypos,
            width: (randomWidth),
            height: (randomHeight),
        });
        jasmine.clock().tick(100);
        _element.pause();
        expect(parseFloat(_element.el.style.top)).not.toEqual(xpos);
        expect(parseFloat(_element.el.style.left)).not.toEqual(ypos);
        expect(parseFloat(_element.el.style.width)).not.toBeCloseTo(randomWidth);
        expect(parseFloat(_element.el.style.height)).not.toBeCloseTo(randomHeight);
        _element.pause();
        jasmine.clock().tick(900);
        expect(parseFloat(_element.el.style.top)).toEqual(xpos);
        expect(parseFloat(_element.el.style.left)).toEqual(ypos);
        expect(parseFloat(_element.el.style.width)).toBeCloseTo(randomWidth);
        expect(parseFloat(_element.el.style.height)).toBeCloseTo(randomHeight);
    });

    it("animate callback should work",function(){
        var randomWidth = Math.random() * 200 + 100,
            randomHeight = Math.random() * 200 + 100;
        _element.animate({
            ease: "linearTween",
            time: 100,
            left: 30,
            top: 30,
            width: (randomWidth),
            height: (randomHeight),
        }).el["acb"] = function(){
            resetElementPosition();
        };
        jasmine.clock().tick(1000);
        expect(parseFloat(_element.el.style.width)).toBeCloseTo(58);
        expect(parseFloat(_element.el.style.height)).toBeCloseTo(20);
    });
});