//Управление центральным таймером.
var timers = {
    timerID:0,
    timers: [],

    //Добавить задачу.
    add: function(fn){
        this.timers.push(fn);
    },

    //Запустить задачи.
    start: function(){
        if (this.timerID) return;
        (function runNext(){
            if (timers.timers.length>0){
                for (var i=0;i<timers.timers.length;i++){
                    if (timers.timers[i]()===false){
                        timers.timers.splice(i, 1);
                        i--;
                    }
                }
                timers.timerID = setTimeout(runNext, 0);
            }
        })();
    },

    //Остановить выполнение задач.
    stop: function(){
        clearTimeout(this.timerID);
        this.timerID=0;
    }
};