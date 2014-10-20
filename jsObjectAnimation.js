function jsObject(obj) {
    if (this === window) {
        return new jsObject(obj);
    }
    var type = typeof obj;
    if (type === "string") {
        this.el = document.getElementById(obj);
    } else if (type === "object" && obj.nodeType !== "undefined" && obj.nodeType === 1) {
        this.el = obj;
    } else {
        throw new Error("Argument is of wrong type");
    }
}
jsObject['startDeltaValue'] = 0;
jsObject['endDeltaValue'] = 100;
jsObject['animationTimer'] = [];
jsObject.isPlaying = false;
jsObject.pause = function() {
    if (this.isPlaying) {
        this.isPlaying = false;
        var len = this.animationtimer.length;
        for (var i = 0; i < this.animationtimer.length; i++) {
            clearInterval(this.animationtimer[i]);
        };
    }else{
        this.isPlaying = true;
        var len = this.animationtimer.length;
        for (var i = 0; i < this.animationtimer.length; i++) {
            this.animationtimer[i] = setInterval(this.callFunction[i],1);
        };
    }
    return this;
};

jsObject.prototype.pause = function() {
    jsObject.pause();
    return this;
};
jsObject.animate = function(el, obj) {
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
            startVal = (!startVal) ? 0 : parseInt(startVal);
            this.startDeltaValue = 0;
            this.makeThisPropertyAnimate(el, startVal, styleValue, obj[styleValue], propNum, easeVal);
        }
    }
}
jsObject.makeThisPropertyAnimate = function(el, startVal, styleValue, endVal, propNum, ease) {
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
                clearInterval(animationTimer);
                this.isPlaying = false;
            }
        }
        that.animationtimer[propNum] = setInterval(that.callFunction[propNum], 1)
        return that.animationtimer[propNum];
    })();
};
jsObject.prototype.animate = function(obj) {
    jsObject.animate(this.el, obj);
    return this;
};
jsObject.linearTween = function(t, b, c, d) {
    return c * t / d + b;
};