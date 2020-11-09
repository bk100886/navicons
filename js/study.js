(function(){
    const 
        requiredMethods = ["Study.GetData", "collections.Collection", "collections.collection"],//необходимые для работы методы
        loadingErrorTitle = "Ошибка загрузки",
        loadingErrorContent = "Не удалось загрузить одну из библиотек! Обратитесь к администратору сайта.",
        loadingErrorConsole = "Не загружен метод",
        incorrectDataContent = "Некорректный формат данных.";
    
    executor(true, requiredMethods)
    .init(()=>{
        defineToConsole();//определяем метод вывода на консоль
    })
    .main(()=>{
        var collection = collections.collection;//сокращаем синтаксис доступа к коллекции
        Study.GetData(data=>{
            var items = dataToItems(data);//преобразуем объект data в элементы коллекции
            study(items);
        });
    })
    .run();  

    /**
     * Определить метод вывода коллекции на консоль.
     */
    function defineToConsole(){
        collections.Collection.prototype.toConsole = function(title){
            const dashCount=25;
            var items = this.getAll();
            var maxWidth={id:0, name:0, type:0},
                dashs = Array(dashCount).join("-");
            //Рассчитываем максимальные размеры колонок.
            calcColsWidth();
            //Выводим название задачи, если название определено.
            if (typeof title ==="string") console.log(title);
            console.log(dashs);
            //Выводим коллекцию.
            items.forEach(item=>{
                _item = getAlignedValues(item);
                console.log("ID:"+_item.id+" | Имя:"+_item.name+" | Тип:"+_item.type);
            });
            console.log(dashs);
            console.log();//Отступ между задачами.
    
            function getAlignedValues(item){
                return {
                    id:getAlignedId(item.id),
                    name:getAlignedName(item.name),
                    type:getAlignedType(item.type)
                };
                function getAlignedId(value){
                    var strValue = value.toString(),
                        valueWidth = strValue.length,
                        delta = maxWidth.id-valueWidth;
                    return strValue+Array(delta+1).join(" ").toString();
                }
                function getAlignedName(value){
                    var strValue = value==null ? "" : value.toString(),
                        valueWidth =  strValue.length,
                        delta = maxWidth.name-valueWidth;
                    return strValue+Array(delta+1).join(" ").toString();
                }
                function getAlignedType(value){
                    var strValue = value==null ? "" : value.toString(),
                        valueWidth = strValue.length,
                        delta = maxWidth.type-valueWidth;
                    return strValue+Array(delta+1).join(" ").toString();
                }
            }
    
            //Рассчиывет максимальные размеры колонок.
            function calcColsWidth(){
                items.forEach(item=>{
                    var widthId = item.id.toString().length,
                    widthName = item.name==null ? 4 : item.name.length,
                    widthType = item.type==null ? 4 : item.type.toString().length;
                    maxWidth.id = widthId>maxWidth.id ? widthId : maxWidth.id;
                    maxWidth.name = widthName>maxWidth.name ? widthName : maxWidth.name;
                    maxWidth.type = widthType>maxWidth.type ? widthType : maxWidth.type;
                });
            }
        };
    }

    /**
     * Преобразовать массив объектов study в массив элементов коллекции.
     * @param {*} data Массив объектов Study.
     */
    function dataToItems(data){
        var items=[];
        data.forEach(element => {
            var item = {
                id:element.id,
                name:typeof element.name === "undefined" ? null : element.name,
                type:typeof element.type === "undefined" ? null : element.type
            };
            items.push(item);
        });
        return items;
    }
    
    //Выполнить задачи ТЗ и вывести результаты в консоль
    function study(items){
        const 
            asc = collections.order.asc,
            desc = collections.order.desc;
        var collection = collections.collection;
        //Подготовить задачи
        prepaire();
        //Выполнить задачи, вывести в консоль
        run();
        
        //Запустить задачи.
        function run(){
            //Вывести заголовок
            title(taskTitle);
            timers.start();
        }
        //Подготовить задачи.
        function prepaire(){
            var i = -1;//счетчик для вывода задач.
            timers.add(()=>{
                //0. Выводим коллекцию в ее первосданном состоянии
                collection(items).toConsole(task[++i]);
                return false;
            });
            timers.add(()=>{
                //1. Отсортировать все элементы по свойству id по возрастанию.
                collection(items).order({id:asc}).toConsole(task[++i]);
                return false;
            });
            timers.add(()=>{
                //2. Отсортировать все элементы по свойству type по возрастанию и свойству id по убыванию.
                collection(items).order({type:asc, id:desc}).toConsole(task[++i]);
                return false;
            });
            timers.add(()=>{
                //3. Выбрать только элементы с type = 2.
                collection(items).filter(item=>item.type===2).toConsole(task[++i]);
                return false;
            });
            timers.add(()=>{
                //4. Выбрать только элементы, у которых заполнено имя.
                collection(items).filter(item=>item.name!==null).toConsole(task[++i]);
                return false;
            });
            timers.add(()=>{
            //5. Добавить в коллекцию элемент с недостающим идентификатором.
            //   Отсортировать коллекцию в порядке убывания идентификаторов.
                collection(items).add({id:5, name:null, type:null}).order({id:desc}).toConsole(task[++i]);
                return false;
            });
            timers.add(()=>{
                //6. Вырезать из коллекции элементы с третьего по пятый.
                //   Поскольку нумерация начинается с нуля, то третий элемент будет с индексом 2
                collection(items).remove(2, 2).toConsole(task[++i]);
                return false;
            });
            //collection(data).filter(item=>item.name!=null).order({type:asc}).remove(0,5).toConsole();
        }
        //Вывести заголовок.
        function title(title){
            const
                symbol = "*",
                symbolCount = title.length+5;
            var symbols = Array(symbolCount).join(symbol);
            console.log(symbols);
            console.log(symbol + " "+title+" "+symbol);
            console.log(symbols);
        }
    }

    //Проверить данные на соответствие ТЗ.
    //Каждый элемент массива - объект вида:
    // id: [number],
    // name: [string],
    // type: [number]
    // Лишь свойство "id" является обязательным для данного типа объектов, остальные могут отсутствовать.
    function checkData(data){
        if (typeof data ==="undefined") return false;
        if (!Array.isArray(data)) return false;
        data.forEach(obj=>{
            //Логика проверки находится к конструкторе Item,
            //который в случае некорректных аргнументов выдает ошибку типа TypeError
            try {
                new Item(obj.id, obj.name, obj.type); 
            } catch (error) {
                if (error instanceof TypeError){
                    console.error(incorrectDataContent);
                    return false;
                }
                return false;
            }            
        });
        return true;
    }

    //Промис загрузки DOM.
    function load(){
        return new Promise(resolve=>{
            addEvent(window, 'load', resolve);
        });
    }

    // Проверить существование необходимых для работы методов.
    // Если какой-либо метод недоступен, уведомить пользователя.
    function checkRequiredMethods(){
        var result=true;
        for (var i=0; i<requiredMethods.length;i++){
            if (!isFunction(requiredMethods[i])){
                result=false;
                showErorAndLog(requiredMethods[i]);
                break;
            }
        }
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

        //Показать ошибку на экране и выдать сообщение на консоль.
        function showErorAndLog(methodName){
            document.body.innerHTML = "";
            showError(loadingErrorTitle, loadingErrorContent);
            console.error(typeof methodName==="undefined" ? loadingErrorConsole : loadingErrorConsole+" "+methodName);
        }
        
        return result;
    }

    //Вывести на экран ошибку.
    function showError(title, content){
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
        document.body.appendChild(div);
    }
})();