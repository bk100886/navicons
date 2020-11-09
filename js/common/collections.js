//Модуль работы с коллекциями.
var collections = 
(function(){
    /**
     * Коллекция.
     */
    function Collection(){
        //Хранилище элементов коллекци.
        var storage = [];
        
        /**
         * Получить элементы коллекции.
         * @returns {Array} Список элементов коллекции.
         */
        this.getAll = function(){
            return storage.slice();
        };

        /**
         * @param {InstanceType<Item>} item Элемент коллекции.
         * @returns {ThisType} Ссылка на текущую коллекцию.
         */
        this.add = function(item){
            if (typeof item ==="object") storage.push(item);
            return this;
        };
        
        /**
         * Удалить элемент.
         * @param {number} index Индекс элемента коллекции.
         * @param {number} [count=1] Количество удалемых элементов.
         * @returns {ThisType} Ссылка на текущую коллекцию.
         */
        this.remove = function(index, count){
            count = typeof count === "undefined" ? 1 : count;
            if (typeof index ==="number" && 
                typeof count === "number") storage.splice(index, count);
            return this;
        };

        /**
         * Получить элемент коллекции.
         * @param {number} [index] Индекс элемента коллекции.
         * @returns {InstanceType<Item>} Элемент коллекции.
         */
        this.getItem = function(index){
            return typeof index === "number" ? storage[index] : undefined;
        };
        
        /**
         * Изменить элемент.
         * @param {number} index Индекс элемента коллекции. 
         * @param {InstanceType<Item>} value Значение.
         * @returns {ThisType} Ссылка на текущую коллекцию.
         */
        this.setItem = function(index, value){
            if (typeof index==="number" &&
                isItem(value)) storage[index] = value;
            return this;
        };

        /**
         * Возврашает количество элементов в коллекции.
         * @returns {number} Количество элементов в коллекции.
         */
        this.getCount = function(){
            return storage.length;
        };

        /**
         * Упорядочить элементы коллекции.
         * @param {*} conditions Параметры. 
         * @returns {Collection} Новый экземпляр коллекции с упорядоченными элементами.
         */
        this.order = function(conditions){
            return collection(storage.slice().sort(compare(conditions)));
        };
        /**
         * Фильтрует элементы коллекции.
         * @param {*} predicate Условия.
         * @returns {Collection} Новый экземпляр коллекции с отфильтрованными элементами.
         */
        this.filter = function(predicate){
            return collection(storage.slice().filter(predicate));    
        };
 
    }
    
    /**
         * Компаратор полей элемента коллекции.
         * @param {InstanceType<Item>} item Элемент коллекции. 
         */
    function compare(item) {
            var len = arguments.length,
                fields, orders;
            if(typeof item === 'object') {
                fields = Object.getOwnPropertyNames(item);
                orders = fields.map(key => item[key]);
                len = fields.length;
            }
            return (a, b) => {
                for(var i = 0; i < len; i++) {
                    //Учитываем значения null.
                    if (a[fields[i]]===null) return orders[i];
                    if (b[fields[i]]===null) return -orders[i];
    
                    if(a[fields[i]] < b[fields[i]]) return orders[i];
                    if(a[fields[i]] > b[fields[i]]) return -orders[i];
                }
                return 0;
            };
    }  
    
    /**
     * Возвращает новую коллекцию, инициализируя ее объектами.
     * @param {[]} objects Массив объектов.
     * @returns {Collection} Коллекция. 
     */
    function collection(objects){
        var collection = new Collection();
        if (isFieldNamesEqual(objects)){
            objects.forEach(obj => {
                collection.add(obj);
            });
        }
            
        /**
         * Проверить, чтобы поля объектов имели одинаковые имена.
         * @param {*} objects Массив объектов.
         * @returns {boolean} Результат.  
         */
        function isFieldNamesEqual(objects){
            var fields = [];
            objects.forEach(obj => fields.push(JSON.stringify(Object.getOwnPropertyNames(obj))));
            //Объекты Set позволяют сохранять уникальные значения любого типа
            return [...new Set(fields)].length===1;
        }

        return collection;

    }

    return {
        order:{
            asc:-1,
            desc:1
        },
        Collection:Collection,
        collection:collection
    };
})();