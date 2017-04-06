define(["require", "exports", "./Utils", "lib/d3", "lib/underscore"], function (require, exports, Utils_1, d3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Heatmap = (function () {
        function Heatmap() {
            this._ctx = {};
            this._layout = {
                chart_h: 0,
                chart_w: 0,
                title_h: 0,
                xAxis_h: 0,
                yAxis_w: 0
            };
            this._config = {
                width: 600,
                height: 800,
                x: "x",
                y: "y",
                value: "value",
                xSort: null,
                ySort: null,
                xFormat: null,
                yFormat: null,
                title: "ahha",
                color: {
                    from: "blue",
                    to: "red"
                },
                appendId: null,
                toolTipTemplate: "<table class='tool-tip-table' ><tbody><tr><td>{{xLabel}}:</td><td>{{x}}</td></tr> <tr><td>{{yLabel}}:</td><td>{{y}}</td></tr> <tr><td>{{valueLabel}}:</td><td>{{value}}</td></tr></tbody><table>",
                label: {
                    xLabel: "列",
                    yLabel: "行",
                    valueLabel: "值"
                }
            };
            this._node = {};
        }
        Heatmap.prototype.setConfig = function (c) {
            var _this = this;
            _.each(c, function (v, k) {
                _this._config[k] = v;
            });
            return this;
        };
        Heatmap.prototype.setData = function (ds) {
            this._ds = ds;
            return this;
        };
        Heatmap.prototype.getColor = function (v) {
            this.colors = this.colors ? this.colors : d3.scaleLinear()
                .domain(this.getDomain())
                .range([this._config.color.from, this._config.color.to]);
            return this.colors(v);
        };
        Heatmap.prototype.getX = function (noFormat) {
            var _this = this;
            var tx = _.pluck(this._ds, this._config.x);
            var n = [];
            _.each(tx, function (x) {
                _.contains(n, x) ? null : n.push(x);
            });
            if (this._config.xSort) {
                n = n.sort(this._config.xSort);
            }
            if (this._config.xFormat && noFormat) {
                n = n.map(function (v) { return _this._config.xFormat(v); });
            }
            return n;
        };
        Heatmap.prototype.getY = function (noFormat) {
            var _this = this;
            var t = _.pluck(this._ds, this._config.y);
            var n = [];
            _.each(t, function (v) {
                _.contains(n, v) ? null : n.push(v);
            });
            if (this._config.ySort) {
                n = n.sort(this._config.ySort);
            }
            if (this._config.yFormat && noFormat) {
                n = n.map(function (v) { return _this._config.yFormat(v); });
            }
            return n;
        };
        Heatmap.prototype.getXIndex = function (d) {
            var xs = this.getX();
            var v = this._config.xFormat ? this._config.xFormat(d[this._config.x]) : d[this._config.x];
            return _.findIndex(xs, function (x) { return x == v; });
        };
        Heatmap.prototype.getYIndex = function (d) {
            var ys = this.getY();
            var v = this._config.yFormat ? this._config.yFormat(d[this._config.y]) : d[this._config.y];
            //let xi=_.findIndex(xs,this._config.xFormat?this._config.xFormat(d[this._config.x]):d[this._config.x])
            return _.findIndex(ys, function (y) { return y == v; });
        };
        Heatmap.prototype.getDomain = function () {
            var d = _.pluck(this._ds, this._config.value);
            var max = _.max(d);
            var min = _.min(d);
            max = isNaN(max) ? 1 : max;
            min = isNaN(min) ? 0 : min;
            return [min, max];
        };
        Heatmap.prototype.beforeRender = function () {
            if (this.getX().length < 1 || this.getY().length < 1) {
                return false;
            }
            var l = this._layout;
            l.yAxis_w = Utils_1.Util.getStringRect(this.getY()[0], "yAxis").width;
            this._ctx["yAxisClass"] = "yAxis";
            //title
            l.title_h = Utils_1.Util.getStringRect(this._config.title, "title").height + 2;
            //xAxis
            l.xAxis_h = Utils_1.Util.getStringRect(this.getX()[0], "xAxis").height;
            l.chart_h = this._config.height - l.title_h - l.xAxis_h;
            l.chart_w = this._config.width - l.yAxis_w;
            //reCal xAxis
            var xAsxi_w = Utils_1.Util.getStringRect(this.getX()[0], "xAxis").width;
            var rectWidth = Math.min(this._layout.chart_h / this.getY().length, this._layout.chart_w / this.getX().length);
            this._ctx["rectWidth"] = rectWidth;
            if (xAsxi_w > rectWidth) {
                this._ctx["xAxisClass"] = "xAxis rotation";
                l.xAxis_h = Utils_1.Util.getStringRect(this.getX()[0], "xAxis rotation").height + 5;
            }
            else {
                this._ctx["xAxisClass"] = "xAxis";
                l.xAxis_h += 5;
            }
            // if(l.yAxis_w>40){
            //     this._ctx["yAxisClass"]="yAxis rotation"
            //     l.yAxis_w=Util.getStringRect(this.getY()[0],"yAxis rotation").width +5
            // }else{
            //     this._ctx["yAxisClass"]="yAxis"
            //     l.yAxis_w+=5
            // }
            l.chart_h = this._config.height - l.title_h - l.xAxis_h;
            l.chart_w = this._config.width - l.yAxis_w;
            return true;
        };
        Heatmap.prototype.showToolTip = function (d, p) {
            _.templateSettings = {
                interpolate: /\{\{(.+?)\}\}/g
            };
            if (d) {
                this._node.tooltip.style("visibility", "");
                d.x = d[this._config.x];
                d.y = d[this._config.y];
                d.value = d[this._config.value];
                this._node.tooltip.selectAll("*").remove();
                this._node.tooltip.node().insertAdjacentHTML("afterbegin", _.template(this._config.toolTipTemplate)(_.extend(d, this._config.label)));
                var x = p.clientX, y = p.clientY;
                var width = this._node.tooltip.node().offsetWidth;
                var height = this._node.tooltip.node().offsetHeight;
                var screenWidth = document.body.clientWidth || 800;
                if (x - width / 2 < 0) {
                    this._node.tooltip.style("left", 10 + "px");
                }
                else if (x + width / 2 > screenWidth) {
                    this._node.tooltip.style("left", (screenWidth - width - 10) + "px");
                }
                else {
                    this._node.tooltip.style("left", x - width / 2 + "px");
                }
                if (y - height - 5 < 0) {
                    this._node.tooltip.style("top", y + 20 + "px");
                }
                else {
                    this._node.tooltip.style("top", y - height - 10 + "px");
                }
            }
            else {
                this._node.tooltip.style("visibility", "hidden");
                this._node.tooltip.selectAll("*").remove();
            }
            //setPosition(p.clientX,p.clientY)
        };
        Heatmap.prototype.showGuildLine = function (od) {
            var d = od || {};
            var chart = this;
            this._node.xAxis.selectAll("text").each(function (_d) {
                var dd = chart._config.xFormat ? chart._config.xFormat(d[chart._config.x]) : d[chart._config.x];
                if (_d == dd) {
                    d3.select(this).classed("dataHover", true);
                }
                else {
                    d3.select(this).classed("dataHover", false);
                }
            });
            this._node.yAxis.selectAll("text").each(function (_d) {
                var dd = chart._config.yFormat ? chart._config.xFormat(d[chart._config.y]) : d[chart._config.y];
                if (_d == dd) {
                    d3.select(this).classed("dataHover", true);
                }
                else {
                    d3.select(this).classed("dataHover", false);
                }
            });
        };
        Heatmap.prototype.render = function () {
            var _this = this;
            if (!this.beforeRender()) {
                console.log("no data");
                return;
            }
            var rectWidth = this._ctx["rectWidth"];
            d3.select("#" + this._config.appendId).selectAll("*").remove();
            var svg = d3.select("#" + this._config.appendId).append("svg");
            this._node.tooltip = d3.select("#" + this._config.appendId).append("div").style("position", "absolute")
                .style("z-index", "10")
                .style("visibility", "hidden");
            this._node.svg = svg;
            svg.style("height", this._config.height).style("width", this._config.width);
            svg.append("g").classed("title", true).append("text").text(this._config.title)
                .attr("x", this._config.width / 2)
                .attr("y", 0)
                .style("alignment-baseline", "hanging");
            this._node.yAxis = svg.append("g");
            this._node.yAxis.selectAll("text").data(this.getY()).enter()
                .append("g").style("transform", function (d, i) { return "translate(" + (_this._layout.yAxis_w) + "px," + ((i + 0.5) * rectWidth + _this._layout.title_h) + "px)"; })
                .append("text").classed(this._ctx["yAxisClass"], true)
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", 0)
                .style("alignment-baseline", "central");
            this._node.xAxis = svg.append("g");
            this._node.xAxis.selectAll("text").data(this.getX()).enter().append("g")
                .style("transform", function (d, i) { return "translate(" + (_this._layout.yAxis_w + (i + 0.5) * rectWidth) + "px," + ((_this.getY().length + 1) * rectWidth) + "px)"; }).append("text")
                .classed(this._ctx["xAxisClass"], true)
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", 0)
                .style("alignment-baseline", "central");
            this._node.matrix = svg.append("g").style("transform", "translate(" + this._layout.yAxis_w + "px," + this._layout.title_h + "px)").classed("matrix", true);
            this._node.matrix.selectAll("rect").data(this.validData(this._ds)).enter().append("rect").attr("x", function (d) { return _this.getXIndex(d) * rectWidth; })
                .attr("y", function (d) { return _this.getYIndex(d) * rectWidth; })
                .attr("width", rectWidth)
                .attr("height", rectWidth)
                .style("fill", function (d) {
                if (isNaN(d[_this._config.value])) {
                    return "gray";
                }
                return _this.getColor(d[_this._config.value]);
            }).on("mousemove", function (d) {
                _this.showToolTip(d, event);
                _this.showGuildLine(d);
            }).on("mouseout", function (d) {
                _this.showToolTip();
                _this.showGuildLine();
            });
        };
        Heatmap.prototype.validData = function (ds) {
            var _this = this;
            var xs = this.getX(true), ys = this.getY(true);
            var newDs = [];
            var chart = this;
            _.each(xs, function (x) {
                _.each(ys, function (y) {
                    if (!_.some(ds, function (d) { return d[_this._config.x] == x && d[_this._config.y] == y; })) {
                        var _t = {};
                        _t[_this._config.x] = x;
                        _t[_this._config.y] = y;
                        _t[_this._config.value] = undefined;
                        newDs.push(_t);
                    }
                });
            });
            if (newDs.length > 1) {
                return ds.concat(newDs);
            }
            return ds;
        };
        return Heatmap;
    }());
    exports.Heatmap = Heatmap;
});
//# sourceMappingURL=Heatmap.js.map