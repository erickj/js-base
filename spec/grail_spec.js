goog.require('grail');

describe('grail', function() {
  var ParentCtor;
  var ChildCtor;

  describe('.inherit', function() {
    beforeEach(function() {
      /** @constructor */
      ParentCtor = function() {};

      /** @constructor @extends {ParentCtor} */
      ChildCtor = function() {
        this.childProperty = 'abc';
      };
    });

    it('extends a child class from a parent class', function() {
      grail.inherit(ChildCtor, ParentCtor);

      var childInstance = new ChildCtor();
      expect(childInstance instanceof ParentCtor).toBe(true);
      expect(childInstance instanceof ChildCtor).toBe(true);
      expect(childInstance.childProperty).toBe('abc');
    });

    it('supports arbitrarily deep inheritance', function() {
      /** @constructor */
      var GrandParentCtor = function() {};
      grail.inherit(ParentCtor, GrandParentCtor);
      grail.inherit(ChildCtor, ParentCtor);

      expect(new ChildCtor() instanceof GrandParentCtor).toBe(true);
    });

    it('sets the constructor property of the ChildCtor.prototype', function() {
      grail.inherit(ChildCtor, ParentCtor);
      expect(ChildCtor.prototype.constructor).toBe(ChildCtor);
    });

    it('preserves prototype properties set up before call to #inherit',
        function() {
          ChildCtor.prototype.value = 'prototype value';
          ChildCtor.prototype.method = function() {
            return 'xyz';
          };

          grail.inherit(ChildCtor, ParentCtor);
          var childInstance = new ChildCtor();
          expect(childInstance.value).toBe('prototype value');
          expect(childInstance.method()).toBe('xyz');
        });

    it('doesn\'t add any enumerable properties to the prototype', function() {
      grail.inherit(ChildCtor, ParentCtor);
      for (var prop in ChildCtor.prototype) {
        expect(Object.prototype[prop]).not.toBe(undefined);
      }
    });

    it('throws an error when a class extends itself', function() {
      expect(function() {
        grail.inherit(ChildCtor, ChildCtor);
      }).toThrow();
    });

    it('throws an error when a circular inheritance would be created',
       function() {
         grail.inherit(ChildCtor, ParentCtor);
         expect(function() {
           grail.inherit(ParentCtor, ChildCtor);
         }).toThrow();
       });

    it('throws an error when called multiple times on the same class',
       function() {
         grail.inherit(ChildCtor, ParentCtor);
         expect(function() {
           grail.inherit(ChildCtor, ParentCtor);
         }).toThrow();
       });

    it('returns the child constructor', function() {
      var ChildCtor2 = grail.inherit(function() {}, ParentCtor);
      expect((new ChildCtor2()) instanceof ParentCtor).toBe(true);
    });
  });

  describe('.call', function() {
    describe('on constructor', function() {
      beforeEach(function() {
        /** @constructor */
        ParentCtor = function(foo, bar) {
          this.foo = foo;
          this.bar = bar;
        };

        /** @constructor */
        ChildCtor = function(foo, bar) {
          grail.call(this, ChildCtor, foo, bar);
        };
        grail.inherit(ChildCtor, ParentCtor);
      });

      it('passes arguments to the parent constructor', function() {
        var child = new ChildCtor('value', 123);
        expect(child.foo).toBe('value');
        expect(child.bar).toBe(123);
      });

      it('throws an error when called on a class with no superclass',
         function() {
           /** @constructor */
           var Klass = function() { grail.call(this, Klass); };

           expect(function() {
             new Klass();
           }).toThrow();
         });
    });

    describe('on method', function() {
      var GrandParentCtor;

      beforeEach(function() {
        /** @constructor */
        GrandParentCtor = function() {
          this.grandParentProp = '';
        };

        GrandParentCtor.prototype.setGrandParentProp = function(prop) {
          this.grandParentProp = prop;
        };

        /** @constructor */
        ParentCtor = function() {
          this.parentProp = '';
        };
        grail.inherit(ParentCtor, GrandParentCtor);

        ParentCtor.prototype.setParentProp = function(prop) {
          this.parentProp = prop;
        };

        /** @constructor */
        ChildCtor = function() {};
        grail.inherit(ChildCtor, ParentCtor);

        /** @override */
        ChildCtor.prototype.setParentProp = function(prop) {
          grail.call(this, 'setParentProp', prop + '-fromchild');
        };

        /** @override */
        ChildCtor.prototype.setGrandParentProp = function(prop) {
          grail.call(this, 'setGrandParentProp', prop + '-fromchild');
        };
      });

      it('passes arguments to the parent method', function() {
        var childInstance = new ChildCtor();
        childInstance.setParentProp('parentProp');
        expect(childInstance.parentProp).toBe('parentProp-fromchild');
      });

      it('looks up to the top of the prototype chain', function() {
        var childInstance = new ChildCtor();
        childInstance.setGrandParentProp('grandParentProp');
        expect(childInstance.grandParentProp).toBe('grandParentProp-fromchild');
      });

      it('throws an error when no super class method is found', function() {
        var childInstance = new ChildCtor();
        childInstance.monkeyPatch = function() {
          grail.call(this, 'monkeyPatch');
        };

        expect(function() {
          childInstance.monkeyPatch();
        }).toThrow();
      });
    });
  });
});
