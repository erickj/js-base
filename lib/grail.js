/**
 * @fileoverview This is a lightweight utility for javascript inheritance
 * heavily inspired by the Closure library {@code goog.inherits} and
 * {@code goog.base}.  Note: This is NOT compatible with IE8 (and it probably
 * never will be) due to {@code Object.create} and
 * {@code Object.getOwnPropertyDescriptor}.
 */


/**
 * @namespace
 * @name grail
 */
goog.provide('grail');


/**
 * @const {string}
 * @private
 */
grail.SUPER_PROP_ = '_grail_super_';


/**
 * Extends the prototype chain of {@code childCtor} from
 * {@code parentCtor.prototype}.
 * @param {!Function} childCtor The child class constructor, will be modified in
 *     place.
 * @param {!Function} parentCtor The parent class constructor.
 * @return {!Function} The augmented {@code childCtor}.
 */
grail.inherit = function(childCtor, parentCtor) {
  if (childCtor == parentCtor ||
      childCtor.prototype.isPrototypeOf(parentCtor.prototype)) {
    throw Error('Invalid circular inheritance');
  } else if (childCtor.prototype[grail.SUPER_PROP_]) {
    throw Error('Invalid multiple inheritance');
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
  return childCtor;
};


/**
 * Either calls the parent constructor if this is the instantiation of
 * {@code scope} or calls the super method of {@code scope}. The method
 * or super constructor will be called with all arguments minus the first 2.
 * @param {!Object} scope
 * @param {string|!Function} methodNameOrCtor If {@code methodNameOrCtor} is the
 *     {@code constructor} of {@code scope} then the super constructor will be
 *     called. Otherwise the super method named {@code methodNameOrCtor} will be
 *     called.
 * @param {...*} var_args The arguments to pass to the super method.
 * @return {*} The result of the super method
 */
grail.call = function(scope, methodNameOrCtor, var_args) {
  var superProto = scope[grail.SUPER_PROP_];
  if (!superProto) {
    throw Error('Cannot find superclass');
  }

  var args = Array.prototype.slice.call(arguments, 2);

  var isInstantiation = scope.constructor == methodNameOrCtor;
  if (isInstantiation) {
    return superProto.constructor.apply(scope, args);
  } else {
    var method = superProto[methodNameOrCtor];
    if (!method) {
      throw Error('Method not found ' + methodNameOrCtor);
    }
    return method.apply(scope, args);
  }
};


/**
 * Returns an object of property descriptors for all properties directly in
 * {@code propertyObject}.
 * @param {!Object} propertyObject
 * @return {!Object}
 * @private
 */
grail.getOwnPropertyDescriptors_ = function(propertyObject) {
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
