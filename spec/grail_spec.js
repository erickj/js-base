goog.require('grail');

describe('grail', function() {
  var ParentCtor;
  var ChildCtor;

  describe('grail.inherit', function() {
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
  });

  describe('grail.call', function() {
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
    });
  });
});
