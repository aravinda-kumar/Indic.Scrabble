var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Cabinet', 'Board'], function (require, exports, React, Cabinet, Board) {
    "use strict";
    var ScrabbleGame = (function (_super) {
        __extends(ScrabbleGame, _super);
        function ScrabbleGame(props) {
            _super.call(this, props);
            this.state = props;
        }
        ScrabbleGame.prototype.render = function () {
            var cabinet = React.createElement(Cabinet.default, this.props.Cabinet);
            var board = React.createElement(Board.default, this.props.Board);
            var block = React.createElement('div', {
                id: this.props.id,
                ref: this.props.id,
                className: "game",
                title: "Scrabble",
            }, [cabinet, board]);
            return block;
        };
        return ScrabbleGame;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ScrabbleGame;
});
