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
    var Evented_1 = require("./Evented");
    var Utils_1 = require("./Utils");
    var Layout = (function () {
        function Layout() {
        }
        Layout.prototype.w = function (v) {
            return v !== undefined ? (this._w = v, this) : this._w;
        };
        Layout.prototype.h = function (v) {
            return v !== undefined ? (this._h = v, this) : this._h;
        };
        Layout.prototype.node = function (v) {
            return v !== undefined ? (this._node = v, this) : this._node;
        };
        Layout.prototype.x = function (v) {
            return v !== undefined ? (this._x = v, this) : this._x;
        };
        Layout.prototype.y = function (v) {
            return v !== undefined ? (this._y = v, this) : this._y;
        };
        Layout.prototype.position = function (p) {
            return p !== undefined ? (this._p = p, this) : this._p;
        };
        return Layout;
    }());
    var CompareChart = (function (_super) {
        __extends(CompareChart, _super);
        function CompareChart(cfg) {
            var _this = _super.call(this) || this;
            _this.config = {
                class: "CompareChart",
                title: {
                    value: "",
                    class: "title",
                    visiable: true
                },
                xTitle: {
                    value: "",
                    class: "xTitle",
                    visiable: true
                },
                yTitle: {
                    value: "",
                    class: "yTitle",
                    visiable: true
                },
                y2Title: {
                    value: "",
                    class: "y2Title",
                    visiable: true
                },
                width: 300,
                height: 300
            };
            _this.canvas = {
                wrapper: new Layout(),
                node: new Layout(),
                legend: new Layout(),
                title: new Layout(),
                xTitle: new Layout(),
                yTitle: new Layout(),
                y2Title: new Layout(),
                xAxis: new Layout(),
                yAxis: new Layout(),
                y2Axis: new Layout(),
                chart: new Layout()
            };
            _this.legend = {
                getHeight: function (o) {
                    return 0;
                },
                getWidth: function (o) {
                    return 0;
                }
            };
            _.each(cfg, function (v, k) {
                _this.config[k] = v;
            });
            return _this;
        }
        CompareChart.prototype.addMeasure = function (nm) {
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
        CompareChart.prototype.getDomain = function (ms, type) {
            var r = [];
            var mss = _.reduce(ms, function (m1, m2) { return m1.plunkDatas(type).concat(m1.plunkDatas(type)); });
            r[0] = Utils_1.Util.min(mss);
            r[1] = Utils_1.Util.max(mss);
            return r;
        };
        CompareChart.prototype.stringRect = function (con) {
            var ccls = this.config.class + " " + con.cls;
            return Utils_1.Util.getStringRect(con.value, ccls);
        };
        CompareChart.prototype.getScale = function (domain, range) {
            return d3.scaleLinear().domain(domain).range(range);
        };
        CompareChart.prototype.beforeDraw = function () {
        };
        CompareChart.prototype.calculateLayout = function () {
            var c = this.canvas;
            var con = this.config;
            // if(this.config.height>this.config.width){
            //     con.
            // }
            console.log(this.config.width);
            c.node.x(0);
            c.node.y(0);
            c.node.w(this.config.width);
            c.node.h(this.config.height);
            if (this.config.title.visiable) {
                c.title.x(c.node.w() / 2);
                c.title.y(0);
                this.canvas.title.w(this.stringRect(this.config.title).width);
                this.canvas.title.h(this.stringRect(this.config.title).height);
            }
            if (con.xTitle.visiable) {
                c.xTitle.x(c.node.w() / 2);
                c.xTitle.y(c.node.h() - this.legend.getHeight("bottom"));
                c.xTitle.w(this.stringRect(c.xTitle).width);
                c.xTitle.h(this.stringRect(c.xTitle).height);
            }
            c.xAxis.w(0);
            c.xAxis.h(10);
            c.xAxis.y(c.node.h() - c.xTitle.h() - c.xAxis.h() - this.legend.getHeight("bottom"));
            c.chart.y(c.title.h());
            c.chart.h(c.node.h() - c.title.h() - c.xAxis.h() - c.xTitle.h() - this.legend.getHeight("bottom"));
            ////calculate x 
            if (con.yTitle.visiable) {
                c.yTitle.x(0);
                c.yTitle.y(c.chart.h() / 2 + c.title.h());
                c.yTitle.h(this.stringRect(c.yTitle).height);
                c.yTitle.w(this.stringRect(c.yTitle).width);
            }
            c.yAxis.w(10);
            c.yAxis.h(0);
            c.yAxis.x(c.yTitle.w() + c.yAxis.w());
            c.yAxis.y(c.title.y());
            c.y2Title.w(this.stringRect(c.y2Title).width);
            c.y2Title.h(this.stringRect(c.y2Title).height);
            c.y2Axis.w(10);
            c.y2Axis.h(0);
            c.y2Title.x(c.node.w() - c.y2Title.w() - this.legend.getWidth("right"));
            c.y2Title.y(c.yTitle.h());
            c.y2Title.y();
            c.chart.x(c.yTitle.x());
            c.chart.w(c.node.w() - c.yTitle.w() - c.yAxis.w());
            console.log(c);
        };
        CompareChart.prototype.prepareCanvas = function () {
            this.canvas;
        };
        return CompareChart;
    }(Evented_1.Evented));
    exports.CompareChart = CompareChart;
});
//# sourceMappingURL=CompareChart.js.map