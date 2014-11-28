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
    var delaySTimer = {};
    var startTimer = {};
    var pauseTimer = {};
    var isPlaying = false;
    var animationDelay = 0;
    var propNum = 0
    var animationDone = function(){}

    function pause() {
        if (isPlaying) {
            isPlaying = false;
            for (i in callFunction) {
                clearInterval(callFunction[i]["cid"]);
            }
            for (i in delayTimer) {
                pauseTimer[i] = new Date();
                clearTimeout(delayTimer[i]["cid"]);
            }
        } else {
            isPlaying = true;
            for (i in callFunction) {
                cfn(callFunction[i], 1);
            }
            for (i in delayTimer) {
                var calTimer = delaySTimer[i] -= pauseTimer[i] - startTimer[i];                
                cfn(delayTimer[i],calTimer, true);
            }
        }
    }

    function animate(el, obj,callback) {
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
                        stopPreviousAnimation(el, styleValue);
                        el[styleValue + "dfp"] = propNum;
                        delaySTimer[propNum] = animationDelay;
                        startTimer[propNum] = new Date();
                        var delayfunCalled = el[styleValue + "df"] = delayTimer[propNum] = (function(_el, _startVal, _styleValue, _obj_styleValue, _propNum) {
                            return function() {
                                delete delayTimer[_propNum];                                
                                delete delaySTimer[_propNum];
                                delete startTimer[_propNum];
                                delete pauseTimer[_propNum];
                                delete _el[styleValue + "df"];
                                makeThisPropertyAnimate(_el, _startVal, _styleValue, _obj_styleValue, _propNum, easeVal,callback);
                            };
                        })(el, startVal, styleValue, obj[styleValue], propNum);
                        cfn(delayfunCalled, animationDelay, true);
                    }
                }
            }
        }
    }

    function stopPreviousAnimation(el, styleValue) {
        if (el[styleValue + "df"] !== undefined) {
            clearTimeout(el[styleValue + "df"]["cid"]);
            delete el[styleValue + "df"];
            delete delayTimer[el[styleValue + "dfp"]];
            delete el[styleValue + "dfp"];
            delete delaySTimer[el[styleValue + "dfp"]];
            delete startTimer[el[styleValue + "dfp"]];
            delete pauseTimer[el[styleValue + "dfp"]];
        }
        if (el[styleValue + "cf"] !== undefined) {
            clearInterval(el[styleValue + "cf"]["cid"]);
            delete el[styleValue + "cf"];
            delete callFunction[el[styleValue + "cfp"]];
            delete el[styleValue + "cfp"];
        }
    }

    function makeThisPropertyAnimate(el, startVal, styleValue, endVal, _propNum_, ease,callback) {
        isPlaying = true;
        var styleChange = el.style;
        el[styleValue + "cfp"] = _propNum_;
        var callBackFun = el[styleValue + "cf"] = callFunction[_propNum_] = function() {
            if (el["delta"] <= endDeltaValue && (styleChange[styleValue] !== endVal + "px")) {
                el["delta"] ++;
                var calVal = mainObj[ease](el["delta"], startVal, endVal - startVal, endDeltaValue) + "px";
                styleChange[styleValue] = calVal;
            } else {                
                stopPreviousAnimation(el, styleValue);
                var element_count = 0;
                for (e in callFunction) {
                    element_count++;
                }
                if (!element_count) {
                    isPlaying = false;
                    if(callback){callback();}
                }
                styleChange[styleValue] = endVal + "px";
            }
        }
        cfn(callBackFun, 1)
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
    animate: function(obj,callback) {
        jsObject.animate(this.el, obj,callback);
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
