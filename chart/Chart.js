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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "lib/underscore", "lib/d3", "./Evented", "./Utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var d3 = require("lib/d3");
    var Evented_1 = require("./Evented");
    var Utils_1 = require("./Utils");
    var Chart = (function (_super) {
        __extends(Chart, _super);
        function Chart(cfg) {
            var _this = _super.call(this) || this;
            _this.config = {
                class: "chart",
                appendTo: "chart",
                height: 300,
                width: 300
            };
            _this._ctx = {};
            _this.measures = [];
            _this.elements = [];
            _this.wrapper = new Utils_1.Layout();
            _.each(cfg, function (v, k) {
                _this.config[k] = v;
            });
            return _this;
        }
        Chart.prototype.ctx = function (k, v) {
            if (k != undefined) {
                if (v != undefined) {
                    this._ctx[k] = v;
                }
                else {
                    return this._ctx[k];
                }
            }
            else {
                return this._ctx;
            }
        };
        Chart.prototype.getElements = function () {
            var r = [];
            return r.concat(this.elements);
        };
        Chart.prototype.addElement = function (e) {
            this.elements.push(e);
        };
        Chart.prototype.addMeasure = function (nm) {
            var i = _.findIndex(this.measures, function (m) { return nm.id == m.id; });
            if (i != -1) {
                this.measures[i] = nm;
            }
            else {
                this.measures.push(nm);
            }
            this.fire("measure-add", nm);
            return this;
        };
        Chart.prototype.getMeasures = function () {
            return this.measures;
        };
        Chart.prototype.beforeDraw = function () {
        };
        Chart.prototype.calculateLayout = function () {
        };
        Chart.prototype.prepareCanvas = function () {
            if (d3.select("#" + this.config.appendTo).empty()) {
                return false;
            }
            else {
                if (this.wrapper.getNode()) {
                    d3.select(this.wrapper.getNode())
                        .classed(this.config.class, true)
                        .style("position", "absolute");
                }
                else {
                    this.wrapper.setNode(d3.select("#" + this.config.appendTo).append("div")
                        .classed(this.config.class, true)
                        .style("position", "absolute")
                        .node());
                }
                this.config.height = document.getElementById(this.config.appendTo).clientHeight;
                this.config.width = document.getElementById(this.config.appendTo).clientWidth;
                return true;
            }
        };
        Chart.prototype.checkData = function () {
        };
        Chart.prototype.clearDummyDate = function () { };
        Chart.prototype.endDraw = function () {
            var _this = this;
            var chart = this;
            this.clearDummyDate();
            Utils_1.Util.enableAutoResize(document.getElementById(this.config.appendTo), function () {
                _this.config.height = document.getElementById(_this.config.appendTo).clientHeight;
                _this.config.width = document.getElementById(_this.config.appendTo).clientWidth;
                _this.beforeDraw();
                _this.checkData();
                _this.calculateLayout();
                //this._draw()
            });
        };
        Chart.prototype._draw = function (ctx) {
            this.calculateLayout();
            this.getElements().filter(function (e) {
                return e.visiable;
            }).sort(function (e1, e2) {
                return e1.z_index - e2.z_index;
            }).forEach(function (e) {
                e.render(e, ctx);
            });
        };
        Chart.prototype.render = function (ctx) {
            if (this.prepareCanvas()) {
                this.beforeDraw();
                this.checkData();
                this.calculateLayout();
                this.fire("render");
                this.endDraw();
            }
        };
        return Chart;
    }(Evented_1.Evented));
    exports.Chart = Chart;
});
//# sourceMappingURL=Chart.js.map