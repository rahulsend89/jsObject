function jsObject(obj) {
    if (this === window) {
        return new jsObject(obj);
    }
    var type = typeof obj;
    if (type === "string") {
        this.el = document.getElementById(obj);
    } else if (type === "object" && obj.nodeType !== "undefined" && obj.nodeType === 1) {
        this.el = obj;
    }
}
jsObject.extend = function(s) {
    for (var p in s)
        this[p] = s[p];
    return this;
};
var animationObj = (function(mainObj) {
    var startDeltaValue = 0;
    var endDeltaValue = 100;
    var animationtimer = [];
    var callFunction = [];
    var isPlaying = false;
    function pause() {
        if (isPlaying) {
            isPlaying = false;
            var len = animationtimer.length;
            for (var i = 0; i < animationtimer.length; i++) {
                clearInterval(animationtimer[i]);
            };
        } else {
            isPlaying = true;
            var len = animationtimer.length;
            for (var i = 0; i < animationtimer.length; i++) {
                animationtimer[i] = setInterval(callFunction[i], 1);
            };
        }
    }

    function animate(el, obj) {
        if (!obj) {
            throw {
                message: "Invalid argument"
            };
        } else {
            var propNum = 0
            for (styleValue in obj) {
                propNum++;
                var strVal = toCamelCase(styleValue);
                var eleStyle = el.style;
                var easeVal = (!obj['ease']) ? "linearTween" : obj['ease'];
                if (!eleStyle.hasOwnProperty(strVal)) {
                    if (styleValue == 'time') {
                        endDeltaValue = obj[styleValue];
                    }
                    if (styleValue == 'ease') {
                        easeVal = obj['ease'];
                    }
                }                
                animationtimer[propNum] = 0;
                var startVal = el.style[styleValue];
                startVal = (!startVal) ? 10 : parseInt(startVal);
                startDeltaValue = 0;
                var type = typeof obj[styleValue];
                if (type !== "string" && styleValue !== "time") {
                    makeThisPropertyAnimate(el, startVal, styleValue, obj[styleValue], propNum, easeVal);
                }
            }
        }
    }
    function makeThisPropertyAnimate(el, startVal, styleValue, endVal, propNum, ease) {
        isPlaying = true;
        var styleChange = el.style;
        (function() {
            callFunction[propNum] = function() {
                if (startDeltaValue <= endDeltaValue && (styleChange[styleValue] !== endVal + "px")) {
                    startDeltaValue++;
                    var calVal = mainObj[ease](startDeltaValue, startVal, endVal - startVal, endDeltaValue) + "px";
                    styleChange[styleValue] = calVal;
                } else {
                    clearInterval(animationtimer[propNum]);
                    isPlaying = false;
                    styleChange[styleValue] = endVal + "px";
                }
            }
            animationtimer[propNum] = setInterval(callFunction[propNum], 1)
            return animationtimer[propNum];
        })();
    }
    function linearTween(t, b, c, d) {
        return c * t / d + b;
    }
    return {
        pause: pause,
        animate: animate,
        linearTween: linearTween,
    }
})(jsObject);
jsObject.extend(animationObj)();
jsObject.prototype = {
    animate: function(obj) {
        jsObject.animate(this.el, obj);
        return this;
    },
    pause: function() {
        jsObject.pause();
        return this;
    }
};
