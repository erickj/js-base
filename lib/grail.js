/**
 * @fileoverview This is a lightweight utility for javascript inheritance
 * heavily inspired by the Closure library {@code goog.inherits} and
 * {@code goog.base}.
 */
goog.provide('grail');


/**
 * @const {string}
 * @private
 */
grail.SUPER_PROP_ = '$super';


/**
 * Extends prototype chain of {@code childCtor} from
 * {@code parentCtor.prototype}.
 * @param {!Function} childCtor
 * @param {!Function} parentCtor
 */
grail.inherit = function(childCtor, parentCtor) {
  if (childCtor === parentCtor) {
    throw Error('Unable to inherit a class from itself');
  } else if (childCtor.prototype.isPrototypeOf(parentCtor.prototype)) {
    throw Error('Unable to create circular inheritance');
  } else if (childCtor[grail.SUPER_PROP_]) {
    throw Error('Unable to call grail.inherit more than once per constructor');
  }

  var preservedProperties =
      grail.getOwnPropertyDescriptors_(childCtor.prototype);
  childCtor.prototype =
      Object.create(parentCtor.prototype, preservedProperties);

  /** @override */
  childCtor.prototype.constructor = childCtor;

  Object.defineProperty(childCtor.prototype, grail.SUPER_PROP_, {
    'configurable': false,
    'enumerable': false,
    'value': parentCtor.prototype,
    'writable': false
  });
};


/**
 * Either calls the parent constructor if this is the instantiation of
 * {@code scope} or calls the {@code $super} method of {@code scope}. The method
 * or super constructor will be called with all arguments minus the first 2.
 * @param {!Object} scope
 * @param {string|!Function} methodNameOrCtor
 * @param {...*} var_args The method arguments
 * @return {*} The result of the {@code $super} method
 */
grail.call = function(scope, methodNameOrCtor, var_args) {
  var superProto = scope[grail.SUPER_PROP_];
  if (!superProto) {
    throw Error('Can not find superclass. Missing call to grail.inherit');
  }

  var args = Array.prototype.slice.call(arguments, 2);

  var isInstantiation = scope.constructor == methodNameOrCtor
  if (isInstantiation) {
    return superProto.constructor.apply(scope, args);
  } else {
    var method = superProto[methodNameOrCtor];
    if (!method) {
      throw Error('No superclass method named ' + methodNameOrCtor);
    }
    return method.apply(scope, args);
  }
};


/**
 * Returns an object of property descriptors for all properties directly in
 * {@code propertyObject}. Note: This is NOT compatible with IE8 - oh well.
 * @param {!Object} propertyObject
 * @return {!Object}
 * @private
 */
grail.getOwnPropertyDescriptors_ =
  function(propertyObject, additionalPropertyNames) {
  var descriptors = {};
  var properties = Object.getOwnPropertyNames(propertyObject);
  for (var i = 0; i < properties.length; i++) {
    var prop = properties[i];
    descriptors[prop] = Object.getOwnPropertyDescriptor(propertyObject, prop);
  }
  return descriptors;
};


/**
 * Exports the API to the global namespace in order to avoid removal during
 * Closure compilation.
 */
(function(scope) {
  scope['grail'] = grail;
  scope['grail']['inherit'] = grail.inherit;
  scope['grail']['call'] = grail.call;
})(this);
