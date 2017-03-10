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
    var CompareChartLine = (function (_super) {
        __extends(CompareChartLine, _super);
        function CompareChartLine(id, name, type, ref) {
            var _this = _super.call(this, id, name, type, ref) || this;
            _this.type = "line";
            return _this;
        }
        return CompareChartLine;
    }(Measure_1.CompareChartMeasure));
    exports.CompareChartLine = CompareChartLine;
});
//# sourceMappingURL=CompareChartLine.js.map