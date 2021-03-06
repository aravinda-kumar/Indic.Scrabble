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

import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as Contracts from 'Contracts';
import * as Messages from 'Messages';
import * as Indic from 'Indic';
import * as Util from 'Util';
import * as AskBot from 'AskBot';
import * as GS from 'GameStore';
import * as Game from 'GameRoom';
import * as WL from 'WordLoader';
import * as AskReferee from 'AskReferee';
declare var Config: Contracts.iRawConfig;

export class GameActions {
    //Move to Seperate Config File
    static Init(state: Contracts.iGameState, args: Contracts.iArgs): void {
        GameActions.Render();
        var players = state.Players.Players;
        var current = state.Players.Current;
        state.GameTable.Message = Util.Util.Format(Messages.Messages.YourTurn, [players[current].Name]);
        PubSub.Subscribe(Contracts.Events.GameOver, GameActions.GameOver);
        setTimeout(GameActions.PinchPlayer, Contracts.Settings.PinchWait);
    }
    static PinchPlayer(): void {
        GS.GameStore.Dispatch({
            type: Contracts.Actions.PunchAndPick,
            args: {
            }
        });
    }
    static PunchAndPick(state: Contracts.iGameState, args: Contracts.iArgs): void {
        if (state.GameOver) {
            return;
        }
        var players = state.Players.Players;
        var currentPlayer = state.Players.Current;
        var isBot: boolean = players[currentPlayer].Bot !== null;
        state.ReadOnly = isBot;
        if (!isBot) {
            return;
        }
        state.GameTable.Message = Util.Util.Format(Messages.Messages.Thinking, [players[currentPlayer].Name]);
        //
        setTimeout(AskBot.AskServer.NextMove, Contracts.Settings.BotWait);
    }
    static Render(): any {
        var rootEl = document.getElementById('root');
        var state: any = GS.GameStore.GetState();
        var left = React.createElement(((Game.default as any) as React.ComponentClass<Contracts.iGameState>), state);
        return ReactDOM.render(left, rootEl);
    }
    static RequestSuggestion(state: Contracts.iGameState, args: Contracts.iArgs): void {
        state.Suggestion.Loaded = false;
        state.Suggestion.Show = true;
        //
        var post = GameActions.PostInfo(state);
        AskBot.AskServer.Suggest(post);
    }
    static ReciveSuggestion(state: Contracts.iGameState, response: Contracts.iBotMoveResponse): void {
        state.Suggestion.Loaded = true;
        state.Suggestion.Moves = [response.Result];
    }
    static DismissSuggestion(state: Contracts.iGameState, args: Contracts.iArgs): void {
        state.Suggestion.Loaded = false;
        state.Suggestion.Moves = [];
        state.Suggestion.Show = false;
    }
    static Pass(state: Contracts.iGameState, args: Contracts.iArgs): void {
        AskReferee.AskReferee.Validate(state, args);
    }
    static TakeConsent(state: Contracts.iGameState, words: string[]): void {
        state.Consent.Pending = GameActions.BuildWordPairs(words);
        state.Consent.UnResolved = [];
        state.ReadOnly = true;
        var player: Contracts.iPlayer = state.Players.Players[state.Players.Current];
        state.GameTable.Message = Util.Util.Format(Messages.Messages.YourTurn, [player.Name]);
    }
    static ResolveWord(state: Contracts.iGameState, args: Contracts.iArgs): void {
        var word: Contracts.iWordPair = state.Consent.Pending.pop();
        WL.WordLoader.AddWord(word.Scrabble);
        GameActions.ConsentRecieved(state, args);
    }
    static RejectWord(state: Contracts.iGameState, args: Contracts.iArgs): void {
        if (state.Consent.Pending.length > 0) {
            var word: Contracts.iWordPair = state.Consent.Pending.pop();
            state.Consent.UnResolved.push(word);
        }
        GameActions.ConsentRecieved(state, args);
    }
    static ConsentRecieved(state: Contracts.iGameState, args: Contracts.iArgs): void {
        state.ReadOnly = false;
        if (state.Consent.Pending.length == 0) {
            if (state.Consent.UnResolved.length == 0) {
                GameActions.Award(state, args);
                return;
            }
        }
    }
    static BuildWordPairs(words: string[]): Contracts.iWordPair[] {
        var list: Contracts.iWordPair[] = [];
        for (var indx in words) {
            var readable: string = Indic.Indic.ToWord(words[indx].split(','));
            list.push({ Scrabble: words[indx], Readble: readable });
        }
        return list;
    }
    static ResolveWords(state: Contracts.iGameState, args: Contracts.iArgs): void {
        var player = state.Players.Players[state.Players.Current];
        if (player.Bot != null) {
            GameActions.Award(state, args);
        }
        else {
            var words: string[] = AskReferee.AskReferee.ExtractWords(state.Board);
            AskBot.AskServer.Resolve(words);
        }
    }
    static Award(state: Contracts.iGameState, args: Contracts.iArgs): void {
        GameActions.ResetTable(state);
        GameActions.AwardClaims(state);
        GameActions.SetScores(state);
        GameActions.SaveBoard(state);
        GameActions.SwitchTurn(state);
        GameActions.Refresh(state);
        GameActions.SetStats(state);
        if (state.GameOver) {
            GameActions.SetWinner(state);
            PubSub.Publish(Contracts.Events.GameOver, state as Contracts.iArgs);
            return;
        }
        setTimeout(GameActions.PinchPlayer, Contracts.Settings.PinchWait);
    }
    static SetWinner(state: Contracts.iGameState) {
        state.ReadOnly = true;
        var winner: Contracts.iPlayer = GameActions.FindWinner(state);
        if (winner == null) {
            state.GameTable.Message = Messages.Messages.MatchTied;
        } else {
            state.GameTable.Message = Util.Util.Format(Messages.Messages.Winner, [winner.Name]);
        }
        state.Dialog.Title = Messages.Messages.Name;
        state.Dialog.Message = state.GameTable.Message;
        state.Dialog.Show = true;

        //
        state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.Stats, [state.Stats.EmptyCells, state.Stats.Occupancy.toFixed(2), state.Stats.TotalWords, state.Stats.UnUsed.toFixed(2)]));
        state.InfoBar.Messages.push(Messages.Messages.GameOver);
        state.InfoBar.Messages.push(state.GameTable.Message);
        //
    }
    static SetStats(state: Contracts.iGameState) {
        var stats: Contracts.iBoardsStats = {
            EmptyCells: 0,
            Occupancy: 0,
            TotalWords: 0,
            UnUsed: 0
        };
        stats.TotalWords = GameActions.GetTotalWords(state.Players);
        stats.EmptyCells = GameActions.GetEmptyCells(state.Board);
        stats.Occupancy = (state.Board.Cells.length - stats.EmptyCells) * 100.00 / state.Board.Cells.length;
        stats.UnUsed = state.Cabinet.Remaining * 100.00 / state.Cabinet.Total;
        state.Stats = stats;
    }
    static GetEmptyCells(board: Contracts.iBoardProps): number {
        var tot: number = 0;
        for (var i: number = 0; i < board.Cells.length; i++) {
            var tiles = board.Cells[i].Confirmed.length;
            if (tiles == 0) {
                tot++;
            }
        }
        return tot;
    }
    static GetTotalWords(players: Contracts.iPlayers): number {
        var tot: number = 0;
        for (var i = 0; i < players.Players.length; i++) {
            var player: Contracts.iPlayer = players.Players[i];
            tot = tot + player.Awarded.length;
        }
        return tot;
    }
    static FindWinner(state: Contracts.iGameState): Contracts.iPlayer {
        var maxScore: number = -1;
        var winnerIndex: number = 0;
        for (var i = 0; i < state.Players.Players.length; i++) {
            var player: Contracts.iPlayer = state.Players.Players[i];
            if (player.Score == maxScore) {
                return null;
            }
            if (player.Score > maxScore) {
                maxScore = player.Score;
                winnerIndex = i;
            }
        }
        return state.Players.Players[winnerIndex];
    }
    static BotMoveResponse(state: Contracts.iGameState, response: Contracts.iBotMoveResponse): void {
        var result = response.Result;
        var player: Contracts.iPlayer = state.Players.Players[state.Players.Current];
        if (result == null) {
            state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.BotNoWords, [response.Effort, player.Name]));
            GameActions.ReDraw(state, {});
            GameActions.Pass(state, {});
            return;
        }
        state.InfoBar.Messages.push(Util.Util.Format(result.WordsCount == 1 ? Messages.Messages.BotEffort : Messages.Messages.BotEffort2, [response.Effort, player.Name, result.WordsCount]));
        for (var i in result.Moves) {
            var Move: Contracts.iBotMove = result.Moves[i];
            var tiles: string[] = Move.Tiles.split(',');
            for (var j in tiles) {
                var tile = tiles[j];
                if (tile == "") {
                    debugger; //Response shouldn't contain a Blank Tile:To be Investigated
                    continue;
                }
                if (Indic.Indic.HasSyllableSynonym(tile)) {
                    tile = Indic.Indic.GetSyllableSynonym(tile);
                }
                GameActions.ToBoard(state,
                    {
                        Origin: "Tile",
                        Src: tile,
                        TargetCell: Move.Index
                    });
            }
        }
        GameActions.Pass(state, {});
    }
    static BotMove(state: Contracts.iGameState, args: Contracts.iArgs): void {
        var post = GameActions.PostInfo(state);
        AskBot.AskServer.BotMove(post);
    }

    static PostInfo(state: Contracts.iGameState): any {
        var Cells: string[] = [];
        for (var i in state.Board.Cells) {
            var Cell: Contracts.iCellProps = state.Board.Cells[i];
            var arr: string[] = [];
            for (var indx in Cell.Confirmed) {
                var c = Cell.Confirmed[indx];
                if (Indic.Indic.IsSpecialSyllable(c)) {
                    arr = arr.concat(Indic.Indic.GetSyllableTiles(c));
                    continue;
                }
                if (Indic.Indic.IsSpecialSet(c)) {
                    arr.push(Indic.Indic.GetSynonym(c));
                    continue;
                }
                arr.push(c);
            }
            Cells.push(arr.join(','));
        }

        var Vowels: string[] = [];
        var Cosos: string[] = [];
        var Special: string[] = [];

        for (var i in state.GameTable.VowelTray.Tiles) {
            var Tile: Contracts.iTileProps = state.GameTable.VowelTray.Tiles[i];
            Vowels.push(Tile.Text);
        }

        for (var i in state.GameTable.ConsoTray.Tiles) {
            var Tile: Contracts.iTileProps = state.GameTable.ConsoTray.Tiles[i];
            if (Tile.Text.length > 1) {
                Special.push("(" + Indic.Indic.GetSyllableTiles(Tile.Text).join(',') + ") ");
                continue;
            }
            Cosos.push(Tile.Text);
        }

        var myScore = state.Players.Players[state.Players.Current].Score;
        var oppScore = state.Players.Players[state.Players.Current == 1 ? 0 : 1].Score;

        var Name: string = state.Board.Name;
        var players = state.Players.Players;
        var currentPlayer = state.Players.Current;
        var bot: Contracts.Bot = players[currentPlayer].Bot;
        var BotName: string = bot == null ? null : bot.Id;
        var reference = Math.floor(Math.random() * 1000).toString();
        var board = {
            "Reference": reference,
            "Name": Name,
            "Bot": BotName,
            "Id": state.GameId,
            "Cells": Cells,
            "Vowels": Vowels.join(' '),
            "Conso": Cosos.join(' '),
            "Special": Special.join(' ')
        };
        var scores = { "MyScore": myScore, "OppScore": oppScore };
        return { "Board": board, "Scores": scores };
    }
    static SaveBoard(state: Contracts.iGameState): void {
        for (var i = 0; i < state.Board.Cells.length; i++) {
            var Cell: Contracts.iCellProps = state.Board.Cells[i];
            Cell.Confirmed = Cell.Confirmed.concat(Cell.Waiting);
            Cell.Waiting = [];
        }
    }
    static Refresh(state: Contracts.iGameState) {
        GameActions.RefreshTrays(state.Cabinet.Trays, state.Cache);
        GameActions.RefreshCabinet(state.Cabinet, state.Cache);
        GameActions.RefreshClaims(state);
    }
    static RefreshClaims(state: Contracts.iGameState): void {
        var Claims: Contracts.iWord[] = GameActions.WordsOnBoard(state.Board, true, false);
        var playerId: number = state.Players.Current;
        var player: Contracts.iPlayer = state.Players.Players[playerId];
        player.Claimed = Claims;
        state.Players.HasClaims = Claims.length > 0;
        state.GameTable.CanReDraw = !GameActions.HasWaiting(state.Board);
    }
    static HasWaiting(board: Contracts.iBoardProps): boolean {
        var res: boolean = false;
        for (var i = 0; i < board.Cells.length; i++) {
            var cell: Contracts.iCellProps = board.Cells[i];
            if (cell.Waiting.length > 0) {
                res = true;
                break;
            }
        }
        return res;
    }
    static RefreshCabinet(cabinet: Contracts.iCabinetProps, cache: Contracts.iCachedTile): void {
        var remaining = 0;
        var total = 0;
        for (var key in cache) {
            remaining = remaining + cache[key].Remaining;
            total = total + cache[key].Total;
        }
        cabinet.Remaining = remaining;
        cabinet.Total = total;
        for (var i = 0; i < cabinet.Trays.length; i++) {
            var item = cabinet.Trays[i];
            for (var j = 0; j < item.Tiles.length; j++) {
                var tile = item.Tiles[j];
                tile.OnBoard = cache[tile.Text].OnBoard;
                tile.Remaining = cache[tile.Text].Remaining;
            }
        }
    }
    static RefreshTrays(trays: Contracts.iTrayProps[], cache: Contracts.iCachedTile): void {
        for (var i = 0; i < trays.length; i++) {
            var tray: Contracts.iTrayProps = trays[i];
            GameActions.RefreshTray(tray, cache);
        }
    }
    static RefreshTray(tray: Contracts.iTrayProps, cache: Contracts.iCachedTile): void {
        for (var j = 0; j < tray.Tiles.length; j++) {
            var tile: Contracts.iTileProps = tray.Tiles[j];
            var text = tile.Text;
            if (cache[text] == null) {
                var synm = Indic.Indic.GetSynonym(text);
                tile.Remaining = cache[synm].Remaining;
                tile.Total = cache[synm].Remaining;
                tile.OnBoard = cache[synm].OnBoard;
                continue;
            }
            {
                tile.Remaining = cache[text].Remaining;
                tile.Total = cache[text].Remaining;
                tile.OnBoard = cache[text].OnBoard;
            }
        }
    }
    static AwardClaims(state: Contracts.iGameState): void {
        var Claims: Contracts.iWord[] = GameActions.WordsOnBoard(state.Board, true, false);
        var playerId: number = state.Players.Current;
        var player: Contracts.iPlayer = state.Players.Players[playerId];
        player.Awarded = player.Awarded.concat(Claims);
        player.Claimed = [];
    }
    static AwardedWords(state: Contracts.iGameState) {
        var Words: Contracts.iWord[] = [];
        for (var i = 0; i < state.Players.Players.length; i++) {
            var player: Contracts.iPlayer = state.Players.Players[i];
            Words = Words.concat(player.Awarded);
        }
        return Words;
    }
    static SetScores(state: Contracts.iGameState): void {
        for (var i = 0; i < state.Players.Players.length; i++) {
            var player: Contracts.iPlayer = state.Players.Players[i];
            var score: number = 0;
            for (var w = 0; w < player.Awarded.length; w++) {
                score += player.Awarded[w].Score;
            }
            if (player.CurrentTurn) {
                if (player.Score == score) {
                    player.NoWords++;
                    state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.NoWordsAdded, [player.Name, player.NoWords]));
                }
                else { player.NoWords = 0; }
            }
            player.Score = score;
            if (player.NoWords >= Contracts.Settings.NoWords) {
                state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.WhyGameOver, [player.Name, player.NoWords]));
                state.GameOver = true;
            }
        }
    }
    static SwitchTurn(state: Contracts.iGameState): void {
        for (var i = 0; i < state.Players.Players.length; i++) {
            var player: Contracts.iPlayer = state.Players.Players[i];
            player.CurrentTurn = !player.CurrentTurn;
            if (player.CurrentTurn) {
                state.Players.Current = i;
                state.GameTable.Message = Util.Util.Format(Messages.Messages.YourTurn, [player.Name]);
            }
        }
    }
    static ToTray(state: Contracts.iGameState, args: Contracts.iArgs): void {
        if (args.SrcCell == null) {
            //May be Tile dropped on Tile.
            return;
        }
        var cell: Contracts.iCellProps = state.Board.Cells[args.SrcCell];
        if (cell.Waiting.length == 0) {
            return;
        }
        if (cell.Waiting.length > 0) {
            var toRemove: string = cell.Waiting[cell.Waiting.length - 1];
            cell.Waiting.pop();
            cell.Current = Indic.Indic.ToString(cell.Confirmed.concat(cell.Waiting));
            GameActions.Play(state.GameTable, toRemove, 1, true);
        }
        GameActions.Refresh(state);
    }
    static ToBoardInternal(state: Contracts.iGameState, args: Contracts.iArgs, useSynonyms: boolean): void {
        var src: string = args.Src;
        var tray: Contracts.iTrayProps;
        var tile: Contracts.iTileProps;
        if (args.Origin == "Tile") {
            var remaining = GameActions.GetRemaining(state, src);
            if (remaining == 0) {
                return;
            }
        }

        var cell: Contracts.iCellProps = state.Board.Cells[args.TargetCell];
        var list: string[] = cell.Confirmed.concat(cell.Waiting);
        list.push(src);

        var isValid = Indic.Indic.IsValid(list);
        if (!isValid) {
            if (!useSynonyms) {
                return;
            }
            var synonym = Indic.Indic.GetSynonym(src);
            if (synonym == null) {
                return;
            }

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
            GameActions.Play(state.GameTable, src, 0, true);
        }
        if (args.Origin == "Cell") {
            var srcCell: Contracts.iCellProps = state.Board.Cells[args.SrcCell];
            srcCell.Waiting.pop();
            list = srcCell.Confirmed.concat(srcCell.Waiting);
            srcCell.Current = Indic.Indic.ToString(list);
        }
        GameActions.Refresh(state);
    }
    static Play(gameTable: Contracts.iGameTable, src: string, val: number, useSynonym: boolean): void {
        GameActions.PlayInternal(gameTable.VowelTray, src, val, true);
        GameActions.PlayInternal(gameTable.ConsoTray, src, val, true);
    }
    static PlayInternal(tray: Contracts.iTrayProps, src: string, val: number, useSynonym: boolean): void {
        var indx: number = -1;
        for (var i = 0; i < tray.Tiles.length; i++) {
            var tile: Contracts.iTileProps = tray.Tiles[i];
            if (tile.Text != src) {
                continue;
            }
            if (tile.Remaining == val || tile.Total == val) {
                //Ideally both should be equal 0 or 1
                continue;
            }
            tile.Remaining = val;
            tile.Total = val;
            indx = i;
            break; //There could be multiple Tiles with Same Text
        }
        if (indx == -1 && useSynonym) {
            //Try Synonym
            var synonym = Indic.Indic.GetSynonym(src);
            if (synonym == null) {
                return;
            }
            GameActions.PlayInternal(tray, synonym, val, false);
        }
    }
    static ToBoard(state: Contracts.iGameState, args: Contracts.iArgs): void {
        GameActions.ToBoardInternal(state, args, true);
    }
    static GetRemaining(state: Contracts.iGameState, char: string): number {
        var cabinet: Contracts.iCabinetProps = state.Cabinet;
        var cache: Contracts.iCachedTile = state.Cache;
        if (cache[char] == null) {
            var synonym: string = Indic.Indic.GetSynonym(char);
            return cache[synonym].Remaining;
        }
        return cache[char].Remaining;
    }
    static OpenClose(state: Contracts.iGameState, args: Contracts.iArgs) {
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
    static SetRemaining(cache: Contracts.iCachedTile, text: string, incBy: number) {
        if (cache[text] != null) {
            cache[text].Remaining = cache[text].Remaining + incBy;
            cache[text].OnBoard = cache[text].OnBoard + incBy
            return;
        }
        var synonym: string = Indic.Indic.GetSynonym(text);
        cache[synonym].Remaining = cache[synonym].Remaining + incBy;
        cache[text].OnBoard = cache[text].OnBoard + incBy
    }
    static WordsOnColumn(Board: Contracts.iBoardProps, i: number, claimsOnly: boolean, asSyllables: boolean): Contracts.iWord[] {
        return GameActions.FindWords(Board, 'C', i, claimsOnly, asSyllables);
    }
    static WordsOnRow(Board: Contracts.iBoardProps, i: number, claimsOnly: boolean, asSyllables: boolean): Contracts.iWord[] {
        return GameActions.FindWords(Board, 'R', i, claimsOnly, asSyllables);
    }
    static FindWords(Board: Contracts.iBoardProps, option: string, r: number, claimsOnly: boolean, asSyllables: boolean): Contracts.iWord[] {
        var Words: Contracts.iWord[] = [];
        var pending = "";
        var cnt = 0;
        var waiting = false;
        var score = 0;
        var seperator = asSyllables ? "," : "";
        for (var i = 0; i < Board.Size; i++) {
            var index = -1;
            switch (option) {
                case 'R':
                    index = Util.Util.Abs(r, i, Board.Size);
                    break;
                case 'C':
                    index = Util.Util.Abs(i, r, Board.Size);
                    break;
            }
            var cell = Board.Cells[index];

            if (cell.Waiting.length + cell.Confirmed.length != 0) {
                pending += cell.Current + seperator;
                cnt++;
                if (cell.Waiting.length > 0) {
                    waiting = true;
                }
                for (var x in cell.Waiting) {
                    score += Board.TileWeights[cell.Waiting[x]];
                }
                for (var x in cell.Confirmed) {
                    score += Board.TileWeights[cell.Confirmed[x]];
                }
                score += cell.Weight;
                continue;
            }

            if (pending != "" && cell.Waiting.length + cell.Confirmed.length == 0) {
                if (cnt > 1) {
                    var word = (pending + seperator + cell.Current);
                    word = word.TrimEnd(' ').TrimEnd(seperator);
                    var W: Contracts.iWord = { Text: word, Waiting: waiting, Score: score };
                    if ((claimsOnly && waiting) || !claimsOnly) {
                        Words.push(W);
                    }
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
            word = word.TrimEnd(' ').TrimEnd(seperator);
            var W: Contracts.iWord = { Text: word, Waiting: waiting, Score: score };
            if ((claimsOnly && waiting) || !claimsOnly) {
                Words.push(W);
            }
        }
        return Words;
    }
    static WordsOnBoard(Board: Contracts.iBoardProps, claimsOnly: boolean, asSyllables: boolean): Contracts.iWord[] {
        var Words: Contracts.iWord[] = [];
        for (var i = 0; i < Board.Size; i++) {
            var R = GameActions.WordsOnRow(Board, i, claimsOnly, asSyllables);
            var C = GameActions.WordsOnColumn(Board, i, claimsOnly, asSyllables);
            Words = Words.concat(R);
            Words = Words.concat(C);
        }
        return Words;
    }
    static ReDraw(state: Contracts.iGameState, args: Contracts.iArgs): void {
        GameActions.ResetOnBoard(state.Cache);
        {
            var available: string[] = GameActions.DrawVowelTiles(state.Cache, {}, state.GameTable.MaxVowels);
            var tray: Contracts.iTrayProps = GameActions.SetTableTray(available, state.Board.TileWeights, "Vowels");
            state.GameTable.VowelTray = tray;
            GameActions.SetOnBoard(state.Cache, available);
        }
        {
            var available = GameActions.DrawConsoTiles(state.Cache, {}, state.GameTable.MaxOnTable - state.GameTable.MaxVowels);
            var tray = GameActions.SetTableTray(available, state.Board.TileWeights, "Conso");
            state.GameTable.ConsoTray = tray;
            GameActions.SetOnBoard(state.Cache, available);
        }
        GameActions.RefreshCabinet(state.Cabinet, state.Cache);
    }
    static ResetOnBoard(cache: Contracts.iCachedTile) {
        for (var prop in cache) {
            cache[prop].OnBoard = 0;
        }
    }
    static SetOnBoard(cache: Contracts.iCachedTile, available: string[]) {
        for (var item in available) {
            cache[available[item]].OnBoard++;
        }
    }
    static ResetVowelsTray(state: Contracts.iGameState): void {
        var gameTable: Contracts.iGameTable = state.GameTable;
        var vtray: Contracts.iTrayProps = state.GameTable.VowelTray;
        var movedTiles: string[] = GameActions.CountTiles(vtray, true);
        for (var indx in movedTiles) {
            var toRemove = movedTiles[indx];
            GameActions.SetRemaining(state.Cache, toRemove, -1);
        }
        var unMovedTiles: string[] = GameActions.CountTiles(vtray, false);
        var vCount = 0;
        var unMoved: any = {};
        for (var i = 0; i < unMovedTiles.length; i++) {
            var prop = unMovedTiles[i];
            if (Indic.Indic.IsVowel(prop) || Indic.Indic.IsSunnaSet(prop)) {
                vCount++;
                unMoved[prop] = (unMoved[prop] == null) ? 1 : (unMoved[prop] + 1);
            }
        }
        var fresh = GameActions.DrawVowelTiles(state.Cache, unMoved, gameTable.MaxVowels - vCount);
        var available = unMovedTiles.concat(fresh);
        available.sort();
        state.GameTable.VowelTray = GameActions.SetTableTray(available, state.Board.TileWeights, "Vowels");
    }
    static ResetConsoTray(state: Contracts.iGameState): void {
        var gameTable: Contracts.iGameTable = state.GameTable;
        var ctray: Contracts.iTrayProps = state.GameTable.ConsoTray;
        var movedTiles: string[] = GameActions.CountTiles(ctray, true);
        for (var indx in movedTiles) {
            var toRemove = movedTiles[indx];
            GameActions.SetRemaining(state.Cache, toRemove, -1);
        }
        var unMovedTiles: string[] = GameActions.CountTiles(ctray, false);
        var vCount = 0;
        var unMoved: any = {};
        for (var i = 0; i < unMovedTiles.length; i++) {
            var prop = unMovedTiles[i];
            if (Indic.Indic.IsConsonent(prop)) {
                vCount++;
                unMoved[prop] = (unMoved[prop] == null) ? 1 : (unMoved[prop] + 1);
            }
        }
        var fresh = GameActions.DrawConsoTiles(state.Cache, unMoved, (gameTable.MaxOnTable - gameTable.MaxVowels) - vCount);
        var available = unMovedTiles.concat(fresh);
        available.sort();
        state.GameTable.ConsoTray = GameActions.SetTableTray(available, state.Board.TileWeights, "Conso");
    }
    static ResetTable(state: Contracts.iGameState): void {
        GameActions.ResetVowelsTray(state);
        GameActions.ResetConsoTray(state);
    }
    static CountTiles(tray: Contracts.iTrayProps, moved: boolean): string[] {
        var set: string[] = [];
        for (var i = 0; i < tray.Tiles.length; i++) {
            if ((moved && tray.Tiles[i].Remaining == 0) ||
                (!moved && tray.Tiles[i].Remaining != 0)) {
                set.push(tray.Tiles[i].Text);
            }
        }
        return set;
    }
    static SetTableTray(picked: string[], tileWeights: any, id: string): Contracts.iTrayProps {
        var tray: Contracts.iTrayProps = ({} as any) as Contracts.iTrayProps;
        tray.Id = id;
        tray.key = tray.Id;
        tray.className = "tray";
        tray.Title = "Game Table";
        tray.Show = true;
        tray.Disabled = false;
        tray.ReadOnly = false;
        tray.Index = -1;
        tray.Tiles = [];

        var index = 0;
        for (var j = 0; j < picked.length; j++) {
            var prop: Contracts.iTileProps = ({} as any) as Contracts.iTileProps;
            prop.Id = "S_" + (index + 1).toString();
            prop.key = prop.Id;
            prop.Text = picked[j];
            prop.Remaining = 1;
            prop.Total = 1;
            prop.Weight = tileWeights[picked[j]];
            prop.Index = j;
            prop.TrayIndex = -1;
            prop.ReadOnly = false;
            tray.Tiles.push(prop);
            index++;
        }
        return tray;
    }
    static AvailableVowels(cache: Contracts.iCachedTile, unMoved: any): string[] {
        var available: string[] = [];
        for (var prop in cache) {
            var pending: number = unMoved[prop] == null ? 0 : unMoved[prop];
            if ((Indic.Indic.IsVowel(prop) || Indic.Indic.IsSunnaSet(prop)) && (cache[prop].Remaining - cache[prop].OnBoard - pending > 0)) {
                for (var i = 0; i < cache[prop].Remaining - cache[prop].OnBoard; i++) {
                    available.push(prop)
                }
            }
        }
        return available;
    }
    static AvailableConso(cache: Contracts.iCachedTile, unMoved: any): string[] {
        var available: string[] = [];
        for (var prop in cache) {
            var pending: number = unMoved[prop] == null ? 0 : unMoved[prop];
            if (Indic.Indic.IsConsonent(prop) && (cache[prop].Remaining - cache[prop].OnBoard - pending > 0)) {
                for (var i = 0; i < cache[prop].Remaining - cache[prop].OnBoard; i++) {
                    available.push(prop)
                }
            }
        }
        return available;
    }
    static DrawVowelTiles(cache: Contracts.iCachedTile, unMoved: any, maxVowels: number): string[] {
        var vowels = GameActions.AvailableVowels(cache, unMoved);
        var pickedVowels = Util.Util.Draw(vowels, maxVowels);
        return pickedVowels;
    }
    static DrawConsoTiles(cache: Contracts.iCachedTile, unMoved: any, maxConsos: number): string[] {
        var conso = GameActions.AvailableConso(cache, unMoved);
        var pickedConso = Util.Util.Draw(conso, maxConsos);
        return pickedConso;
    }
    static GameOver(state: Contracts.iArgs): void {
        GameActions.Post(state as Contracts.iGameState);
        GameActions.Dispose(state as Contracts.iGameState);
    }
    static Post(state: Contracts.iGameState): void {
        GameActions.PostMetrics(state);
        WL.WordLoader.Post(state.GameId);
    }
    static PostMetrics(state: Contracts.iGameState): void {
        var players: any[] = [];
        for (var indx in state.Players.Players) {
            var Player: Contracts.iPlayer = state.Players.Players[indx];
            var p = { id: Player.Bot == null ? "player" : Player.Bot.Id, score: Player.Score, words: Player.Awarded.length };
            players.push(p);
        }
        var winner: Contracts.iPlayer = GameActions.FindWinner(state);
        var stats = { "EC": state.Stats.EmptyCells, "TW": state.Stats.TotalWords, "UU": Math.round(state.Stats.UnUsed * 100) / 100, "O": Math.round(state.Stats.Occupancy * 100) / 100 };
        var metrics: any = {};
        metrics["I"] = state.GameId;
        metrics["L"] = state.Board.Language;
        metrics["W"] = winner.Bot == null ? "player" : winner.Bot.Id;
        metrics["P"] = players;
        metrics["S"] = stats;
        AskBot.AskServer.SendMetrics(metrics);
    }
    static Dispose(staste: Contracts.iGameState): void {
        WL.WordLoader.Dispose();
    }
}
export class PubSub {
    //Rewritten based on https://msdn.microsoft.com/en-us/magazine/hh201955.aspx
    static Counter: number = -1;
    static Events: any = {};

    static Subscribe(eventId: number, handler: (args: Contracts.iArgs) => void): number {
        if (!PubSub.Events.hasOwnProperty(eventId.toString())) {
            PubSub.Events[eventId] = [];
        }

        var token: number = (++PubSub.Counter);
        PubSub.Events[eventId].push({ id: token, handler: handler });
        return token;
    }

    static UnSubscribe(eventId: number): void {
        for (var m in PubSub.Events) {
            if (!PubSub.Events.hasOwnProperty(m)) {
                continue;
            }
            for (var i = 0, j = PubSub.Events[m].length; i < j; i++) {
                if (PubSub.Events[m][i].id != eventId) {
                    continue;
                }
                PubSub.Events[m].splice(i, 1);
                return;
            }
        }
    }

    static Publish(eventId: number, args: Contracts.iArgs): void {
        if (!PubSub.Events.hasOwnProperty(eventId.toString())) {
            return;
        }
        setTimeout(function () { PubSub.Notify(eventId, args) }, 0);
        return;
    }

    static Notify(eventId: number, args: Contracts.iArgs) {
        var subscribers = PubSub.Events[eventId];
        for (var i = 0, j = subscribers.length; i < j; i++) {
            try {
                subscribers[i].handler(args);
            } catch (e) {
                setTimeout(function () { throw e; }, 0);
            }
        }
    };
}