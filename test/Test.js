define(["require", "exports", "../chart/CompareChartLine", "../chart/CompareChartBar", "../chart/CompareLegend", "lib/underscore"], function (require, exports, CompareChartLine_1, CompareChartBar_1, CompareLegend_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tester;
    (function (Tester) {
        function getLine() {
            var id = Math.floor(10 * Math.random());
            return new CompareChartLine_1.CompareChartLine(id, "Line-" + id, null, dataGen(10).map(function (d) {
                d.y = d[0];
                return d;
            }).sort(function (d1, d2) {
                return d1.x - d2.x;
            }));
        }
        Tester.getLine = getLine;
        function getBar() {
            var id = Math.floor(10 * Math.random()) + "bar";
            return new CompareChartBar_1.CompareChartBar(id, "bar-" + id, null, dataGen(10).map(function (d) {
                d.y = d[0];
                return d;
            }).sort(function (d1, d2) {
                return d1.x - d2.x;
            }));
        }
        Tester.getBar = getBar;
        function getLegend() {
            var id = Math.floor(10 * Math.random()) + "bar";
            return new CompareLegend_1.CompareChartLegend(id, "legend-" + id, "hahah", dataGen(10).map(function (d) {
                d.y = d[0];
                return d;
            }).sort(function (d1, d2) {
                return d1.x - d2.x;
            }));
        }
        Tester.getLegend = getLegend;
        function dataGen(n) {
            var ds = [], i = 0, baseTime = 5 * Math.floor(60 * Math.random()) % 60;
            for (; i < n; ++i) {
                var d = {}, baseNum = 100;
                d.x = new Date("2016-2-3 1:" + (baseTime + i * 5) % 60);
                d[0] = baseNum + 10 + 10 * Math.random();
                d[1] = baseNum + 5 + 5 * Math.random();
                d[2] = baseNum;
                d[3] = baseNum - 10 - 5 * Math.random();
                d[4] = baseNum - 10 - 10 * Math.random();
                d[5] = baseNum - 15 - 20 * Math.random();
                ds.push(d);
            }
            var nds = [];
            ds.forEach(function (d) {
                if (!_.some(nds, function (nd) { nd == d.x; })) {
                    nds.push(d);
                }
            });
            return nds;
        }
    })(Tester = exports.Tester || (exports.Tester = {}));
});
//# sourceMappingURL=Test.js.map