// Credit David Walsh (https://davidwalsh.name/javascript-debounce-function)

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait, immediate) {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;

    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

export function debounceExt(func, wait, tick) {
  var timeout;
  var lastTime = 0;

  return function executedFunction() {
    var context = this;
    var args = arguments;

    var later = function() {
      timeout = null;
      func.apply(context, args);
    };

    clearTimeout(timeout);
    const now = Date.now();
    var callNow = tick && (lastTime == 0 || now - lastTime > tick);
    if (callNow) {
      lastTime = now;
      func.apply(context, args);
    } else {
      timeout = setTimeout(later, wait);
    }
  };
}
