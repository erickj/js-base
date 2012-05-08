describe("Ext", function() {
  describe("Array", function() {
    it("#from", function() {
      var result;
      (function() {
         result = Array.from(arguments);
       }(1,2,"foo"));

      expect(result).toContain("foo");
    });

    it("#contains", function() {
      expect([1,2,3].contains(2)).toBeTruthy();
    })
  });

  describe("Function", function() {
    it("#bind", function() {
      var target = {};
      var runner = function() {
                     return this;
                   }.bind(target);
      expect(runner()).toBe(target);
    });

    it("#curry", function() {
      var runner = function(first, second, third) {
                     return [first,second,third];
                   }.curry(1,2);

      expect(runner(3)[0]).toEqual(1);
      expect(runner(3)[1]).toEqual(2);
      expect(runner(3)[2]).toEqual(3);
    });
  });
});
