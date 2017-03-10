define(["require", "exports", "Chart/Utils"], function (require, exports, Utils) {
    "use strict";
    var Util=Utils.Util;
    QUnit.test("Util", function (assert) {
        assert.equal(Util.max([1,2,3]),3,"max");
        assert.equal(Util.max(["1","2"]),2,"max");
        assert.equal(Util.max(["1","NAN","ss"]),1,"max")
        assert.equal(Util.min([1,2,3]),1,"min");
        assert.equal(Util.min(["1","2"]),1,"min");
        assert.equal(Util.min(["-1","NAN","ss"]),-1,"min")
        assert.equal(Util.min(["100","NAN","-ss",99]),99,"min")
        assert.notDeepEqual(Util.getStringRect("haha"),Util.getStringRect("hahaha"),"getStringRect")
        assert.notDeepEqual(Util.getStringRect("haha","rotate"),Util.getStringRect("haha"),"getStringRect")
        assert.deepEqual(Util.getStringRect(""),{"width":0,"height":0},"getStringRect")
    });
});