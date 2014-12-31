var _setInterval = function(fn, delay) {
        if (!fn["id"]) {
            var timerVal = _getMaxCount(),
                returnVal = fn["id"] = timerVal,
                cached_function = fn;
            _timerObject[timerVal] = returnVal;
            _timerObject["fn" + timerVal] = fn;
            fn = (function() {
                return function() {                    
                    if (_timerObject[timerVal]) {
                        cached_function.apply(this, arguments);
                        cached_function["cid"] = setTimeout(fn, delay);
                    }
                }
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
        delete fn["cid"];
        delete fn["id"];
    },
    _getMaxCount = (function() {
        var numCount = 1;
        return function() {
            return numCount++;
        };
    })(),
    _timerObject = {};