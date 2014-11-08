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
jsObject.extend({
    startDeltaValue: 0,
    endDeltaValue: 100,
    animationTimer: [],
    isPlaying: false,
    pause: function() {
        if (this.isPlaying) {
            this.isPlaying = false;
            var len = this.animationtimer.length;
            for (var i = 0; i < this.animationtimer.length; i++) {
                clearInterval(this.animationtimer[i]);
            };
        } else {
            this.isPlaying = true;
            var len = this.animationtimer.length;
            for (var i = 0; i < this.animationtimer.length; i++) {
                this.animationtimer[i] = setInterval(this.callFunction[i], 1);
            };
        }
        return this;
    },
    animate: function(el, obj) {
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
                        this.endDeltaValue = obj[styleValue];
                    }
                    if (styleValue == 'ease') {
                        easeVal = obj['ease'];
                    }
                }
                if (!this.animationtimer) {
                    this.animationtimer = [];
                    this.callFunction = [];
                }
                this.animationtimer[propNum] = 0;
                var startVal = el.style[styleValue];
                startVal = (!startVal) ? 10 : parseInt(startVal);
                this.startDeltaValue = 0;
                var type = typeof obj[styleValue];
                if (type !== "string" && styleValue !== "time") {
                    this.makeThisPropertyAnimate(el, startVal, styleValue, obj[styleValue], propNum, easeVal);
                }
            }
        }
    },
    makeThisPropertyAnimate: function(el, startVal, styleValue, endVal, propNum, ease) {
        var that = this;
        this.isPlaying = true;
        var styleChange = el.style;
        var animationTimer = (function() {
            that.callFunction[propNum] = function() {
                if (that.startDeltaValue <= that.endDeltaValue) {
                    that.startDeltaValue++;
                    var calVal = that[ease](that.startDeltaValue, startVal, endVal - startVal, that.endDeltaValue) + "px";
                    styleChange[styleValue] = calVal;
                } else {                    
                    clearInterval(that.animationtimer[propNum]);
                    that.isPlaying = false;
                    styleChange[styleValue] = endVal +"px";
                }
            }
            that.animationtimer[propNum] = setInterval(that.callFunction[propNum], 1)
            return that.animationtimer[propNum];
        })();
    },
    linearTween: function(t, b, c, d) {
        return c * t / d + b;
    }
})();
jsObject.prototype.animate = function(obj) {
    jsObject.animate(this.el, obj);
    return this;
};
jsObject.prototype.pause = function() {
    jsObject.pause();
    return this;
};
