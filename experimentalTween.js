var _setInterval = function(fn, delay) {
        if (!fn["id"]) {
            var returnVal = fn["id"] = _getMaxCount(),
                cached_function = fn;
            fn = (function() {
                return function() {
                    cached_function.apply(this, arguments);
                    if (cached_function["id"]) {
                        cached_function["cid"] = setTimeout(fn, delay);
                    }
                }
            })();
            fn.call();
            return returnVal;
        }
    },
    _clearInterval = function(fn) {
        fn["id"] = 0;
        clearTimeout(fn["cid"]);
        delete fn["id"];
        delete fn["cid"];
    },
    _getMaxCount = (function() {
        var numCount = 1;
        return function() {
            return numCount++;
        };
    })();