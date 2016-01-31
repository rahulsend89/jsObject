function jsObject(obj) {
    if (this === window) {
        return new jsObject(obj);
    }
    var type = typeof obj;
    if (type === "string") {
        this.el = document.getElementById(obj);
    } else if (type === "object" && obj.nodeType === 1) {
        this.el = obj;
    }
}
(function(mainObj) {
    var callFunction = {},
        delayTimer = {},
        delaySTimer = {},
        startTimer = {},
        pauseTimer = {},
        isPlaying = false,
        propNum = 0,
        _setInterval = function(fn, delay) {
            if (!fn.id) {
                var timerVal = _getMaxCount(),
                    returnVal = fn.id = timerVal,
                    cached_function = fn;
                _timerObject[timerVal] = returnVal;
                _timerObject["fn" + timerVal] = fn;
                fn = (function() {
                    return function() {
                        if (_timerObject[timerVal]) {
                            cached_function.apply(this, arguments);
                            cached_function.cid = setTimeout(fn, delay);
                        }
                    };
                })();
                fn.call();
                return returnVal;
            }
        },
        _clearInterval = function(timerVal) {
            var str = "fn" + timerVal,
                fn = _timerObject[str];
            _timerObject[timerVal] = undefined;
            delete _timerObject[timerVal];
            delete fn.cid;
            delete fn.id;
        },
        _getMaxCount = (function() {
            var numCount = 1;
            return function() {
                return numCount++;
            };
        })(),
        _timerObject = {},
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
        cfn = function(fn, delay, o) {
            var _setInt;
            if (o) {
                _setInt = window.setTimeout;
            } else {
                _setInt = _setInterval;
            }
            var id = _setInt(function() {
                fn();
            }, delay);
            fn.cid = id;
            return id;
        },
        stopPreviousAnimation = function(el, styleValue, b, c) {
            var df = el[styleValue + "df"],
                dfp = el[styleValue + "dfp"],
                cf = el[styleValue + "cf"],
                cfp = el[styleValue + "cfp"],
                acb = el.acb;
            if (df !== undefined) {
                clearTimeout(df.cid);
                delete el[styleValue + "df"];
                delete el[styleValue + "dfp"];
                delete delayTimer[dfp];
                delete delaySTimer[dfp];
                delete startTimer[dfp];
                delete pauseTimer[dfp];
            }
            if (!b) {
                if (cf !== undefined) {
                    _clearInterval(cf.cid);
                    delete el[styleValue + "cf"];
                    delete callFunction[cfp];
                    delete el[styleValue + "cfp"];
                }
            }
            if (c) {
                if (acb !== undefined) {
                    el.n --;
                    if (!el.n) {
                        el.acb();
                    }
                }
            }
        },
        makeThisPropertyAnimate = function(el, startVal, styleValue, endVal, _propNum_, ease, callback) {
            isPlaying = true;
            var styleChange = el.style;
            el[styleValue + "cfp"] = _propNum_;
            var callBackFun = el[styleValue + "cf"] = callFunction[_propNum_] = function() {
                if (el.dt <= el.et && (styleChange[styleValue] !== endVal + "px")) {
                    el.dt ++;
                    styleChange[styleValue] = mainObj[ease](el.dt, startVal, endVal - startVal, el.et) + "px";
                } else {
                    stopPreviousAnimation(el, styleValue, false, true);
                    var element_count = 0;
                    for (var e in callFunction) {
                        element_count++;
                    }
                    styleChange[styleValue] = endVal + "px";
                    if (!element_count) {
                        isPlaying = false;
                        if (callback) {
                            callback();
                        }
                    }
                }
            };
            cfn(callBackFun, 1);
        },
        animoCallBackFun = function(_el, _startVal, _styleValue, _obj_styleValue, _propNum, _easeVal, _callback) {
            return function() {
                stopPreviousAnimation(_el, _styleValue, true);
                makeThisPropertyAnimate(_el, _startVal, _styleValue, _obj_styleValue, _propNum, _easeVal, _callback);
            };
        };
    mainObj.pause = function() {
        if (isPlaying) {
            isPlaying = false;
            for (var i in callFunction) {
                _clearInterval(callFunction[i].cid);
            }
            for (var j in delayTimer) {
                pauseTimer[j] = +new Date();
                clearTimeout(delayTimer[j].cid);
            }
        } else {
            isPlaying = true;
            for (var k in callFunction) {
                cfn(callFunction[k], 1);
            }
            for (var l in delayTimer) {
                var calTimer = delaySTimer[l] -= pauseTimer[l] - startTimer[l];
                cfn(delayTimer[l], calTimer, true);
                startTimer[l] = +new Date();
            }
        }
    };
    mainObj.animate = function(el, obj, callback) {
        if (!obj) {
            throw {
                message: "Invalid argument"
            };
        } else {
            var easeVal = (!obj.hasOwnProperty('ease')) ? "linearTween" : obj.ease,
                animationDelay = obj.delay || 0,
                numVal = 0;
            el.et = obj.time || 0;
            for (var styleValue in obj) {
                if (styleValue !== 'ease' && styleValue !== 'delay' && styleValue !== 'time') {
                    var newstyleValue = toCamelCase(styleValue),
                        startVal = getStyle(el, styleValue),
                        type = typeof obj[styleValue];
                    startVal = (isNaN(parseInt(startVal))) ? 0 : parseInt(startVal);
                    if (type !== "string") {
                        numVal++;
                        propNum++;
                        el.dt = 0;
                        el.n = numVal;
                        stopPreviousAnimation(el, newstyleValue);
                        el[newstyleValue + "dfp"] = propNum;
                        delaySTimer[propNum] = animationDelay;
                        startTimer[propNum] = +new Date();
                        var delayfunCalled = el[newstyleValue + "df"] = delayTimer[propNum] = animoCallBackFun(el, startVal, newstyleValue, obj[styleValue], propNum, easeVal, callback);
                        cfn(delayfunCalled, animationDelay, true);
                    }
                }
            }
        }
    };
    mainObj.linearTween = function(t, b, c, d) {
        return c * t / d + b;
    };
    mainObj.prototype.animate = function(obj, callback) {
        jsObject.animate(this.el, obj, callback);
        return this;
    };
    mainObj.prototype.pause = function() {
        jsObject.pause();
        return this;
    };
    mainObj.extend = function(s) {
        for (var p in s) {
            this[p] = s[p];
        }
        return this;
    };
})(jsObject);