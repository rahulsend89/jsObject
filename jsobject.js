log = function(val) {
    console.log(val);
}
/**
 * Making Prototype of ar[string] using loop
 */
var arForFunClass = ["addClass", "removeClass", "toggleClass", "hasClass", "css", "click", "mouseover", "mouseout", "addEvent", "removeEvent"];
for (var inc = 0; inc < arForFunClass.length; inc++) {
    var tempVal = arForFunClass[inc];
    jsObject.prototype[tempVal] = (function(arVar) {
        if (arVar == "css") {
            return function(css, value) {
                jsObject[arVar](this.el, css, value);
            }
        } else if (arVar == "click" || arVar == "mouseover" || arVar == "mouseout") {
            return function(fn) {
                var that = this;
                jsObject.addEvent(this.el, arVar, function(e) {
                    fn.call(that, e);
                });
                return this;
            };

        }else if(arVar=="addEvent"||arVar=="removeEvent"){
            return function(evt,fn) {
                var that = this;
                jsObject[arVar](this.el, evt, function(e) {
                    fn.call(that, e);
                });
                return this;
            };
        } else {
            return function(classVal) {
                jsObject[arVar](this.el, classVal);
            }
        }
    })(tempVal);
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
jsObject.extend({
    css: function(el, css, value) {
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
    },
    hasClass: function(el, value) {
        return (" " + el.className + " ").indexOf(" " + value + " ") > -1;
    },
    addClass: function(el, value) {
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
    },
    removeClass: function(el, value) {
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
    },
    toggleClass: function(el, value) {
        var classNames = value.split(/\s+/),
            i = 0,
            className;

        while (className = classNames[i++]) {
            this[this.hasClass(el, className) ? "removeClass" : "addClass"](el, className);
        }
    },
    createElement: function(obj) {
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
    }
});



/*** DOM Object Stuff ***/

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
/*** Language Extensions ***/
if (typeof String.prototype.trim === "undefined") {
    String.prototype.trim = function() {
        return this.replace(/^\s+/, "").replace(/\s+$/, "");
    };
}
