/**
 * Augment Array
 */
Array.from = function(arraylike) {
  var a = [];
  if (arraylike && arraylike.length) {
    for (var i=0,l=arraylike.length;i<l;i++) {
      a.push(arraylike[i]);
    }
  } else if (arraylike !== undefined) {
    a.push(arraylike);
  }
  return a;
};

Array.prototype.contains = function(item) {
  return this.indexOf(item) >= 0;
}

/**
 * Augment Function.prototype
 */
Function.prototype.curry = function() {
  var curried = Array.from(arguments);
  var that = this;
  return function() {
    return that.apply(this,curried.concat(Array.from(arguments)));
  };
};

Function.prototype.bind = function(scope) {
  var that = this;
  return function() {
    return that.apply(scope,arguments);
  };
};
