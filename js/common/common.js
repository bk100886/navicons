//Модуль общего назначения
var common = (function(){
    /**
     * Проверка параметров на доступность.
     * @param  {...any} values Параметры.
     * @returns {boolean} True, если все параметры доступны.
     */
    function allDefined(...values){
        var result = true;
        if (typeof values === "undefined") return false;
        if (!Array.isArray(values)) return false;
        for (i=0;i<values.length;i++){
            if (typeof values[i] ==="undefined"){
                result=false;
                break;
            }
        }
        return result;
    }
    /**
     * Проверка параметров на null.
     * @param  {...any} values Параметры.
     * @returns {boolean} True, если хотябы один из параметров имеет значение null.
     */
    function hasNull(...values){
        var result = false;
        if (typeof values === "undefined") return result;
        if (!Array.isArray(values)) return result;
        for (i=0;i<values.length;i++){
            if (typeof values[i] !=="undefined"){
                if (values[i]===null){
                    result=true;
                    break;
                }
            }
        }
        return result;
    }
    /**
     * Получить текущий год.
     * @returns {number} Год.
     */
    function getYear(){
        return new Date().getFullYear();
    }

    /**
     * Делает первый символ строки заглавной буквой.
     * @param {*} str 
     * @returns {string} Строка.
     */
    function ucfirst(str) {
        if (typeof str !== "string") return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return{
        allDefined:allDefined,
        getYear:getYear,
        hasNull:hasNull,
        ucfirst:ucfirst
    };
})();