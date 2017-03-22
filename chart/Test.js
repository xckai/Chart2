define(["require", "exports", "./CompareChartLine"], function (require, exports, CompareChartLine_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tester;
    (function (Tester) {
        function getLine() {
            var id = Math.floor(10 * Math.random());
            return new CompareChartLine_1.CompareChartLine(id, "Line-" + id, null, dataGen(10).map(function (d) {
                d.y = d[0];
            }));
        }
        Tester.getLine = getLine;
        function getBar() {
            var id = Math.floor(10 * Math.random());
            return new CompareChartLine_1.CompareChartLine(id, "bar-" + id, null, dataGen(10).map(function (d) {
                d.y = d[0];
            }));
        }
        Tester.getBar = getBar;
        function dataGen(n) {
            var ds = [], i = 0, baseTime = 5 * Math.floor(60 * Math.random()) % 60;
            for (; i < n; ++i) {
                var d = {}, baseNum = 100;
                d.x = "2016-2-3 1:" + (baseTime + i * 5) % 60;
                d[0] = baseNum + 10 + 10 * Math.random();
                d[1] = baseNum + 5 + 5 * Math.random();
                d[2] = baseNum;
                d[3] = baseNum - 10 - 5 * Math.random();
                d[4] = baseNum - 10 - 10 * Math.random();
                d[5] = baseNum - 15 - 20 * Math.random();
            }
            return ds;
        }
    })(Tester = exports.Tester || (exports.Tester = {}));
});
//# sourceMappingURL=Test.js.map