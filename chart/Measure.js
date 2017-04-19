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
define(["require", "exports", "./Evented", "./Utils", "./Symbol", "lib/underscore"], function (require, exports, Evented_1, Utils_1, Symbol_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Measure = (function (_super) {
        __extends(Measure, _super);
        function Measure(id, name, type, ds) {
            var _this = _super.call(this) || this;
            _this.symbolizes = [];
            _this.style = new Utils_1.Style();
            _this.id = id;
            _this.name = name || id;
            _this.type = type;
            _this.dataset = ds;
            return _this;
        }
        Measure.prototype.pluckDatas = function (type) {
            return _.pluck(this.dataset, type);
        };
        Measure.prototype.toSymbolies = function (node, x, y) {
            return this.symbolizes;
        };
        Measure.prototype.getSymbolizes = function () {
            return this.symbolizes;
        };
        Measure.prototype.setID = function (id) {
            if (id != undefined) {
                this.id = id;
            }
            return this;
        };
        Measure.prototype.setData = function (ds) {
            if (ds != undefined) {
                this.dataset = ds;
            }
            return this;
        };
        Measure.prototype.getData = function () {
            return this.dataset;
        };
        Measure.prototype.getID = function () {
            return this.id;
        };
        Measure.prototype.removeSymbolies = function () {
        };
        Measure.prototype.update = function () {
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
            _this.setData(ds);
            return _this;
            // this.style.on("change",()=>{
            //     this.symbolizes.forEach((s:Symbol)=>{
            //         s.style.clone(this.style)
            //     })
            // })
        }
        CompareChartMeasure.prototype.render = function (canvas, xScale, yScale, ctx) {
            //this.toSymbolies()
        };
        CompareChartMeasure.prototype.getStyle = function (d, ds, ctx) {
            return new Utils_1.Style();
        };
        CompareChartMeasure.prototype.toSymbolies = function (node, xScale, yScale, ctx) {
            return this.getData().map(function (d) {
                var s = new Symbol_1.Symbol();
                return s;
            });
        };
        return CompareChartMeasure;
    }(Measure));
    exports.CompareChartMeasure = CompareChartMeasure;
});
//# sourceMappingURL=Measure.js.map