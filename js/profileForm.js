(function(){
    const 
        maxPersonAge = 90,
        validateSuccess = "валидация данных прошла успешно",
        validateError = "Не удалось обработать или проверить данные.",
        maxfNameLengthInvalidMsg = "максимальная длина имени - 10 символов",
        maxlNameLengthInvalidMsg = "максимальная длина фамилии - 15 символов",
        birthDayInvalidMsg = "дата рождения заполнена неполностью",
        requiredMethods = ["addEvent", "cssNames", "htmlElementNames", "common", "messages"],
        months = ["Январь", "Февраль", "Март", "Апрель", "Май", 
        "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", 
        "Ноябрь", "Декабрь"];
    var 
        cities =["Москва", "Санкт-Петербург", "Волгоград", "Севастополь"],
        css, html, form, formSubmitEvent, formChangeEvent;

    executor(true, requiredMethods)
    .init(()=>{
        css = cssNames;//алиас доступа к модулю с наименованиям стилей css
        html = htmlElementNames;//алиас доступа к модулю с наименованиями html элементов
        form  = document.getElementById('profileForm');
        if (common.hasNull(form)){
            messages.showError(messages.dataProcessingError, validateError);
            return;
        }      
        createEvents();//создать события     
    })
    .main(()=>{
        fillForm();//заполнить форму данными
    })
    .final(()=>{
        removeEvents();//удалить события
    })
    .run();//Запуск точки входа init

    //Создать события.
    function createEvents(){
        formSubmitEvent = addEvent(form, "submit", onSubmit);
        formChangeEvent = addEvent(form, "change", onSubmit);
    }

    //Удалить события.
    function removeEvents(){
        removeEvent(form, "submit", formSubmitEvent);
        removeEvent(form, "change", formChangeEvent);
    }

    //Заполнить форму данными.
    function fillForm(){
        fillCities();
        fillDays();
        fillMonths();
        fillYeas();
    }

    // Заполнить числа месяца.
    function fillDays(){
        var select = document.getElementById("birthDay");
        if (common.hasNull(select)){
            messages.showError(messages.dataProcessingError, validateError);
            return;
        }
        for(var i=1;i<=31;i++){
            var opt = document.createElement(html.option);
            opt.value = opt.innerHTML = pad(i, 2);
            select.appendChild(opt);
        }
        function pad(num, size) {
            num = num.toString();
            while (num.length < size) num = "0" + num;
            return num;
        }
    }

    // Заполнить названия месяцев
    function fillMonths(){
        var select = document.getElementById("birthMonth");
        if (common.hasNull(select)){
            messages.showError(messages.dataProcessingError, validateError);
            return;
        }
        months.forEach((value, index)=>{
            var opt = document.createElement('option');
            opt.value = index;
            opt.innerHTML = value;
            select.appendChild(opt);
        });
    }

    // Заполнить список годов.
    function fillYeas(){
        const
            currentYear = common.getYear(),
            startYear = currentYear-maxPersonAge;
        var select = document.getElementById("birthYear");
        if (common.hasNull(select)){
            messages.showError(messages.dataProcessingError, validateError);
            return;
        }
        for (var year=startYear;year<=currentYear;year++){
            var opt = document.createElement('option');
            opt.value = opt.innerHTML = year;
            select.appendChild(opt);
        }
    }

    // Заполнить города.
    function fillCities(){
        var select = document.getElementById("city");
        if (common.hasNull(select)){
            messages.showError(messages.dataProcessingError, validateError);
            return;
        }
        cities.sort().forEach((value, index)=>{
            var opt = document.createElement('option');
            opt.value = index;
            opt.innerHTML = value;
            select.appendChild(opt);
        });
    }

    // Обработчик событя сабмита формы
    function onSubmit(e){
        var _alert = document.getElementById("alert");
        if (_alert===null) return;
        _alert.classList.remove(css.alertDanger);
        _alert.classList.remove(css.alertSuccess);
        _alert.innerHTML = "";
        var errors = validate();
        if (errors.length>0){
            e.preventDefault();
            e.stopPropagation();
            var ul = document.createElement(html.ol);
            ul.classList.add(css.pl3);
            ul.classList.add(css.pb0);
            errors.forEach((value)=>{
                var li = document.createElement(html.li);
                li.innerHTML = value;
                ul.appendChild(li);
            });
            _alert.appendChild(ul);
            _alert.classList.add(css.alertDanger);
            _alert.classList.remove(css.dNone);
        }
        else{
            _alert.innerHTML = validateSuccess;
            e.preventDefault();
            e.stopPropagation();
            _alert.classList.add(css.alertSuccess);
            _alert.classList.remove(css.dNone);
        }
    }

    // Возвращает список ошибок валидации,
    // помечая невалидные элементы красным
    function validate(){
        var errors=[],
            focused=false,
            fname = document.getElementById("fname"),
            lname = document.getElementById("lname"),
            city = document.getElementById("city"),
            birthDay = document.getElementById("birthDay"),
            birthMonth = document.getElementById("birthMonth"),
            birthYear = document.getElementById("birthYear");
            if (common.hasNull(fname, lname, city, birthDay, birthMonth, birthYear)){
                messages.showError(messages.dataProcessingError, validateError);
                return;
            }
            //Валидировать пустые незаполненные поля.
            //validateEmpty();

            //Валидировать поля согласно ТЗ 2 урока.
            customLessonValidation();

            // Валидировать поля согласно ТЗ 2 урока.
            function customLessonValidation(){
                if (fname.value.length>10) {addError(fname, maxfNameLengthInvalidMsg);}else removeError(fname);
                if (lname.value.length>15) {addError(lname, maxlNameLengthInvalidMsg);}else removeError(lname);
            
                var birthIsInvalid = birthDay.value==="" || birthMonth==="" || birthYear.value==="";
                
                if (birthIsInvalid) errors.push(birthDayInvalidMsg);
                if (birthDay.value==="") {addError(birthDay);}else removeError(birthDay);
                if (birthMonth.value==="") {addError(birthMonth);}else removeError(birthMonth);
                if (birthYear.value==="") {addError(birthYear);}else removeError(birthYear);
                
            }

            // Выделить все не заполненные поля. Если все поля заполнены, вернуть true
            // function validateEmpty(){
            //     var result = true;
            //     if (fname.value==="") {addError(fname, "имя не заполнено");}else removeError(fname);
            //     if (lname.value==="") {addError(lname, "фамилия не заполнена");}else removeError(lname);
            //     if (city.value==="") {addError(city, "город не выбран");}else removeError(city);
    
            //     var birthIsInvalid = birthDay.value==="" || birthMonth==="" || birthYear.value==="";
                
            //     if (birthIsInvalid) errors.push("Дата рождения не заполнена");
            //     if (birthDay.value==="") {addError(birthDay);}else removeError(birthDay);
            //     if (birthMonth.value==="") {addError(birthMonth);}else removeError(birthMonth);
            //     if (birthYear.value==="") {addError(birthYear);}else removeError(birthYear);
            //     return errors.length>0;
            // }

            // Добавить ошибку.
            function addError(element, msg){
                if (typeof msg !=="undefined") errors.push(msg);
                element.classList.add(css.isInvalid);
                setFocus(element);
            }

            //Удалить ошибку.
            function removeError(element){
                element.classList.remove(css.isInvalid);
            }
            
            // Поставить фокус на элемент.
            function setFocus(element){
                if (!focused){
                    element.focus();
                    focused=true;
                }
            }

        return errors;
    }   
})();