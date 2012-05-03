/**
 * Augment Object
 */
Object.mixin = function(receiver /*, sources,... */) {
  var sources = Array.from(arguments).slice(1);
  for (var i=0,l=sources.length;i<l;i++) {
    var source = sources[i];
    for (var p in source) if (source && source.hasOwnProperty(p) && source[p] !== undefined) {
      receiver[p] = source[p]; // property copying
    }
  };
  return receiver;
};

/**
 * setup prototype chain and copy additional properties to the instance
 */
Object.create = function(/* mixins */) {
  var instance = new this();
  Object.mixin.apply(Object, [instance].concat(Array.from(arguments)));
  return instance;
};

/**
 * create the prototype object of a new klass and mixin to the prototype
 */
Object.extend = function(/* mixins */) {
  var klass = new Function();
  klass.prototype = this.create.apply(this,arguments);

  klass.extend = Object.extend.bind(klass);
  klass.create = Object.create.bind(klass);

  return klass;
};
