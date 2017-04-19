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
define(["require", "exports", "./Evented"], function (require, exports, Evented_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Model = (function (_super) {
        __extends(Model, _super);
        function Model() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._status = {};
            return _this;
        }
        Model.prototype.setUrl = function (u) {
            this._url = u;
            this.fire("change", { url: u });
            return this;
        };
        Model.prototype.setDate = function (ds) {
            this._dataset = ds;
            this.fire("change");
            return this;
        };
        return Model;
    }(Evented_1.Evented));
    exports.Model = Model;
});
//# sourceMappingURL=Model.js.map