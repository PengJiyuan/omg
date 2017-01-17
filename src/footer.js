  
  //exports to multiple environments
  if(typeof exports === 'object' && typeof module === 'object') {
    module.exports = LCL;
  } else if(typeof define === 'function' && define.amd) {
    define(function(){
      return LCL;
    });
  } else {
    window.LCL = LCL;
  }

})();