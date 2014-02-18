[![Build Status](https://travis-ci.org/erickj/js-base.png?branch=master)](https://travis-ci.org/erickj/js-base)

# grail
Yet another Javascript inheritance API.

grail is a lightweight Javascript pseudo-classical inheritance model modeled after Closure library's `goog.inherits` and `goog.base`. It is designed to be used without the Closure library and free of the non-standard hack of `arguments.callee.caller` that doesn't work in Rhino.

## Using grail
Grail may be used to setup class inheritance, call super class constructors during instantiation, and call overriden methods.

### Class Inheritance
To use it pull grail.min.js into your project and use it to set up class inheritance.

```js
/**
 * @param {string} genus
 * @constructor
 */
var Animal = function(genus) {
  this.genus = genus;
};


/**
 * @constructor
 * @extends {Animal}
 */
var Dog = function() {
  // {@code grail.call} calls the {@code Animal} super class constructor.
  grail.call(this, Dog, 'canine');
};
// {@code grail.inherit} is executed during read time to extend Dog
// from Animal. Specifically Dog.prototype is set to an object with a
// prototype of Animal.prototype.
grail.inherit(Dog, Animal);

var spot = new Dog();
spot.genus; // returns 'canine'
```

### Calling Overridden Methods
To call an overridden methods use `grail.call` with the instance and the method name followed by any arguments to pass.

```js
Animal.prototype.doSomething = function(a, few, params) {
  // do stuff
  return result;
}


/** @override */
Dog.prototype.doSomething = function(a, few, more, params) {
  var superResult = grail.call(this, 'doSomething', a, few, params);
  // do more stuff
  return superResult;
}
```

grail is compilied with the closurecompiler and tested with jasmine.
