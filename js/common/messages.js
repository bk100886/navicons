//Модуль сообщений
var messages = (function(){
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
    return{
        showError:showError,
        loadingError: "Ошибка загрузки",
        dataProcessingError: "Ошибка обработки данных"
    };
})();