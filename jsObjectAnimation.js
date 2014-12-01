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
        stopPreviousAnimation = function(el, styleValue, b, c) {
            if (el[styleValue + "df"] !== undefined) {
                clearTimeout(el[styleValue + "df"]["cid"]);
                delete el[styleValue + "df"];
                delete delayTimer[el[styleValue + "dfp"]];
                delete el[styleValue + "dfp"];
                delete delaySTimer[el[styleValue + "dfp"]];
                delete startTimer[el[styleValue + "dfp"]];
                delete pauseTimer[el[styleValue + "dfp"]];
            }
            if (!b && (el[styleValue + "cf"] !== undefined)) {
                clearInterval(el[styleValue + "cf"]["cid"]);
                delete el[styleValue + "cf"];
                delete callFunction[el[styleValue + "cfp"]];
                delete el[styleValue + "cfp"];
            }
            if (c && (el["acb"] !== undefined)) {
                el["n"]--;
                if (!el["n"]) {
                    el["acb"]();
                }
            }
        },
        makeThisPropertyAnimate = function(el, startVal, styleValue, endVal, _propNum_, ease, callback) {
            isPlaying = true;
            var styleChange = el.style;
            el[styleValue + "cfp"] = _propNum_;
            var callBackFun = el[styleValue + "cf"] = callFunction[_propNum_] = function() {
                if (el["dt"] <= el["et"] && (styleChange[styleValue] !== endVal + "px")) {
                    el["dt"] ++;
                    styleChange[styleValue] = mainObj[ease](el["dt"], startVal, endVal - startVal, el["et"]) + "px";
                } else {
                    stopPreviousAnimation(el, styleValue, false, true);
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
                startTimer[i] = +new Date();
            }
        }
    }
    mainObj.animate = function(el, obj, callback) {
        if (!obj) {
            throw {
                message: "Invalid argument"
            };
        } else {
            var easeVal = (!obj.hasOwnProperty('ease')) ? "linearTween" : obj['ease'],
                animationDelay = obj["delay"] || 0,
                numVal = 0;
            el["et"] = obj["time"] || 0;
            for (var styleValue in obj) {
                if (styleValue !== 'ease' && styleValue !== 'delay' && styleValue !== 'time') {
                    var newstyleValue = toCamelCase(styleValue),
                        startVal = getStyle(el, styleValue),
                        type = typeof obj[styleValue];
                    startVal = (isNaN(parseInt(startVal))) ? 0 : parseInt(startVal);
                    if (type !== "string") {
                        numVal++;
                        propNum++;
                        el["dt"] = 0;
                        el["n"] = numVal;
                        stopPreviousAnimation(el, newstyleValue);
                        el[newstyleValue + "dfp"] = propNum;
                        delaySTimer[propNum] = animationDelay;
                        startTimer[propNum] = +new Date();
                        var delayfunCalled = el[newstyleValue + "df"] = delayTimer[propNum] = (function(_el, _startVal, _styleValue, _obj_styleValue, _propNum) {
                            return function() {
                                stopPreviousAnimation(_el, _styleValue, true);
                                makeThisPropertyAnimate(_el, _startVal, _styleValue, _obj_styleValue, _propNum, easeVal, callback);
                            };
                        })(el, startVal, newstyleValue, obj[styleValue], propNum);
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
