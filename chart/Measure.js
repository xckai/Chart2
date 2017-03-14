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
define(["require", "exports", "./Evented", "./Utils", "lib/underscore"], function (require, exports, Evented_1, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Measure = (function (_super) {
        __extends(Measure, _super);
        function Measure(id, name, type) {
            var _this = _super.call(this) || this;
            _this.style = new Utils_1.Style();
            _this.id = id;
            _this.name = name || id;
            _this.type = type;
            return _this;
        }
        Measure.prototype.pluckDatas = function (type) {
            return _.pluck(this.dataset, type);
        };
        return Measure;
    }(Evented_1.Evented));
    exports.Measure = Measure;
    var CompareChartMeasure = (function (_super) {
        __extends(CompareChartMeasure, _super);
        function CompareChartMeasure(id, name, type, ref, ds) {
            var _this = _super.call(this, id, name, type) || this;
            _this.ref = "y1";
            _this.ref = ref || _this.ref;
            _this.data(ds);
            return _this;
        }
        CompareChartMeasure.prototype.data = function (ds) {
            if (ds) {
                this.dataset = ds;
                this.fire("change", ds);
                return this;
            }
            return this.dataset;
        };
        return CompareChartMeasure;
    }(Measure));
    exports.CompareChartMeasure = CompareChartMeasure;
});
//# sourceMappingURL=Measure.js.map