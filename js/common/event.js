(function(){
    if (document.addEventListener) {
        this.addEvent = function (elem, type, fn) {
          elem.addEventListener(type, fn, false);
          return fn;
        };
    
        this.removeEvent = function (elem, type, fn) {
          elem.removeEventListener(type, fn, false);
        };
      }
      else if (document.attachEvent) {
    
        this.addEvent = function (elem, type, fn) {
          var bound = function () {
            return fn.apply(elem, arguments);
          };
          elem.attachEvent("on" + type, bound);
          return bound;
        };
    
        this.removeEvent = function (elem, type, fn) {
          elem.detachEvent("on" + type, fn);
        };
      }   
})();