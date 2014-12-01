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
                    delay: i * 7,
                    time: 300,
                    ease:"easeInOutElastic",                    
                    top: initX,
                    width: Math.random() * 10 + 5
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
                    randomXpos = 20;
                textAlreadyExpand = true;
                words = expandObject.rvalue.allchar;
                for (var i = 0, len = words.length; i < len; i++) {
                    var delay = i * 20;
                    jsObject(words[i]).animate({
                        time: 60,
                        delay: delay,
                        ease: "easeInBack",
                        //"font-size": randomXpos,
                        top: -20,
                    }).el["acb"] = function() {
                        jsObject(this).animate({
                            time: 60,
                            delay: 0,
                            top: 0,
                            ease: "easeOutBack",
                            //"font-size": 30,
                        }, callBackFun).toggleClass("toggle").el["acb"] = function() {
                            jsObject.toggleClass(this, "toggle");
                        };
                    };
                };
            }
        }
    jsObject.addEvent(document, "keydown", callback);
    jsObject(f.moveRight).click(moveRight);
    jsObject(f.pause).click(pause);
    jsObject(f.moveLeft).click(moveLeft);
    jsObject(f.textAnimation).click(animateLetters);
});
