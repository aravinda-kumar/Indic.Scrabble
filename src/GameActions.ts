﻿//---------------------------------------------------------------------------------------------
// <copyright file="GameActions.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 29-Jan-2018 21:53EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
import * as Contracts from 'Contracts';
import * as Indic from 'Indic';

export class GameActions {
    public static Pass(state: Contracts.iGameState, args: Contracts.iArgs): void {
        var isValidMove: boolean = GameActions.ValidateMove(state.Board);
        if (!isValidMove) {
            state.InfoBar.Messages.push(Indic.Messages.CrossCells);
            return;
        }
        var hasOrphans: boolean = GameActions.HasOrphans(state);
        if (hasOrphans) {
            state.InfoBar.Messages.push(Indic.Messages.HasOraphans);
            return;
        }
        var hasClusters: boolean = GameActions.HasClusters(state);
        if (hasClusters) {
            state.InfoBar.Messages.push(Indic.Messages.HasIslands);
            return;
        }
        var isValid: boolean = GameActions.ValidateWords(state);
        if (!isValid) {
            return;
        }
        GameActions.AwardClaims(state);
        GameActions.SetScores(state);
        GameActions.SwitchTurn(state);
        GameActions.SaveBoard(state);
    }
    public static SaveBoard(state: Contracts.iGameState): void {
        for (var i = 0; i < state.Board.Cells.length; i++) {
            var Cell: Contracts.iCellProps = state.Board.Cells[i];
            Cell.Confirmed = Cell.Confirmed.concat(Cell.Waiting);
            Cell.Waiting = [];
        }
    }
    public static RefreshClaims(state: Contracts.iGameState): void {
        var Claims: Contracts.iWord[] = GameActions.WordsOnBoard(state.Board, true);
        var playerId: number = state.Players.CurrentPlayer;
        var player: Contracts.iPlayer = state.Players.Players[playerId];
        player.Claimed = Claims;
    }
    public static AwardClaims(state: Contracts.iGameState): void {
        var Claims: Contracts.iWord[] = GameActions.WordsOnBoard(state.Board, true);
        var playerId: number = state.Players.CurrentPlayer;
        var player: Contracts.iPlayer = state.Players.Players[playerId];
        player.Awarded = player.Awarded.concat(Claims);
        player.Claimed = [];
    }
    public static ValidateWords(state: Contracts.iGameState): boolean {
        var Words: Contracts.iWord[] = GameActions.WordsOnBoard(state.Board, true);
        var player: number = state.Players.CurrentPlayer;
        state.Players.Players[player].Claimed = Words;
        //Actual Word Verification against Word Database
        return true;
    }
    public static SetScores(state: Contracts.iGameState): void {
        for (var i = 0; i < state.Players.Players.length; i++) {
            var player: Contracts.iPlayer = state.Players.Players[i];
            var score: number = 0;
            for (var w = 0; w < player.Awarded.length; w++) {
                score += player.Awarded[w].Score;
            }
            player.Score = score;
        }
    }
    public static SwitchTurn(state: Contracts.iGameState): void {
        for (var i = 0; i < state.Players.Players.length; i++) {
            var player: Contracts.iPlayer = state.Players.Players[i];
            player.CurrentTurn = !player.CurrentTurn;
            if (player.CurrentTurn) {
                state.Players.CurrentPlayer = i;
            }
        }
    }
    public static ToTray(state: Contracts.iGameState, args: Contracts.iArgs): void {
        var cell: Contracts.iCellProps = state.Board.Cells[args.SrcCell];
        if (cell.Waiting.length == 0) {
            return;
        }
        if (cell.Waiting.length > 0) {
            var toRemove = cell.Waiting[cell.Waiting.length - 1];
            cell.Waiting.pop();
            cell.Current = Indic.Indic.ToString(cell.Confirmed.concat(cell.Waiting));
            var tile = GameActions.FindTile(state.Cabinet, toRemove);
            tile.Remaining++;
            var synonymTile: Contracts.iTileProps = GameActions.FindSynonymTile(state.Cabinet, tile.Text);
            if (synonymTile != null) {
                synonymTile.Remaining++;
            }
            state.Cabinet.Remaining++;
        }
        GameActions.RefreshClaims(state);
    }
    public static ToBoardInternal(state: Contracts.iGameState, args: Contracts.iArgs, useSynonyms: boolean): void {
        var src: string = args.Src;
        var tray: Contracts.iTrayProps;
        var tile: Contracts.iTileProps;

        if (args.Origin == "Tile") {
            var tile = GameActions.FindTile(state.Cabinet, src);
            if (tile.Remaining == 0) {
                return;
            }
        }

        var cell: Contracts.iCellProps = state.Board.Cells[args.TargetCell];
        var list: string[] = cell.Confirmed.concat(cell.Waiting);
        list.push(src);

        var isValid = Indic.Indic.IsValid(list);
        if (!isValid) {
            state.InfoBar.Messages.push(Indic.Util.Format(Indic.Messages.InvalidMove, [cell.Current, src]));
            if (!useSynonyms) {
                return;
            }
            var synonym = Indic.Indic.GetSynonym(src);
            if (synonym == null) {
                return;
            }
            state.InfoBar.Messages.push(Indic.Util.Format(Indic.Messages.UseSynonym, [cell.Current, src, synonym]));

            var tile = GameActions.FindTile(state.Cabinet, synonym);
            var iPos: Contracts.iArgs = {} as Contracts.iArgs;
            iPos.Src = synonym;
            iPos.TargetCell = args.TargetCell;
            iPos.Origin = args.Origin;
            iPos.SrcCell = args.SrcCell;
            GameActions.ToBoardInternal(state, iPos, false);
            return;
        }

        cell.Waiting.push(src);
        list = cell.Confirmed.concat(cell.Waiting);
        cell.Current = Indic.Indic.ToString(list);

        if (args.Origin == "Tile") {
            tile.Remaining--;
            var synonymTile: Contracts.iTileProps = GameActions.FindSynonymTile(state.Cabinet, tile.Text);
            if (synonymTile != null) {
                synonymTile.Remaining--;
            }
            state.Cabinet.Remaining--;
        }
        if (args.Origin == "Cell") {
            var srcCell: Contracts.iCellProps = state.Board.Cells[args.SrcCell];
            srcCell.Waiting.pop();
            list = srcCell.Confirmed.concat(srcCell.Waiting);
            srcCell.Current = Indic.Indic.ToString(list);
        }
        GameActions.RefreshClaims(state);
    }
    public static ToBoard(state: Contracts.iGameState, args: Contracts.iArgs): void {
        GameActions.ToBoardInternal(state, args, true);
    }
    public static FindTile(cabinet: Contracts.iCabinetProps, char: string): Contracts.iTileProps {
        for (var i = 0; i < cabinet.Trays.length; i++) {
            var tray: Contracts.iTrayProps = cabinet.Trays[i];
            for (var j = 0; j < tray.Tiles.length; j++) {
                var tile: Contracts.iTileProps = tray.Tiles[j];
                if (tile.Text == char) { return tile; }
            }
        }
        return null;
    }
    public static FindSynonymTile(cabinet: Contracts.iCabinetProps, char: string): Contracts.iTileProps {
        var synonym: string = Indic.Indic.GetSynonym(char);
        return GameActions.FindTile(cabinet, synonym);
    }
    public static OpenClose(state: Contracts.iGameState, args: Contracts.iArgs) {
        var tray: Contracts.iTrayProps = state.Cabinet.Trays[args.TrayIndex];
        tray.Show = !tray.Show;
        //To make sure atleast one group is available.
        //Restrict from hiding all groups
        var cnt: number = 0; var last = -1;
        for (var i = 0; i < state.Cabinet.Trays.length; i++) {
            if (cnt > 1) {
                break;
            }
            if (state.Cabinet.Trays[i].Show) {
                cnt++;
                last = i;
            }
        }
        if (cnt == 1) {
            state.Cabinet.Trays[last].Disabled = true;
        } else {
            for (var i = 0; i < state.Cabinet.Trays.length; i++) {
                state.Cabinet.Trays[i].Disabled = false;
            }
        }
    }
    public static UnConfirmed(Board: Contracts.iBoardProps): number {
        //Currently It's a single player game
        var weight = 0;
        for (var i = 0; i < Board.Cells.length; i++) {
            var cell: Contracts.iCellProps = Board.Cells[i];
            if (cell.Waiting.length > 0) {
                weight = weight + cell.Weight;
            }
        }
        return weight;
    }
    public static TotalTiles(Cabinet: Contracts.iCabinetProps): number {
        var count = 0;
        for (var i = 0; i < Cabinet.Trays.length; i++) {
            var tray: Contracts.iTrayProps = Cabinet.Trays[i];
            for (var j = 0; j < tray.Tiles.length; j++) {
                var tile: Contracts.iTileProps = tray.Tiles[j];
                count = count + tile.Total;
            }
        }
        return count;
    }
    public static RemainingTiles(Cabinet: Contracts.iCabinetProps): number {
        var total = 0;
        var s = 0;
        for (var i = 0; i < Cabinet.Trays.length; i++) {
            var tray: Contracts.iTrayProps = Cabinet.Trays[i];
            for (var j = 0; j < tray.Tiles.length; j++) {
                var tile: Contracts.iTileProps = tray.Tiles[j];
                var sym: string = Indic.Indic.GetSynonym(tile.Text)
                if (sym != null) {
                    s = s + tile.Remaining;
                }
                total = total + tile.Remaining;
            }
        }
        return total - (s / 2);
    }
    static FirstNonEmpty(Cells: Contracts.iCellProps[], Clustered: number[], size: number): number {
        var first: number = -1;
        for (var i = 0; i < size * size; i++) {
            if (Clustered.indexOf(i) >= 0) {
                continue;
            }
            if (Cells[i].Confirmed.length + Cells[i].Waiting.length == 0) {
                continue;
            }
            first = i;
            break;
        }
        return first;
    }
    static ClusterCells(Cells: Contracts.iCellProps[], first: number, size: number): number[] {
        var List: number[] = [];
        List.push(first);
        {
            var P: Contracts.iPosition = BoardUtil.Position(first, size);
            var C: Contracts.iCellProps = Cells[first];
        }
        var curr = 0;
        var found: boolean = true;
        while (found) {
            if (curr >= List.length) {
                break;
            }
            found = false;
            var neighors = BoardUtil.FindNeighbors(List[curr], size);
            for (var i = 0; i < neighors.length; i++) {
                var neighbor = neighors[i];
                if (List.indexOf(neighbor) >= 0) {
                    continue;
                }
                found = true;
                var C = Cells[neighbor];
                if (C.Confirmed.length + C.Waiting.length == 0) {
                    continue;
                }
                var P = BoardUtil.Position(neighbor, size);
                List.push(neighbor);
            }
            curr++;
        }
        return List;
    }
    static HasClusters(state: Contracts.iGameState): boolean {
        var Board: Contracts.iBoardProps = state.Board;
        var Clustered: number[] = [];
        var clusters = 0;
        while (true) {
            var first = GameActions.FirstNonEmpty(Board.Cells, Clustered, Board.Size);
            if (first == -1) {
                break;
            }
            var List = GameActions.ClusterCells(Board.Cells, first, Board.Size);
            Clustered = Clustered.concat(List);
            clusters++;
        }
        console.log("Clusters found: " + clusters);
        return (clusters > 1);
    }
    static HasOrphans(state: Contracts.iGameState): boolean {
        var orphans: number[] = GameActions.OrphanCells(state.Board);
        for (var i = 0; i < orphans.length; i++) {
            var orphan: number = orphans[i];
            var P: Contracts.iPosition = BoardUtil.Position(orphan, state.Board.Size);
            var N: Contracts.iCellProps = state.Board.Cells[orphan];
            state.InfoBar.Messages.push(Indic.Util.Format(Indic.Messages.OrphanCell, [(P.X + 1), (P.Y + 1), N.Current]));
        }
        return orphans.length > 0;
    }
    static OrphanCells(Board: Contracts.iBoardProps): number[] {
        var oraphans: number[] = [];
        for (var i = 0; i < Board.Cells.length; i++) {
            var Cell: Contracts.iCellProps = Board.Cells[i];
            if (Cell.Waiting.length + Cell.Confirmed.length == 0) {
                continue;
            }
            var neighors: number[] = BoardUtil.FindNeighbors(i, Board.Size);
            var valid: boolean = false;
            for (var j = 0; j < neighors.length; j++) {
                var neighbor: number = neighors[j];
                var N: Contracts.iCellProps = Board.Cells[neighbor];
                if (N.Waiting.length + N.Confirmed.length != 0) {
                    valid = true;
                }
            }
            if (!valid) {
                if (oraphans.indexOf(i) >= 0) {
                    continue;
                }
                oraphans.push(i);
            }
        }
        return oraphans;
    }
    static WordsOnColumn(Board: Contracts.iBoardProps, i: number, claimsOnly: boolean): Contracts.iWord[] {
        return GameActions.FindWords(Board, 'C', i, claimsOnly);
    }
    static WordsOnRow(Board: Contracts.iBoardProps, i: number, claimsOnly: boolean): Contracts.iWord[] {
        return GameActions.FindWords(Board, 'R', i, claimsOnly);
    }
    static FindWords(Board: Contracts.iBoardProps, option: string, r: number, claimsOnly: boolean): Contracts.iWord[] {
        var Words: Contracts.iWord[] = [];
        var pending = "";
        var cnt = 0;
        var waiting = false;
        var score = 0;
        for (var i = 0; i < Board.Size; i++) {
            var index = -1;
            switch (option) {
                case 'R':
                    index = BoardUtil.Abs(r, i, Board.Size);
                    break;
                case 'C':
                    index = BoardUtil.Abs(i, r, Board.Size);
                    break;
            }
            var cell = Board.Cells[index];

            if (cell.Waiting.length + cell.Confirmed.length != 0) {
                pending += cell.Current;
                cnt++;
                if (cell.Waiting.length > 0) {
                    waiting = true;
                }
                score += cell.Weight;
                continue;
            }

            if (pending != "" && cell.Waiting.length + cell.Confirmed.length == 0) {
                if (cnt > 1) {
                    var word = pending + cell.Current;
                    var W: Contracts.iWord = { Text: word, Waiting: waiting, Score: score };
                    if ((claimsOnly && waiting) || !claimsOnly) {
                        Words.push(W);
                    }
                    console.log(word + (W.Waiting ? " [YES]" : ""));
                }
                pending = "";
                cnt = 0;
                waiting = false;
                score = 0;
                continue;
            }
        }
        if (cnt > 1) {
            var word = pending;
            var W: Contracts.iWord = { Text: word, Waiting: waiting, Score: score };
            if ((claimsOnly && waiting) || !claimsOnly) {
                Words.push(W);
            }
            console.log(word + (W.Waiting ? " [YES]" : ""));
        }
        return Words;
    }
    static ValidateMove(Board: Contracts.iBoardProps): boolean {
        var Cells: Contracts.iCellProps[] = Board.Cells;
        var size: number = Board.Size;
        var cnt = 0;
        var rows = 0;
        var columns = 0;
        var First: Contracts.iPosition = {} as Contracts.iPosition;
        for (var i = 0; i < size * size; i++) {
            var C = Cells[i];
            if (C.Waiting.length == 0) {
                continue;
            }
            if (C.Confirmed.length + C.Waiting.length == 0) {
                continue;
            }
            if (cnt == 0) {
                First = BoardUtil.Position(i, size);
                cnt++;
                continue;
            }
            var Current = BoardUtil.Position(i, size);
            if (Current.X != First.X) {
                rows++;
            }
            if (Current.Y != First.Y) {
                columns++;
            }
        }

        if (rows == 0 || columns == 0) {
            return true;
        }
        return false;
    }
    static WordsOnBoard(Board: Contracts.iBoardProps, claimsOnly: boolean): Contracts.iWord[] {
        var Words: Contracts.iWord[] = [];
        for (var i = 0; i < Board.Size; i++) {
            var R = GameActions.WordsOnRow(Board, i, claimsOnly);
            var C = GameActions.WordsOnColumn(Board, i, claimsOnly);
            Words = Words.concat(R);
            Words = Words.concat(C);
        }
        return Words;
    }
    static SyncSynonym(cabinet: Contracts.iCabinetProps, key: string, synonym: string) {
        var iKeyTile: Contracts.iTileProps = GameActions.FindTile(cabinet, key);
        var iSynonymTile: Contracts.iTileProps = GameActions.FindTile(cabinet, synonym);
        if (iKeyTile.Total == iSynonymTile.Total) {
            return;
        }
        if (iKeyTile.Total > iSynonymTile.Total) {
            iSynonymTile.Total = iKeyTile.Total;
            iSynonymTile.Remaining = iKeyTile.Remaining;
        } else {
            iKeyTile.Total = iSynonymTile.Total;
            iKeyTile.Remaining = iSynonymTile.Remaining;
        }
        cabinet.Remaining = cabinet.Remaining - iKeyTile.Remaining;
    }
}
export class BoardUtil {
    public static Abs(X: number, Y: number, size: number): number {
        const min = 0;
        var max: number = size - 1;

        if ((X < min || X > max) || (Y < min || Y > max)) {
            return -1;
        }
        return (size * (X + 1)) + Y - size;
    }
    public static Position(N: number, size: number): Contracts.iPosition {
        var X: number = Math.floor(N / size);
        var Y: number = (N % size);
        return { X: X, Y: Y };
    }
    static FindNeighbors(index: number, size: number): number[] {
        var arr: number[] = [];
        var pos: Contracts.iPosition = BoardUtil.Position(index, size);
        var bottom: number = BoardUtil.Abs(pos.X + 1, pos.Y, size);
        var top: number = BoardUtil.Abs(pos.X - 1, pos.Y, size);
        var left: number = BoardUtil.Abs(pos.X, pos.Y - 1, size);
        var right: number = BoardUtil.Abs(pos.X, pos.Y + 1, size);
        var a = [right, left, top, bottom];
        for (var i = 0; i < a.length; i++) {
            if (a[i] != -1) {
                arr.push(a[i]);
            }
        }
        return arr;
    }

}