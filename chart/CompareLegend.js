var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./Measure"], function (require, exports, Measure_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CompareChartLegend = (function (_super) {
        __extends(CompareChartLegend, _super);
        function CompareChartLegend(id, name, ref, ds) {
            var _this = _super.call(this, id, name, "legend", ref, ds) || this;
            _this.type = "legend";
            return _this;
        }
        CompareChartLegend.prototype.pluckDatas = function (type) {
            return [];
        };
        return CompareChartLegend;
    }(Measure_1.CompareChartMeasure));
    exports.CompareChartLegend = CompareChartLegend;
});
//# sourceMappingURL=CompareLegend.js.map