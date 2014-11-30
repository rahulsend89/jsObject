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
};
(function(mainObj) {
    var endDeltaValue = 100,
        callFunction = {},
        delayTimer = {},
        delaySTimer = {},
        startTimer = {},
        pauseTimer = {},
        isPlaying = false,
        animationDelay = 0,
        propNum = 0,
        toCamelCase = function(str) {
            return str.replace(/-([a-z])/ig, function(all, letter) {
                return letter.toUpperCase();
            });
        },
        getStyle = (function() {
            if (typeof getComputedStyle !== "undefined") {
                return function(el, cssProp) {
                    return window.getComputedStyle(el, null).getPropertyValue(cssProp);
                };
            } else {
                return function(el, cssProp) {
                    return el.currentStyle[toCamelCase(cssProp)];
                };
            }
        }()),
        cfn = (function() {
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
        })(),
        stopPreviousAnimation = function(el, styleValue, b) {
            if (el[styleValue + "df"] !== undefined) {
                clearTimeout(el[styleValue + "df"]["cid"]);
                delete el[styleValue + "df"];
                delete delayTimer[el[styleValue + "dfp"]];
                delete el[styleValue + "dfp"];
                delete delaySTimer[el[styleValue + "dfp"]];
                delete startTimer[el[styleValue + "dfp"]];
                delete pauseTimer[el[styleValue + "dfp"]];
            }
            if ((el[styleValue + "cf"] !== undefined) && !b) {
                clearInterval(el[styleValue + "cf"]["cid"]);
                delete el[styleValue + "cf"];
                delete callFunction[el[styleValue + "cfp"]];
                delete el[styleValue + "cfp"];
            }
        },
        makeThisPropertyAnimate = function(el, startVal, styleValue, endVal, _propNum_, ease, callback) {
            isPlaying = true;
            var styleChange = el.style;
            el[styleValue + "cfp"] = _propNum_;
            var callBackFun = el[styleValue + "cf"] = callFunction[_propNum_] = function() {
                if (el["dt"] <= endDeltaValue && (styleChange[styleValue] !== endVal + "px")) {
                    el["dt"] ++;
                    styleChange[styleValue] = mainObj[ease](el["dt"], startVal, endVal - startVal, endDeltaValue) + "px";
                } else {
                    stopPreviousAnimation(el, styleValue);
                    var element_count = 0;
                    for (e in callFunction) {
                        element_count++;
                    }
                    if (!element_count) {
                        isPlaying = false;
                        if (callback) {
                            callback();
                        }
                    }
                    styleChange[styleValue] = endVal + "px";
                }
            }
            cfn(callBackFun, 1)
        }
    mainObj.pause = function() {
        if (isPlaying) {
            isPlaying = false;
            for (i in callFunction) {
                clearInterval(callFunction[i]["cid"]);
            }
            for (i in delayTimer) {
                pauseTimer[i] = +new Date();
                clearTimeout(delayTimer[i]["cid"]);
            }
        } else {
            isPlaying = true;
            for (i in callFunction) {
                cfn(callFunction[i], 1);
            }
            for (i in delayTimer) {
                var calTimer = delaySTimer[i] -= pauseTimer[i] - startTimer[i];
                cfn(delayTimer[i], calTimer, true);
            }
        }
    }
    mainObj.animate = function(el, obj, callback) {
        if (!obj) {
            throw {
                message: "Invalid argument"
            };
        } else {
            for (var styleValue in obj) {
                var easeVal = (!obj.hasOwnProperty('ease')) ? "linearTween" : obj['ease'];
                if (styleValue == 'time') {
                    endDeltaValue = obj[styleValue];
                } else if (styleValue == 'delay') {
                    animationDelay = obj[styleValue];
                } else if (styleValue !== 'ease') {
                    var startVal = getStyle(el, styleValue),
                        type = typeof obj[styleValue];
                    startVal = (isNaN(parseInt(startVal))) ? 10 : parseInt(startVal);
                    if (type !== "string" && styleValue !== "time") {
                        propNum++;
                        el["dt"] = 0;
                        stopPreviousAnimation(el, styleValue);
                        el[styleValue + "dfp"] = propNum;
                        delaySTimer[propNum] = animationDelay;
                        startTimer[propNum] = new Date();
                        var delayfunCalled = el[styleValue + "df"] = delayTimer[propNum] = (function(_el, _startVal, _styleValue, _obj_styleValue, _propNum) {
                            return function() {
                                stopPreviousAnimation(_el, _styleValue, true);
                                makeThisPropertyAnimate(_el, _startVal, _styleValue, _obj_styleValue, _propNum, easeVal, callback);
                            };
                        })(el, startVal, styleValue, obj[styleValue], propNum);
                        cfn(delayfunCalled, animationDelay, true);
                    }
                }
            }
        }
    }
    mainObj.linearTween = function(t, b, c, d) {
        return c * t / d + b;
    }
    mainObj.prototype.animate = function(obj, callback) {
        jsObject.animate(this.el, obj, callback);
        return this;
    }
    mainObj.prototype.pause = function() {
        jsObject.pause();
        return this;
    }
    mainObj.extend = function(s) {
        for (var p in s)
            this[p] = s[p];
        return this;
    }
})(jsObject);
