[![Build Status](https://travis-ci.org/erickj/js-base.png?branch=master)](https://travis-ci.org/erickj/js-base)

# grail
grail is a lightweight Javascript classical inheritance model modeled after Closure library's `goog.inherits` and `goog.base`. It is designed to be used without the Closure library and free of the non-standard hack of `arguments.callee.caller` that doesn't work in Rhino.

## Using grail
To use it pull grail.min.js into your project and use it like so

```js
/**
 * @param {string} genus
 * @constructor
 */
var Animal = function(genus) {
  this.genus = genus;
};


Animal.prototype.getGenus = function() {
  return this.genus;
};


/**
 * @constructor
 * @extends {Animal}
 */
var Dog = function() {
  grail.call(this, Dog, 'canine');
};
grail.inherit(Dog, Animal);

var spot = new Dog();
spot.getGenus(); // returns 'canine'
```

grail is compilied with the closurecompiler and tested with jasmine.

## Contributing gril

To get started:

```shell
git clone https://github.com/erickj/js-base.git
...
hack hack hack
...
grunt gjslint
grunt test
```
