var _setInterval = function(fn, delay) {
        if (!fn["id"]) {
            var timerVal = _getMaxCount(),
                returnVal = fn["id"] = timerVal,
                cached_function = fn;
            _timerObject[timerVal] = returnVal;
            _timerObject["fn" + timerVal] = fn;
            fn = (function() {
                return function() {
                    cached_function.apply(this, arguments);
                    if (_timerObject[timerVal]) {
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
        console.log(_timerObject + " : fn[cid]", fn + " : " + str);
        _timerObject[timerVal] = 0;
        delete _timerObject[timerVal];
        delete fn["cid"];
    },
    _getMaxCount = (function() {
        var numCount = 1;
        return function() {
            return numCount++;
        };
    })(),
    _timerObject = {};