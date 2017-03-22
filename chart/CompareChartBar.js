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
    var CompareChartBar = (function (_super) {
        __extends(CompareChartBar, _super);
        function CompareChartBar(id, name, ref, ds) {
            var _this = _super.call(this, id, name, "line", ref, ds) || this;
            _this.type = "bar";
            return _this;
        }
        CompareChartBar.prototype.maxBarsNum = function () {
        };
        return CompareChartBar;
    }(Measure_1.CompareChartMeasure));
    exports.CompareChartBar = CompareChartBar;
});
//# sourceMappingURL=CompareChartBar.js.map