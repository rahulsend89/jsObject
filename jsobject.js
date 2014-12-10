(function(mainObj) {
    var arForFunClass = ["addClass", "removeClass", "toggleClass", "hasClass", "css", "click", "mouseover", "mouseout", "addEvent", "removeEvent"],
        readyList = [],
        readyFired = false,
        readyEventHandlersInstalled = false,
        ready = function() {
            if (!readyFired) {
                readyFired = true;
                for (var i = 0; i < readyList.length; i++) {
                    readyList[i].fn.call(window, readyList[i].ctx);
                }
                readyList = [];
            }
        },
        readyStateChange = function() {
            if (document.readyState === "complete") {
                ready();
            }
        };
    mainObj.onReady = function(callback, context) {
        if (readyFired) {
            setTimeout(function() {
                callback(context);
            }, 1);
            return;
        } else {
            readyList.push({
                fn: callback,
                ctx: context
            });
        }
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", ready, false);
                window.addEventListener("load", ready, false);
            } else {
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
    for (var inc = 0, len = arForFunClass.length; inc < len; inc++) {
        var tempVal = arForFunClass[inc];
        mainObj.prototype[tempVal] = (function(arVar) {
            if (arVar == "css") {
                return function(css, value) {
                    mainObj[arVar](this.el, css, value);
                    return this;
                }
            } else if (arVar == "click" || arVar == "mouseover" || arVar == "mouseout") {
                return function(fn) {
                    var that = this;
                    mainObj.addEvent(this.el, arVar, function(e) {
                        fn.call(that, e);
                    });
                    return this;
                };

            } else if (arVar == "addEvent" || arVar == "removeEvent") {
                return function(evt, fn) {
                    var that = this;
                    mainObj[arVar](this.el, evt, function(e) {
                        fn.call(that, e);
                    });
                    return this;
                };
            } else {
                return function(classVal) {
                    mainObj[arVar](this.el, classVal);
                    return this;
                }
            }
        })(tempVal);
    }
    if (typeof addEventListener !== "undefined") {
        mainObj.addEvent = function(obj, evt, fn) {
            obj.addEventListener(evt, fn, false);
        };

        mainObj.removeEvent = function(obj, evt, fn) {
            obj.removeEventListener(evt, fn, false);
        };
    } else if (typeof attachEvent !== "undefined") {
        mainObj.addEvent = function(obj, evt, fn) {
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

        mainObj.removeEvent = function(obj, evt, fn) {
            var fnHash = "e_" + evt + fn;

            if (typeof obj[fnHash] !== "undefined") {
                obj.detachEvent("on" + evt, obj[fnHash]);
                delete obj[fnHash];
            }
        };
    } else {
        mainObj.addEvent = function(obj, evt, fn) {
            obj["on" + evt] = fn;
        };

        mainObj.removeEvent = function(obj, evt, fn) {
            obj["on" + evt] = null;
        };
    }
    mainObj.prototype.append = function(data) {
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
    mainObj.prototype.html = function(html) {
        if (typeof html !== "undefined") {
            this.el.innerHTML = html;

            return this;
        } else {
            return this.el.innerHTML;
        }
    };
    if (typeof String.prototype.trim === "undefined") {
        String.prototype.trim = function() {
            return this.replace(/^\s+/, "").replace(/\s+$/, "");
        };
    }
    return mainObj;
})(jsObject).extend({
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
    },
    ObjToParams: function(obj) {
        var str = "",
            key;
        for (key in obj) {
            if (str != "") {
                str += "&";
            }
            str += key + "=" + encodeURIComponent(obj[key]);
        };
        return str;
    },
    ajxCall: function(Obj) {
        var xmlhttp,
            postData = Obj["data"] ? "POST" : "GET",
            params = postData ? this.ObjToParams(Obj["data"]) : undefined,
            mimetype = Obj["mimetype"] ? Obj["mimetype"] : "text/plain",
            url = Obj["url"];
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 /*&& xmlhttp.status == 200*/ ) {
                Obj["success"](xmlhttp.response);
            }
        }
        xmlhttp.open(postData, url, true);
        xmlhttp.setRequestHeader("Content-type", mimetype);
        xmlhttp.setRequestHeader("Content-length", params.length);
        xmlhttp.send(params);
    },
    parseNode: function(xmlNode, result) {
        if (xmlNode.nodeName == "#text" && xmlNode.nodeValue.trim() == "") {
            return;
        } else {
            var resuleNode = {};
            var existing = result[xmlNode.nodeName];
            if (existing) {
                if (!existing.length) {
                    result[xmlNode.nodeName] = [existing, resuleNode];
                } else {
                    result[xmlNode.nodeName].push(resuleNode);
                }
            } else if (xmlNode.nodeName != "#text") {
                result[xmlNode.nodeName] = resuleNode;
            }
            if (xmlNode.nodeValue !== null) {
                result["value"] = xmlNode.nodeValue;
            }
            if (xmlNode.attributes) {
                var length = xmlNode.attributes.length;
                for (var i = 0; i < length; i++) {
                    var attribute = xmlNode.attributes[i];
                    resuleNode[attribute.nodeName] = attribute.nodeValue;
                }
            }
            var length = xmlNode.childNodes.length;
            for (var i = 0; i < length; i++) {
                this.parseNode(xmlNode.childNodes[i], resuleNode);
            }
        }
    },
    parseXml: function(xml) {
        var dom = null;
        if (window.DOMParser) {
            dom = (new DOMParser()).parseFromString(xml, "text/xml");
        } else if (window.ActiveXObject) {
            dom = new ActiveXObject('Microsoft.XMLDOM');
            dom.async = false;
            if (!dom.loadXML(xml)) {
                throw dom.parseError.reason + " " + dom.parseError.srcText;
            }
        } else {
            throw "cannot parse xml string!";
        }

        var result = {};
        if (dom.childNodes.length) {
            this.parseNode(dom.childNodes[0], result);
        }
        return result;
    }
});
