var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'BoardCell'], function (require, exports, React, BoardCell) {
    "use strict";
    var Board = (function (_super) {
        __extends(Board, _super);
        function Board(props) {
            _super.call(this, props);
            this.state = props;
        }
        Board.prototype.render = function () {
            var index = 0;
            var rows = [];
            for (var i = 0; i < this.props.Size; i++) {
                var cells = [];
                for (var j = 0; j < this.props.Size; j++) {
                    var cell = React.createElement(BoardCell.default, this.props.Cells[index], {});
                    cells.push(cell);
                    index++;
                }
                var rowId = "tile_" + (i + 1);
                var row = React.createElement("tr", {
                    id: rowId,
                    key: rowId,
                    ref: rowId,
                    className: "row",
                    title: "Row",
                }, cells);
                rows.push(row);
            }
            var tbody = React.createElement("tbody", {}, rows);
            var table = React.createElement("table", {
                id: "table",
                key: "table",
                ref: "table",
                className: "table",
                title: "Table",
            }, tbody);
            var elem = React.createElement('div', {
                id: "board",
                key: "board",
                ref: "board",
                className: "board",
                title: "Board",
            }, [table]);
            return elem;
        };
        return Board;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Board;
});