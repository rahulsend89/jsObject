jsObject.extend({
    expand: function(el) {
        var allchar = el.innerHTML.split(" "),
            startdiv = "<div style='position:relative;display:inline;'>",
            enddiv = "</div>",
            str = startdiv + "" + allchar.join(enddiv + " " + startdiv) + "" + enddiv,
            words = el.children,
            all_char = [];
        el.innerHTML = str;
        for (var i = 0, len = el.children.length; i < len; i++) {
            var _char = el.children[i];
            _char.innerHTML = startdiv + "" + _char.innerHTML.split("").join(enddiv + "" + startdiv) + "" + enddiv;
            for (var j = 0, _len = _char.children.length; j < _len; j++) {
                all_char.push(_char.children[j]);
            }
        }
        return {
            allchar: all_char,
            words: words
        }
    },
    revert: function(el) {
        var start = /<(div+)[^>]*?(\/)?>/g,
            end = /<\/div>/g;
        el.innerHTML = el.innerHTML.replace(start, "").replace(end, "");
    }
});
(function(o) {
    o.expand = function() {
        return {
            rvalue: jsObject.expand(this.el),
            current: this
        };
    };
    o.revert = function() {
        jsObject.revert(this.el);
        return this;
    }
})(jsObject.prototype);
