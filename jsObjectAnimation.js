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
    var callFunction = {};
    var isPlaying = false;

    function pause() {
        if (isPlaying) {
            isPlaying = false;
            for (i in callFunction) {
                clearInterval(callFunction[i]["cid"]);
            };
        } else {
            isPlaying = true;
            for (i in callFunction) {
                cfn(callFunction[i], 1);
            };
        }
    }

    function animate(el, obj) {
        if (isPlaying) {
            pause();
            startDeltaValue = 100;
            callFunction = {};
        }
        if (!obj) {
            throw {
                message: "Invalid argument"
            };
        } else {
            var propNum = 0
            for (var styleValue in obj) {
                propNum++;
                var eleStyle = el.style;
                var easeVal = (!obj.hasOwnProperty('ease')) ? "linearTween" : obj['ease'];
                if (styleValue == 'time') {
                    endDeltaValue = obj[styleValue];
                } else if(styleValue !== 'ease'){
                    var startVal = getStyle(el, styleValue);
                    startVal = (isNaN(parseInt(startVal))) ? 10 : parseInt(startVal);
                    startDeltaValue = 0;
                    var type = typeof obj[styleValue];
                    if (type !== "string" && styleValue !== "time") {
                        makeThisPropertyAnimate(el, startVal, styleValue, obj[styleValue], propNum, easeVal);
                    }
                }
            }
        }
    }

    function makeThisPropertyAnimate(el, startVal, styleValue, endVal, propNum, ease) {
        isPlaying = true;
        var styleChange = el.style;
        (function() {
            var callBackFun = callFunction[propNum] = function() {
                if (startDeltaValue <= endDeltaValue && (styleChange[styleValue] !== endVal + "px")) {
                    startDeltaValue++;
                    var calVal = mainObj[ease](startDeltaValue, startVal, endVal - startVal, endDeltaValue) + "px";
                    styleChange[styleValue] = calVal;
                } else {
                    clearInterval(callBackFun["cid"]);
                    isPlaying = false;
                    styleChange[styleValue] = endVal + "px";
                }
            }
            cfn(callBackFun, 1)
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
jsObject.extend(animationObj);
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

function toCamelCase(str) {
    return str.replace(/-([a-z])/ig, function(all, letter) {
        return letter.toUpperCase();
    });
}

var getStyle = (function() {
    if (typeof getComputedStyle !== "undefined") {
        return function(el, cssProp) {
            return window.getComputedStyle(el, null).getPropertyValue(cssProp);
        };
    } else {
        return function(el, cssProp) {
            return el.currentStyle[toCamelCase(cssProp)];
        };
    }
}());
var cfn = (function() {
    var _setInterval = window.setInterval;
    var callFunctionWithInterval = function(fn, delay) {
        var id = _setInterval(function() {
            fn();
        }, delay);
        fn["cid"] = id;
        return id;
    }
    return callFunctionWithInterval;
})();
