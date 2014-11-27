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
    var endDeltaValue = 100;
    var callFunction = {};
    var delayTimer = {};
    var isPlaying = false;
    var animationDelay = 0;
    var propNum = 0

    function pause() {
        if (isPlaying) {
            isPlaying = false;
            for (i in callFunction) {
                clearInterval(callFunction[i]["cid"]);
            }
            for (i in delayTimer) {
                clearTimeout(delayTimer[i]["cid"]);
            }
        } else {
            isPlaying = true;
            for (i in callFunction) {
                cfn(callFunction[i], 1);
            }
            for (i in delayTimer) {
                cfn(delayTimer[i], true);
            }
        }
    }

    function animate(el, obj) {
        // if (isPlaying) {
        //     pause();
        //     el["delta"] = 0;
        //     callFunction = {};
        //     delayTimer = {};
        // }
        if (!obj) {
            throw {
                message: "Invalid argument"
            };
        } else {
            for (var styleValue in obj) {
                var eleStyle = el.style;
                var easeVal = (!obj.hasOwnProperty('ease')) ? "linearTween" : obj['ease'];
                if (styleValue == 'time') {
                    endDeltaValue = obj[styleValue];
                } else if (styleValue == 'delay') {
                    animationDelay = obj[styleValue];
                } else if (styleValue !== 'ease') {
                    var startVal = getStyle(el, styleValue);
                    startVal = (isNaN(parseInt(startVal))) ? 10 : parseInt(startVal);
                    var type = typeof obj[styleValue];
                    if (type !== "string" && styleValue !== "time") {
                        propNum++;
                        el["delta"] = 0;
                        stopPreviousAnimation(el,styleValue);
                        el[styleValue + "dfp"] = propNum;
                        var delayfunCalled = el[styleValue + "df"] = delayTimer[propNum] = (function(_el, _startVal, _styleValue, _obj_styleValue, _propNum) {
                            return function() {
                                delete delayTimer[_propNum];
                                delete _el[styleValue + "df"];
                                makeThisPropertyAnimate(_el, _startVal, _styleValue, _obj_styleValue, _propNum, easeVal);
                            };
                        })(el, startVal, styleValue, obj[styleValue], propNum);
                        cfn(delayfunCalled, animationDelay, true);
                    }
                }
            }
        }
    }

    function stopPreviousAnimation(el,styleValue) {
        if (el[styleValue + "df"] !== undefined) {
            clearTimeout(el[styleValue + "df"]["cid"]);
            delete el[styleValue + "df"];
            delete delayTimer[el[styleValue + "dfp"]];
            delete el[styleValue + "dfp"];
        }
        if (el[styleValue + "cf"] !== undefined) {
            clearInterval(el[styleValue + "cf"]["cid"]);
            delete el[styleValue + "cf"];
            delete callFunction[el[styleValue + "cfp"]];
            delete el[styleValue + "cfp"];
        }
    }

    function makeThisPropertyAnimate(el, startVal, styleValue, endVal, _propNum_, ease) {        
        isPlaying = true;
        el["ip"] = true;
        var styleChange = el.style;
        el[styleValue + "cfp"] = _propNum_;
        var callBackFun = el[styleValue + "cf"] = callFunction[_propNum_] = function() {
            if (el["delta"] <= endDeltaValue && (styleChange[styleValue] !== endVal + "px")) {
                el["delta"] ++;
                var calVal = mainObj[ease](el["delta"], startVal, endVal - startVal, endDeltaValue) + "px";
                styleChange[styleValue] = calVal;                
            } else {
                delete callFunction[_propNum_];
                delete el[styleValue + "cf"];
                clearInterval(callBackFun["cid"]);
                isPlaying = false;
                el["ip"] = false;
                styleChange[styleValue] = endVal + "px";
            }
        }
        cfn(callBackFun, 1)
    }

    function linearTween(t, b, c, d) {
        return c * t / d + b;
    }
    return {
        callFunction:callFunction,
        pause: pause,
        delayTimer:delayTimer,
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
    var _setInterval;
    var callFunctionWithInterval = function(fn, delay, o) {
        if (o) {
            _setInterval = window.setTimeout;
        } else {
            _setInterval = window.setInterval;
        }
        var id = _setInterval(function() {
            fn();
        }, delay);
        fn["cid"] = id;
        return id;
    }
    return callFunctionWithInterval;
})();
