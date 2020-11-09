//Шаблон исполнения кода с инициализацией, главной функцией, и финализацией
//Если wait - true, инициализация и финализация выполняется только после загрузки/выгрузки DOM
//requiredMethods - список методов, которые проверяются на доступность,
//если хотябы один из методов недоступен, выводится сообщение об ошибке пользователю
function executor(wait, requiredMethods){
    var _init, _main, _final,
        _reqMethods = Array.isArray(requiredMethods) ? requiredMethods : null;
        _wait = typeof wait ==="boolean" ? wait : false;
    function check(){
        const
            errorTitle = "Ошибка загрузки.",
            errorContent = "Не удалось загрузить один из модулей, обратитесь к администратору.",
            methodName = "Название метода";
        var result=true;
        if (_reqMethods!==null){
            for (var i=0; i<_reqMethods.length;i++){
                if (!isFunction(_reqMethods[i])){
                    result=false;
                    console.error(errorContent + " "+methodName+": "+requiredMethods[i]);
                    break;
                }
            }
        }
        if (!result) showError(errorTitle, errorContent);
        //Проверить, является ли stringExpresstion функцией
        function isFunction(stringExpresstion) {
            var result=false;
            try {
                var expr = "("+stringExpresstion+")";
                result = eval(expr)!=undefined;
            } catch (error) {
                
            }
            return result;
        }
        //Вывести на экран ошибку.
        function showError(title, content){
            //Если Dom не загружен выводим простой текст.
            if (document.body === null){
                document.writeln(title);
                document.writeln(content);
                return;
            }
            const
                divErrorClass = ["alert", "alert-danger", "mx-auto", "m-3", "pageError"],
                hErrorClass ="alert-heading";
            var div = document.createElement("div");
            divErrorClass.forEach(value=>div.classList.add(value));
            var h = document.createElement('h5');
            h.innerHTML = title;
            h.classList.add(hErrorClass);
            div.appendChild(h);
            var p = document.createElement(p);
            p.innerHTML = content;
            div.appendChild(p);
            document.body.innerHTML ="";
            document.body.appendChild(div);
        }
        return result;
    }    
    function init(fn){
        _init = fn; 
        return this;
    }
    function main(fn){
        _main = fn;
        return this;
    }
    function final(fn){
        _final = fn;
        return this;
    }
    function run(){  
        switch (_wait) {
            case false:
                execIfFunc(_init);
                execIfFunc(_main);
                execIfFunc(_final);
                break;
            case true:
                addEvent(window, 'beforeunload', (event)=>{
                    execIfFunc(_final);
                });
                domLoad().then(()=>{
                    if (!check()) return;
                    execIfFunc(_init);
                    execIfFunc(_main);
                });
                break;
        }     
    }
    function execIfFunc(fn){
        if (isFunc(fn)) fn();
        function isFunc(value){
            return value instanceof Function;
        }
    }
    //Промис загрузки DOM.
    function domLoad(){
        return new Promise(resolve=>{
            addEvent(window, 'load', resolve);
        });
    }

    return{
        init:init,
        main:main,
        final:final,
        run:run
    };
}