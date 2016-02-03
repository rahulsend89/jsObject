var require = (function(global) {
    var head = document.getElementsByTagName("head")[0],
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
        createScriptElement = function(url,moduleName,scriptLoadedCallBack){
            var node = document.createElement('script'),
                onScriptLoad = function(evt) {
                    if (evt.type === 'load' ||
                        (testReg.test((evt.currentTarget || evt.srcElement).readyState))) {
                        var node = evt.currentTarget || evt.srcElement,
                            moduleName = node.getAttribute('data-definedmodule');
                        removeListener(node, onScriptLoad, 'load', 'onreadystatechange');
                        (global[moduleName] !== undefined)? scriptLoadedCallBack(global[moduleName]) : scriptLoadedCallBack();
                    }
                };
            node.type = 'text/javascript';
            node.charset = 'utf-8';
            node.async = true;
            addListener(node, onScriptLoad, 'load', 'onreadystatechange');
            head.appendChild(node);
            node.src = url;
            node.setAttribute('data-definedmodule', moduleName);
            return node;
        },
         requireMain = function(requiredObj,scriptCallback) {
             var i = 0,
                 modAr = [];
             for (var key in requiredObj) {
                 i++;
                 var srcPath = requiredObj[key],
                     moduleName = key;
                 createScriptElement(srcPath, moduleName, function (modName) {
                     modAr.push(modName);
                     i--;
                     if (i === 0) {
                         if (scriptCallback !== undefined) {
                             scriptCallback.apply(null, modAr);
                         }
                     }
                 });
             }
         };
    return requireMain;
})(this);