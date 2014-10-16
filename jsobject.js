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

/*** Event instance methods   ***/
jsObject.prototype.addEvent = function(evt, fn) {
    jsObject.addEvent(this.el, evt, fn);

    return this;
};

jsObject.prototype.removeEvent = function(evt, fn) {
    jsObject.removeEvent(this.el, evt, fn);

    return this;
};
jsObject['startDeltaValue'] = 0;
jsObject['endDeltaValue'] = 100;
jsObject['animationTimer'] = [];
jsObject.pause = function() {
    clearInterval(this.animationtimer);
    return this;
};
jsObject.prototype.pause = function() {
    jsObject.pause();
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
            if (!eleStyle.hasOwnProperty(strVal)) {
                if (styleValue == 'time') {
                    this.endDeltaValue = obj[styleValue];
                }
            } else {
                console.log(styleValue + " : styleValue");
                var startVal = el.style[styleValue];
                startVal = (!startVal) ? 0 : parseInt(startVal);
                this.makeThisPropertyAnimate(el, startVal,styleValue,obj[styleValue], propNum);
            }
        }
    }
}
jsObject.makeThisPropertyAnimate = function(el, startVal,styleValue,endVal,propNum) {    
    var that = this;
    var styleChange = el.style;
    var animationTimer = (function() {
        return setInterval(function() {            
            if (that.startDeltaValue <= that.endDeltaValue) {
                that.startDeltaValue++;
                var calVal = Math.linearTween(that.startDeltaValue, startVal, endVal - startVal, that.endDeltaValue)+"px";
                styleChange[styleValue] = calVal;
            } else {  
                clearInterval(animationTimer);
            }
        }, 1)
    })();
};
jsObject.prototype.animate = function(obj) {
    jsObject.animate(this.el, obj);
    return this;
};
var arForFun = ['click', 'mouseover', 'mouseout'];
var len = arForFun.length;
for (var inc = 0; inc < len; inc++) {
    var tempVal = arForFun[inc];
    jsObject.prototype[tempVal] = (function(arVar) {
        return function(fn) {
            var that = this;
            jsObject.addEvent(this.el, arVar, function(e) {
                fn.call(that, e);
            });
            return this;
        };
    })(arForFun[inc]);
}
/*** Event static methods ***/
if (typeof addEventListener !== "undefined") {
    jsObject.addEvent = function(obj, evt, fn) {
        obj.addEventListener(evt, fn, false);
    };

    jsObject.removeEvent = function(obj, evt, fn) {
        obj.removeEventListener(evt, fn, false);
    };
} else if (typeof attachEvent !== "undefined") {
    jsObject.addEvent = function(obj, evt, fn) {
        var fnHash = "e_" + evt + fn;

        obj[fnHash] = function() {
            var type = event.type,
                relatedTarget = null;

            if (type === "mouseover" || type === "mouseout") {
                relatedTarget = (type === "mouseover") ? event.fromElement : event.toElement;
            }

            fn.call(obj, {
                target: event.srcElement,
                type: type,
                relatedTarget: relatedTarget,
                _event: event,
                preventDefault: function() {
                    this._event.returnValue = false;
                },
                stopPropagation: function() {
                    this._event.cancelBubble = true;
                }
            });
        };

        obj.attachEvent("on" + evt, obj[fnHash]);
    };

    jsObject.removeEvent = function(obj, evt, fn) {
        var fnHash = "e_" + evt + fn;

        if (typeof obj[fnHash] !== "undefined") {
            obj.detachEvent("on" + evt, obj[fnHash]);
            delete obj[fnHash];
        }
    };
} else {
    jsObject.addEvent = function(obj, evt, fn) {
        obj["on" + evt] = fn;
    };

    jsObject.removeEvent = function(obj, evt, fn) {
        obj["on" + evt] = null;
    };
}

/*** Style static methods ***/
jsObject.css = function(el, css, value) {
    var cssType = typeof css,
        valueType = typeof value,
        elStyle = el.style;

    if (cssType !== "undefined" && valueType === "undefined") {
        if (cssType === "object") {
            // set style info
            for (var prop in css) {
                if (css.hasOwnProperty(prop)) {
                    elStyle[toCamelCase(prop)] = css[prop];
                }
            }
        } else if (cssType === "string") {
            // get style info for specified property
            return getStyle(el, css);
        } else {
            throw {
                message: "Invalid parameter passed to css()"
            };
        }

    } else if (cssType === "string" && valueType === "string") {
        elStyle[toCamelCase(css)] = value;

    } else {
        throw {
            message: "Invalid parameters passed to css()"
        };
    }
};

jsObject.hasClass = function(el, value) {
    return (" " + el.className + " ").indexOf(" " + value + " ") > -1;
};

jsObject.addClass = function(el, value) {
    var className = el.className;

    if (!className) {
        el.className = value;
    } else {
        var classNames = value.split(/\s+/),
            l = classNames.length;

        for (var i = 0; i < l; i++) {
            if (!this.hasClass(el, classNames[i])) {
                className += " " + classNames[i];
            }
        }

        el.className = className.trim();
    }
};

jsObject.removeClass = function(el, value) {
    if (value) {
        var classNames = value.split(/\s+/),
            className = " " + el.className + " ",
            l = classNames.length;

        for (var i = 0; i < l; i++) {
            className = className.replace(" " + classNames[i] + " ", " ");
        }

        el.className = className.trim();

    } else {
        el.className = "";
    }
};

jsObject.toggleClass = function(el, value) {
    var classNames = value.split(/\s+/),
        i = 0,
        className;

    while (className = classNames[i++]) {
        this[this.hasClass(el, className) ? "removeClass" : "addClass"](el, className);
    }
};

/*** Style instance methods ***/
jsObject.prototype.css = function(css, value) {
    return jsObject.css(this.el, css, value) || this;
};

jsObject.prototype.addClass = function(value) {
    jsObject.addClass(this.el, value);

    return this;
};

jsObject.prototype.removeClass = function(value) {
    jsObject.removeClass(this.el, value);

    return this;
};

jsObject.prototype.toggleClass = function(value) {
    jsObject.toggleClass(this.el, value);

    return this;
};

jsObject.prototype.hasClass = function(value) {
    return jsObject.hasClass(this.el, value);
};

/*** DOM Object Stuff ***/
jsObject.createElement = function(obj) {
    if (!obj || !obj.tagName) {
        throw {
            message: "Invalid argument"
        };
    }

    var el = document.createElement(obj.tagName);
    obj.id && (el.id = obj.id);
    obj.className && (el.className = obj.className);
    obj.html && (el.innerHTML = obj.html);

    if (typeof obj.attributes !== "undefined") {
        var attr = obj.attributes,
            prop;

        for (prop in attr) {
            if (attr.hasOwnProperty(prop)) {
                el.setAttribute(prop, attr[prop]);
            }
        }
    }

    if (typeof obj.children !== "undefined") {
        var child,
            i = 0;

        while (child = obj.children[i++]) {
            el.appendChild(this.createElement(child));
        }
    }

    return el;
};

jsObject.prototype.append = function(data) {
    if (typeof data.nodeType !== "undefined" && data.nodeType === 1) {
        this.el.appendChild(data);
    } else if (data instanceof jsObject) {
        this.el.appendChild(data.el);
    } else if (typeof data === "string") {
        var html = this.el.innerHTML;

        this.el.innerHTML = html + data;
    }

    return this;
};

jsObject.prototype.html = function(html) {
    if (typeof html !== "undefined") {
        this.el.innerHTML = html;

        return this;
    } else {
        return this.el.innerHTML;
    }
};

jsObject.parseXML = function(data) {
    var xml, tmp;
    if (!data || typeof data !== "string") {
        return null;
    }

    // Support: IE9
    try {
        tmp = new DOMParser();
        xml = tmp.parseFromString(data, "text/xml");
    } catch (e) {
        xml = undefined;
    }

    if (!xml || xml.getElementsByTagName("parsererror").length) {
        jQuery.error("Invalid XML: " + data);
    }
    return xml;
};

/*** Helper Functions ***/
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
log = function(val){
    console.log(val);
}
//Animation function 
Math.linearTween = function(t, b, c, d) {
    return c * t / d + b;
};

Math.easeInElastic = function(t, b, c, d, a, p) {
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * .3;
    if (a < Math.abs(c)) {
        a = c;
        var s = p / 4;
    } else var s = p / (2 * Math.PI) * Math.asin(c / a);
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
};
/*** Language Extensions ***/
if (typeof String.prototype.trim === "undefined") {
    String.prototype.trim = function() {
        return this.replace(/^\s+/, "").replace(/\s+$/, "");
    };
}
