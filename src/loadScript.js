var loadScript = (function() {
    var mainObj = {},
        head = document.getElementsByTagName("head")[0],
        testReg = /^(complete|loaded)$/,
        removeListener = function(node, func, name, ieName) {
            if (node.detachEvent) {
                    node.detachEvent(ieName, func);
            } else {
                node.removeEventListener(name, func, false);
            }
        },
        addListener = function(node, func, name, ieName){
            if (node.attachEvent){
                node.attachEvent(ieName, func);
            }else{
                node.addEventListener(name, func, false);
            }
        },
        onScriptLoad = function(evt) {
            if (evt.type === 'load' ||
                (testReg.test((evt.currentTarget || evt.srcElement).readyState))) {
                var node = evt.currentTarget || evt.srcElement;
                removeListener(node, onScriptLoad, 'load', 'onreadystatechange');
                mainObj.scriptCallback();
            }
        },
        createScriptElement = function(url){
            var node = document.createElement('script');
            node.type = 'text/javascript';
            node.charset = 'utf-8';
            node.async = true;
            addListener(node, onScriptLoad, 'load', 'onreadystatechange');
            head.appendChild(node);
            node.src = url;
            return node;
        };
    mainObj.scriptCallback = function(){};
    mainObj.require = function(srcPath,scriptCallback){
        createScriptElement(srcPath);
        this.scriptCallback = scriptCallback;
    };
    return mainObj;
})();