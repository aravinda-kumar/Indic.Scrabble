var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Contracts', 'GameLoader'], function (require, exports, React, Contracts, GameLoader) {
    "use strict";
    var BoardCell = (function (_super) {
        __extends(BoardCell, _super);
        function BoardCell(props) {
            _super.call(this, props);
            this.state = props;
        }
        BoardCell.prototype.render = function () {
            var _this = this;
            var className = this.getClass();
            var childs = [];
            var textId = "text_" + this.props.Id;
            var text = this.props.Current.length == 0 ? " " : this.props.Current;
            var textElem = React.createElement('span', {
                id: textId,
                ref: textId,
                key: textId,
                className: "text",
                title: text
            }, [], text);
            childs.push(this.renderWeight());
            childs.push(textElem);
            var cellId = "cell_" + this.props.Id;
            var container = React.createElement('div', {
                id: cellId,
                ref: cellId,
                key: cellId,
                className: "cellContainer",
                title: text
            }, childs);
            var elem = React.createElement('td', {
                id: this.props.Id,
                ref: this.props.Id,
                className: className,
                title: this.props.Current,
                index: text,
                draggable: this.isDragable(),
                onDragStart: function (evt) { _this.OnDragStart(evt); },
                onDragOver: this.OnDragOver,
                onDrop: function (evt) { _this.OnDrop(evt); }
            }, [container]);
            return elem;
        };
        BoardCell.prototype.isDragable = function () {
            return this.props.Waiting.length != 0;
        };
        BoardCell.prototype.getClass = function () {
            var className = (this.props.Waiting.length + this.props.Confirmed.length == 0) ? "cell" : "cell filled";
            var confirmed = (this.props.Waiting.length == 0 && this.props.Confirmed.length != 0);
            var draggable = this.isDragable();
            if (confirmed) {
                className += " confirmed";
            }
            if (draggable) {
                className += " draggable";
            }
            if (confirmed || this.props.Waiting.length != 0) {
                return className;
            }
            switch (this.props.Weight) {
                case 3:
                    className += " w3";
                    break;
                case 4:
                    className += " w4";
                    break;
                case 6:
                    className += " w6";
                    break;
                case 8:
                    className += " w8";
                    break;
                default:
                    break;
            }
            return className;
        };
        BoardCell.prototype.renderWeight = function () {
            var weightId = "weight_" + this.props.Id;
            var className = "weight";
            var text = this.props.Weight == 1 ? " " : this.props.Weight;
            var weight = React.createElement('span', {
                id: weightId,
                ref: weightId,
                key: weightId,
                className: className,
                title: this.props.Weight
            }, [], text);
            return weight;
        };
        BoardCell.prototype.OnDragOver = function (ev) {
            ev.preventDefault();
        };
        BoardCell.prototype.OnDrop = function (ev) {
            ev.preventDefault();
            var text = ev.dataTransfer.getData("text");
            var data = JSON.parse(text);
            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.ToBoard,
                args: {
                    TargetCell: this.props.Index,
                    Src: data.Src,
                    SrcCell: data.SrcCell,
                    Origin: data.Origin
                }
            });
        };
        BoardCell.prototype.OnDragStart = function (ev) {
            if (console) {
                console.log("Attempting to Move a Tile back to Tray");
            }
            var last = this.props.Waiting[this.props.Waiting.length - 1];
            var elem = ev.target;
            var data = {
                Src: last,
                Origin: "Cell",
                SrcCell: this.props.Index
            };
            ev.dataTransfer.setData("text", JSON.stringify(data));
        };
        return BoardCell;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BoardCell;
});