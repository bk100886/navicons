(function(){
    const 
        maxPersonAge = 90,
        maxFNameSym = 10,
        maxLNameSym = 15,
        validateError = "Не удалось обработать или проверить данные.",
        mustContainOnlyLetters = " - должно содержать только буквы",
        fNameMaxLengthText = " - должно содержать не более "+maxFNameSym+" символов",
        lNameMaxLengthText = " - должно содержать не более "+maxLNameSym+" символов",
        mustBeNotNull =" - должно быть заполнено",
        requiredMethods = ["addEvent", "cssNames", "htmlElementNames", "common", "messages"],
        months = ["Январь", "Февраль", "Март", "Апрель", "Май", 
        "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", 
        "Ноябрь", "Декабрь"],
        translates =[{Fname:"имя"}, {Lname:"фамилия"}, {City:"город"}];
    var 
        cities =["Москва", "Санкт-Петербург", "Волгоград", "Севастополь"],
        css, html, form, formSubmitEvent, formChangeEvent;

    executor(true, requiredMethods)
    .init(()=>{
        setValidatorDefaults();
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
        e.preventDefault();
        handle(form);
    }   

    //Изменить настройки по умолчанию для валидатора.
    function setValidatorDefaults(){
        validate.validators.presence.options = {message: mustBeNotNull};
    }
    
    //Создать связи валидации.
    function getConstraints(){
        var constraints = {
            fname: {
                presence: true,
                length: {
                maximum: maxFNameSym,
                message: fNameMaxLengthText
                },
                format: {
                    pattern: "[А-Яа-яA-Za-z]+",
                    flags: "i",
                    message: mustContainOnlyLetters
                }
            },
            lname: {
                presence: true,
                length: {
                maximum: maxLNameSym,
                message: lNameMaxLengthText
                },
                format: {
                    pattern: "[А-Яа-яA-Za-z]+",
                    flags: "i",
                    message: mustContainOnlyLetters
                }
            },
            city: {
                presence: true
            },
            birthDay: {
                presence: true
            },
            birthMonth: {
                presence: true
            },
            birthYear: {
                presence: true
            }
        };
        return constraints;
    }
    //Проанализировать элементы формы на предмет валидации.
    function handle(form, input) {
        resetFormCss(form);//сбросить стили формы
        var errors = validate(form, getConstraints());
        showErrors(form, errors || {});
        if (!errors) {
            showSuccess();
        }
    }
    // Показать ошибки.
    function showErrors(form, errors) {
        var focused=false;
        form.querySelectorAll("input[name], select[name]").forEach(input=>{
            for (const error in errors) {
                if (input.name===error) {
                    input.classList.add(css.isInvalid);
                    setFocus(input);
                    var elem = input.closest("."+css.formGroup).querySelector("."+css.invalidTooltip);
                    if (elem!==null) {
                        var word = common.ucfirst(input.name),
                        translation = translate(word),
                        translated = translation===null ? errors[error][0] : errors[error][0].replace(word, translation);
                        elem.innerHTML = translated;
                    }
                }
            }
        });
        // Поставить фокус на элемент.
        function setFocus(element){
            if (!focused){
                element.focus();
                focused=true;
            }
        }
    }
    /**
     * Выполнить перевод с английского на русский.
     * @param {string} word Слово. 
     * @returns {string} Если слово не найдено, возвращает null.
     */
    function translate(word){
        var result = null;
        for (var i=0;i<translates.length;i++){
            for (const key in translates[i]) {
                const element = translates[i][key];
                if (word===key){
                    result = element;
                    break;
                }
            }    
        }
        return result;
    }
    //Сбросить все ошибки формы.
    function resetFormCss(form){
        form.classList.remove('was-validated');
        form.querySelectorAll("input[name], select[name]").forEach(input=>{
            input.classList.remove(css.isInvalid);
        });

    }
    
    //Показать, что все OK!
    function showSuccess(){
        form.classList.add('was-validated');
    }
})();