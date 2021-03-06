﻿//---------------------------------------------------------------------------------------------
// <copyright file="Parser.ts" company="Chandam-ఛందం">
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
import * as GameActions from "GameActions";
import * as Indic from "Indic";
declare var Config: Contracts.iRawConfig;

export class Parser {
    public static Parse(): Contracts.iGameState {
        //No Error Handling assuming clean -input
        var cabinet: Contracts.iCabinetProps = Parser.ParseCabinet(Config.Board);
        var board: Contracts.iBoardProps = Parser.ParseBoard(Config.Board);
        var players: Contracts.iPlayers = Parser.ParsePlayers(Config.Players);
        //
        var cache: Contracts.iCachedTile = Parser.BuildCache(cabinet);
        var infoBar: Contracts.iInfoBar = Parser.BuildInfoBar();
        var gameTable: Contracts.iGameTable = Parser.BuildGameTable(Config.Board.GameTable, board.TileWeights, cache);
        var consent: Contracts.iConsent = Parser.BuildConsent();
        var suggest: Contracts.iSuggestion = Parser.BuildSuggestion();
        var stats: Contracts.iBoardsStats = { EmptyCells: 0, Occupancy: 0, TotalWords: 0, UnUsed: 0 };
        //
        GameActions.GameActions.RefreshTrays(cabinet.Trays, cache);
        GameActions.GameActions.RefreshCabinet(cabinet, cache);
        //
        var dialog: Contracts.iAlert = Parser.BuildDialog();

        //
        var gameState: Contracts.iGameState = {
            Id: "game",
            key: "game",
            GameId: Config.GameId,
            className: "game",
            ReadOnly: false,
            Show: true,
            GameOver: false,
            //
            Cache: cache,
            Cabinet: cabinet,
            Board: board,
            Players: players,
            InfoBar: infoBar,
            Consent: consent,
            Stats: stats,
            GameTable: gameTable,
            Dialog: dialog,
            Suggestion: suggest
        };
        return gameState;
    }
    public static BuildGameTable(JSON: Contracts.iRawGameTable, tileWeights: any, cache: Contracts.iCachedTile): Contracts.iGameTable {
        var vAvailable = GameActions.GameActions.DrawVowelTiles(cache, {}, JSON.MaxVowels);
        var vTray = GameActions.GameActions.SetTableTray(vAvailable, tileWeights, "Vowels");
        GameActions.GameActions.SetOnBoard(cache, vAvailable);

        var cAvailable = GameActions.GameActions.DrawConsoTiles(cache, {}, JSON.MaxOnTable - JSON.MaxVowels);
        var cTray = GameActions.GameActions.SetTableTray(cAvailable, tileWeights, "Conso");
        GameActions.GameActions.SetOnBoard(cache, cAvailable);

        var raw: Contracts.iGameTable = ({} as any) as Contracts.iGameTable;
        raw.key = "gameTable";
        raw.Id = raw.key;
        raw.className = "gameTable";
        raw.CanReDraw = true;
        raw.ReadOnly = false;
        raw.MaxOnTable = JSON.MaxOnTable;
        raw.MaxVowels = JSON.MaxVowels;
        raw.VowelTray = vTray;
        raw.ConsoTray = cTray;
        return raw;
    }
    public static ParseCabinet(JSON: Contracts.iRawBoard): Contracts.iCabinetProps {
        var raw: Contracts.iCabinetProps = ({} as any) as Contracts.iCabinetProps;
        raw.key = "Cabinet";
        raw.Trays = [];
        raw.ReadOnly = true;
        raw.Show = true;
        var index = 0;
        var tilesDict: Contracts.iCachedTile = {} as any;
        for (var i = 0; i < JSON.Trays.length; i++) {
            var item = JSON.Trays[i];
            var props: Contracts.iTrayProps = ({} as any) as Contracts.iTrayProps;
            props.Id = item.Id;
            props.key = item.Id;
            props.className = "tray";
            props.Title = item.Title;
            props.Show = item.Show;
            props.Disabled = false;
            props.ReadOnly = raw.ReadOnly;
            props.Index = i;
            props.Tiles = [];
            for (var j = 0; j < item.Set.length; j++) {
                var prop: Contracts.iTileProps = ({} as any) as Contracts.iTileProps;
                prop.Id = "T_" + (index + 1).toString();
                prop.key = prop.Id;
                var KVP = item.Set[j];
                for (var key in KVP) {
                    prop.Text = key;
                    prop.Remaining = KVP[key].C;
                    prop.Total = prop.Remaining;
                    prop.Weight = KVP[key].W;
                }
                prop.Index = j;
                prop.TrayIndex = i;
                prop.ReadOnly = raw.ReadOnly;
                props.Tiles.push(prop);
                index++;
            }
            raw.Trays.push(props);
        }
        return raw;
    }
    public static BuildCache(JSON: Contracts.iCabinetProps): Contracts.iCachedTile {
        var tilesDict: Contracts.iCachedTile = {} as any;
        for (var i = 0; i < JSON.Trays.length; i++) {
            var item = JSON.Trays[i];
            for (var j = 0; j < item.Tiles.length; j++) {
                var prop: Contracts.iTileProps = item.Tiles[j];
                Parser.RefreshCache(tilesDict, { Text: prop.Text, Remaining: prop.Remaining, Total: prop.Total, Weight: prop.Weight });
            }
        }
        return tilesDict;
    }
    public static ParseBoard(JSON: Contracts.iRawBoard): Contracts.iBoardProps {
        var raw: Contracts.iBoardProps = ({} as any) as Contracts.iBoardProps;
        raw.Id = "Board";
        raw.key = "Board";
        raw.Size = JSON.Size;
        raw.Name = JSON.Name;
        raw.Star = JSON.Star;
        raw.Language = JSON.Language;
        raw.Cells = [];
        raw.TileWeights = Parser.GetTileWeights(JSON.Trays);
        var index = 0;
        for (var i = 0; i < JSON.Size; i++) {
            for (var j = 0; j < JSON.Size; j++) {
                var cell: Contracts.iCellProps = ({} as any) as Contracts.iCellProps;
                cell.Id = "C_" + (index + 1).toString();
                cell.key = cell.Id;
                cell.Weight = JSON.Weights[index];
                cell.Current = " ";
                cell.Index = index;
                cell.Waiting = [];
                cell.Confirmed = [];
                cell.Star = (JSON.Star == index);
                raw.Cells.push(cell); index++;
            }
        }
        return raw;
    }
    public static ParsePlayers(players: Contracts.iPlayer[]): Contracts.iPlayers {
        var raw: Contracts.iPlayers = ({} as any) as Contracts.iPlayers;
        raw.Id = "Players";
        raw.key = raw.Id;
        raw.Players = [];
        raw.Current = 0;
        raw.HasClaims = false;
        for (var i = 0; i < players.length; i++) {
            var player: Contracts.iPlayer = players[i] as Contracts.iPlayer;
            player.CurrentTurn = (i == raw.Current);
            player.Score = 0;
            player.Unconfirmed = 0;
            player.Awarded = [];
            player.Claimed = [];
            player.Id = "P_" + (i + 1);
            player.key = player.Id;
            player.NoWords = 0;
            player.Name = player.Name;
            //
            raw.Players.push(player);
        }
        return raw;
    }
    public static BuildInfoBar(): Contracts.iInfoBar {
        var raw: Contracts.iInfoBar = ({} as any) as Contracts.iInfoBar;
        raw.key = "InfoBar";
        raw.Messages = [];
        return raw;
    }
    public static BuildDialog(): Contracts.iDialog {
        var id: string = "Dialog";
        var dialog: Contracts.iAlert =
            {
                Id: id,
                key: id,
                Show: false,
                ReadOnly: false,
                className: "",
                //
                Title: "",
                Message: "",
            };
        return dialog;
    }
    public static BuildSuggestion(): Contracts.iSuggestion {
        var id: string = "Suggest";
        var suggest: Contracts.iSuggestion =
            {
                Id: id,
                key: id,
                Show: false,
                ReadOnly: false,
                className: "",
                //
                Loaded: false,
                Moves: [],
                //
                Title: "",
                ConfirmText: "",
                CancelText: "",
                ShowConfirm: true,
                ShowClose: false,
                OnConfirm: null,
                OnDismiss: null
            };
        return suggest;
    }
    public static BuildConsent(): Contracts.iConsent {
        var id: string = "Consent";
        var consent: Contracts.iConsent =
            {
                Id: id,
                key: id,
                Show: false,
                ReadOnly: false,
                className: "",
                //
                Pending: [],
                UnResolved: []
            };
        return consent;
    }
    public static RefreshCache(cache: Contracts.iCachedTile, prop: any): void {
        var text = prop.Text;
        cache[text] =
            {
                Remaining: prop.Remaining,
                Total: prop.Total,
                OnBoard: 0
            };
        return;
    }
    static GetTileWeights(trays: Contracts.GameTray[]): any {
        var Weights: any = {};
        for (var indx in trays) {
            var tray = trays[indx];
            for (var indx2 in tray.Set) {
                var tiles = tray.Set[indx2];
                for (var indx3 in tiles) {
                    var tile: Contracts.WC = tiles[indx3];
                    Weights[indx3] = tile.W;
                    if (indx3.length > 1 && Indic.Indic.GetSyllableTiles(indx3) != null) {
                        Weights[Indic.Indic.GetSyllableTiles(indx3).join('')] = tile.W;
                        continue;
                    }
                    var sym = Indic.Indic.GetSynonym(indx3);
                    if (sym != null) {
                        Weights[sym] = tile.W;
                    }
                }
            }
        }
        return Weights;
    }
}