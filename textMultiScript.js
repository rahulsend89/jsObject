jsObject.onReady(function() {
    var ele = jsObject("main"),
        allObjects = ele.el.children,
        initX = 10,
        moveVal = 100,
        testObjects = jsObject("splitId"),
        textAlreadyExpand = false,
        callback = function(e) {
            if (e.keyCode == 39) {
                moveRight();
            } else if (e.keyCode == 37) {
                moveLeft();
            }
        },
        animateMyBlock = function() {
            for (var i = allObjects.length - 1; i >= 0; i--) {
                var animateObject = jsObject(allObjects[i]);
                animateObject.animate({
                    delay: i * 300,
                    time: 200,
                    //ease:"easeInElastic",
                    left: initX,
                    width: Math.random() * 100 + 20
                });
            };
        },
        moveLeft = function() {
            initX -= moveVal;
            animateMyBlock();
        },
        moveRight = function() {
            initX += moveVal;
            animateMyBlock();
        },
        pause = function() {
            jsObject.pause();
        },
        callBackFun = function() {
            testObjects.revert();
            textAlreadyExpand = false;
        },
        animateLetters = function() {
            if (!textAlreadyExpand) {
                var expandObject = testObjects.expand(),
                    randomXpos = 250;
                textAlreadyExpand = true;
                words = expandObject.rvalue.allchar;
                for (var i = 0, len = words.length; i < len; i++) {
                    jsObject(words[i]).animate({
                        delay: i * 7,
                        time: 300,
                        ease: "easeOutElastic",
                        top: randomXpos,
                    }, callBackFun);
                };
            }
        }
    jsObject.addEvent(document, "keydown", callback);
    jsObject(f.moveRight).click(moveRight);
    jsObject(f.pause).click(pause);
    jsObject(f.moveLeft).click(moveLeft);
    jsObject(f.textAnimation).click(animateLetters);
});
