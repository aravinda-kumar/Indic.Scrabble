﻿//---------------------------------------------------------------------------------------------
// <copyright file="AskServer.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 27-Mar-2018 14:38EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
import * as axios from 'axios';
import * as GameLoader from 'GameLoader';
import * as Contracts from 'Contracts';
import * as U from 'Util';

export class AskBot {
    static NextMove(): void {
        GameLoader.GameLoader.store.dispatch({
            type: Contracts.Actions.BotMove,
            args: {
            }
        });
    }
    static BotMove(post: any): void {
        //Decide between Server or Client
        AskBot.BotMoveClient(post);
    }
    static BotMoveServer(post: any): void {
        axios
            .post("/API.ashx?nextmove", post)
            .then(response => {
                GameLoader.GameLoader.store.dispatch({
                    type: Contracts.Actions.BotMoveResponse,
                    args: response.data
                });
            })
            .catch(error => { });

        AskBot.BotMoveClient(post);
    }
    static BotMoveClient(post: any): void {
        setTimeout(function () {

            var st = performance.now();
            var move = new Runner().BestMove(post);
            var effort = U.Util.ElapsedTime(performance.now() - st);

            var response =
                {
                    Action: "nextmove",
                    Result: move,
                    Effort: effort
                };

            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.BotMoveResponse,
                args: response
            });
        }, 10);
    }
}

//Port of C# : Game Server
export interface Neighbor {
    Left: number;
    Right: number;
    Top: number;
    Bottom: number;
}
export interface Point {
    X: number;
    Y: number;
}
export interface Word {
    Index: number;
    Tiles: string;
    Syllables: number;
    Position: string;
}
export interface ProbableMove {
    Direction: string;
    Score: number;
    Moves: Word[];
    WordsCount: number;
    Words: ProbableWord[];
}
export interface ProbableWord {
    Cells: TargetCell[];
    Display: string;
    String: string;
    Score: number;
}
export interface TargetCell {
    Index: number;
    Target: string;
    Score: number;
}
export interface ScrabbleBoard {
    Name: string;
    Bot: string;
    //
    Reference: string;
    //Dynamic
    Cells: string[];
    Vowels: string;
    Conso: string;
    Special: string;
}
export interface Bot {
    Id: string;
    Name: string;
    Language: string;
    Dictionary: string;
}
export interface CharSet {
    Name: string;
    SunnaSet: string[];
    Vowels: string[];
    Consonents: string[];
    Synonyms: any;
    Virama: string;
}
export interface KnownBoard {
    Size: number;
    Weights: number[];
}
export class BoardUtil {
    public static FindNeighbors(index: number, size: number): Neighbor {
        var arr: Neighbor = ({ Right: -1, Left: -1, Top: -1, Bottom: -1 } as any) as Neighbor;
        var pos = BoardUtil.Position(index, size);
        var bottom = BoardUtil.Abs(pos.X + 1, pos.Y, size);
        var top = BoardUtil.Abs(pos.X - 1, pos.Y, size);
        var left = BoardUtil.Abs(pos.X, pos.Y - 1, size);
        var right = BoardUtil.Abs(pos.X, pos.Y + 1, size);
        arr = ({ Right: right, Left: left, Top: top, Bottom: bottom } as any) as Neighbor;
        return arr;
    }
    public static Position(N: number, size: number): Point {
        var X = Math.floor(N / size);
        var Y = (N % size);
        return ({ X: X, Y: Y } as any) as Point;
    }
    public static Abs(X: number, Y: number, size: number): number {
        var min = 0;
        var max = size - 1;
        if ((X < min || X > max) || (Y < min || Y > max)) {
            return -1;
        }
        return (size * (X + 1)) + Y - size;
    }
}
export class WordLoader {
    static List: Word[] = null;
    static LoadWords(file: string): Word[] {
        if (WordLoader.List != null) {
            return WordLoader.List;
        }
        WordLoader.List = [] as Word[];
        var cnt = 0;
        for (var indx in BigDict) {
            var line = BigDict[indx];
            WordLoader.List.push(
                {
                    Tiles: line,
                    Index: cnt++,
                    Syllables: line.split(',').length,
                } as Word);
        }
        BigDict = []; //Kill it.
        return WordLoader.List;
    }
    static Load(file: string): Word[] {
        //TODO..
        //Apply Cache or Read DB...
        return WordLoader.LoadWords(file);
    }
}
export class ProbableWordComparer {
    static Distinct(_Words: ProbableWord[]): ProbableWord[] {
        var Words: ProbableWord[] = [];
        for (var indx in _Words) {
            if (ProbableWordComparer.Contains(Words, _Words[indx])) {
                continue;
            }
            Words.push(_Words[indx]);
        }
        return Words;
    }
    public static Equals(x: ProbableWord, y: ProbableWord): boolean {
        if (x.Cells.length != y.Cells.length) { return false; }
        for (var i: number = 0; i < x.Cells.length; i++) {
            if (x.Cells[i].Index != y.Cells[i].Index) {
                return false;
            }
            if (x.Cells[i].Target != y.Cells[i].Target) {
                return false;
            }
        }
        return true;
    }
    public static Contains(Words: ProbableWord[], Word: ProbableWord): boolean {
        for (var indx in Words) {
            if (ProbableWordComparer.Equals(Words[indx], Word)) {
                return true;
            }
        }
        return false;
    }
}
export class Config2 {
    static GetBot(bot: string): Bot {
        //TODO..
        return {
            Id: "eenadu",
            Name: "ఈనాడు",
            Language: "te",
            Dictionary: "www.eenadu.net.scrabble"
        } as Bot;
    }
    static GetBoard(name: string): KnownBoard {
        //TODO..
        return {
            Size: 11,
            Weights: [
                6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
                1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 3, 1, 4, 1, 4, 1, 4, 1, 3, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                6, 3, 1, 4, 1, 8, 1, 4, 1, 3, 6,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 3, 1, 4, 1, 4, 1, 4, 1, 3, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1,
                6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6
            ]
        } as KnownBoard;
    }
    static GetCharSet(lang: string): CharSet {
        //TODO..
        return {
            Name: "te",
            SunnaSet: [
                "ం",
                "ః"
            ],
            Vowels: [
                "అ",
                "ఆ",
                "ఇ",
                "ఈ",
                "ఉ",
                "ఊ",
                "ఎ",
                "ఏ",
                "ఐ",
                "ఒ",
                "ఓ",
                "ఔ",
                "ఋ",
                "ౠ"
            ],
            Consonents: [
                "క",
                "ఖ",
                "గ",
                "ఘ",
                "ఙ",
                "చ",
                "ఛ",
                "జ",
                "ఝ",
                "ఞ",
                "ట",
                "ఠ",
                "డ",
                "ఢ",
                "ణ",
                "త",
                "థ",
                "ద",
                "ధ",
                "న",
                "ప",
                "ఫ",
                "బ",
                "భ",
                "మ",
                "య",
                "ర",
                "ల",
                "వ",
                "శ",
                "ష",
                "స",
                "హ",
                "ళ",
                "ఱ",
                "క్ష",
                "ము"
            ],
            Synonyms: {
                "ా": "ఆ",
                "ి": "ఇ",
                "ీ": "ఈ",
                "ు": "ఉ",
                "ూ": "ఊ",
                "ృ": "ఋ",
                "ౄ": "ౠ",
                "ె": "ఎ",
                "ే": "ఏ",
                "ై": "ఐ",
                "ొ": "ఒ",
                "ో": "ఓ",
                "ౌ": "ఔ"
            },
            Virama: "్"
        } as CharSet;
    }
}
export class Runner {
    public BestMove(Board: ScrabbleBoard): ProbableMove {
        var Moves = this.Probables(Board);
        if (Moves.length == 0) {
            return null;
        }
        return Moves[0];
    }
    public Probables(Board: ScrabbleBoard): ProbableMove[] {
        var Moves = [] as ProbableMove[];

        if (Board == null) {
            return;
        }

        var bot: Bot = Config2.GetBot(Board.Bot);
        if (bot == null) {
            return;
        }
        //
        var board: KnownBoard = Config2.GetBoard(Board.Name);
        if (board == null) {
            return;
        }
        //

        var CharSet = Config2.GetCharSet(bot.Language);
        //
        var size = board.Size;
        var weights = board.Weights;
        //
        var cells = Board.Cells;
        var vowels = Board.Vowels;
        var conso = Board.Conso;
        var special = Board.Special;
        var file = bot.Dictionary;

        if (CharSet == null || cells == null || weights == null || U.Util.IsNullOrEmpty(file) ||
            (U.Util.IsNullOrEmpty(vowels) && U.Util.IsNullOrEmpty(conso) && U.Util.IsNullOrEmpty(special))) {
            return Moves;
        }
        if (cells.length != size * size || weights.length != size * size) {
            return Moves;
        }

        var All = [] as string[];
        var NonCornerTiles = [] as string[];

        var AllPattern = "";
        var NonCornerPattern = "";

        var Movables = (vowels + " " + conso + " " + special);
        var MovableList = Movables.Replace("(", " ").Replace(")", " ").Replace(",", "").split(' ');

        MovableList = MovableList.filter(function (x) { return x.length != 0; });

        var SpecialList = this.DistinctList(special.Replace("(", " ").Replace(")", " ").Replace(",", ""), ' ');

        var EverySyllableOnBoard = this.GetSyllableList(cells, size, false, true);
        var NonCornerSyllables = this.GetSyllableList(cells, size, true, false);

        //
        All = (this.GetFlatList(EverySyllableOnBoard, ',') + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").split(' ');
        AllPattern = U.Util.Format("^(?<All>[{0},])*$", [this.GetFlatList2(All)]);

        //
        NonCornerTiles = (this.GetFlatList2(NonCornerSyllables) + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").split(' ');
        NonCornerPattern = U.Util.Format("^(?<All>[{0},])*$", [this.GetFlatList2(NonCornerTiles)]);

        var AllDict = this.GetCountDict(All);
        var NonCornerDict = this.GetCountDict(NonCornerTiles);

        var WordsDictionary = WordLoader.Load(file); //Large Set of Words

        WordsDictionary = this.ShortList(WordsDictionary, AllPattern, AllDict); // Probables 

        var NonCornerProbables = this.ShortList(WordsDictionary, NonCornerPattern, NonCornerDict);  //Non Corner Probables
        var SpeicalDict = this.GetSpecialDict(CharSet, SpecialList);
        if (EverySyllableOnBoard.length > 0) {
            Moves = Moves.concat(Runner.SyllableExtensions(cells, size, CharSet, WordsDictionary, NonCornerProbables, MovableList, SpeicalDict));
            Moves = Moves.concat(Runner.WordExtensions(cells, size, CharSet, WordsDictionary, MovableList, SpeicalDict));
        }
        else {
            var maxIndex: number = this.MaxWeightIndex(weights);
            Moves = Moves.concat(Runner.EmptyExtensions(cells, size, CharSet, maxIndex, WordsDictionary, MovableList, SpeicalDict));
        }

        WordsDictionary = null;
        this.RefreshScores(Moves, weights, size);
        return Moves;
    }

    static EmptyExtensions(Cells: string[], size: number, CharSet: CharSet, maxIndex: number, AllWords: Word[], Movables: string[], SpeicalDict: any): ProbableMove[] {
        var Moves = [] as ProbableMove[];
        {
            for (var indx in AllWords) {
                var word: Word = AllWords[indx];
                var Pre = "";
                var Center = "";
                var Post = "";

                var f = word.Tiles.indexOf(',');

                Center = word.Tiles.substring(0, f);
                Post = word.Tiles.substring(f + 1);

                var Pres = Pre == "" ? [] as string[] : Pre.TrimEnd(',').split(',');
                var Centers = Center.split(',');
                var Posts = Post == "" ? [] as string[] : Post.TrimStart(',').split(',');

                var Tiles = Movables.slice(0, Movables.length);
                var res = Runner.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                if (!res) {
                    continue;
                }

                var WH = Runner.TryHarizontal(Cells, size, maxIndex, 0, Pres, Centers, Posts);
                var WV = Runner.TryVertical(Cells, size, maxIndex, 0, Pres, Centers, Posts);

                var WHValid = Runner.Validate3(WH, AllWords);
                var WVValid = Runner.Validate3(WV, AllWords);

                if (WHValid) {
                    Moves.push(WH);
                }
                if (WVValid) {
                    Moves.push(WV);
                }
            }
        }
        return Moves;
    }
    static SyllableExtensions(Cells: string[], size: number, CharSet: CharSet, AllWords: Word[], Probables: Word[], Movables: string[], SpeicalDict: any): ProbableMove[] {

        var Moves = [] as ProbableMove[];
        {
            var All = Runner.GetSyllableList2(Cells, size, false, true);
            for (var indx in All) {
                var syllable = All[indx];
                var pattern = Runner.GetSyllablePattern2(CharSet, syllable.Tiles.Replace("(", "").Replace(")", ""), "(?<Center>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)");
                pattern = U.Util.Format("^{0}$", [pattern]);
                var R = new RegExp(pattern);
                {
                    for (var indx2 in Probables) {
                        var probable: Word = Probables[indx2];

                        if (!R.test(probable.Tiles)) {
                            continue;
                        }
                        var M: any = R.exec(probable.Tiles);
                        var Pre = Runner.MatchedString(M.groups["Pre"], "");
                        var Center = Runner.MatchedString(M.groups["Conso"], "");
                        var Post = Runner.MatchedString(M.groups["Post"], "");

                        var Pres = Pre == "" ? [] as string[] : Pre.TrimEnd(',').split(',');
                        var Centers = Center == "" ? [] as string[] : Center.split(',');
                        var Posts = Post == "" ? [] as string[] : Post.TrimStart(',').split(',');

                        if (!Post.StartsWith(",") && Posts.length > 0) {
                            Centers = (Center + Posts[0]).split(',');
                            Posts = Posts.slice(1);
                        }
                        var Tiles = Movables.slice(0, Movables.length);
                        var res = Runner.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                        if (!res) {
                            continue;
                        }

                        var WH = Runner.TryHarizontal(Cells, size, syllable.Index, 0, Pres, Centers, Posts);
                        var WV = Runner.TryVertical(Cells, size, syllable.Index, 0, Pres, Centers, Posts);

                        var WHValid = Runner.Validate3(WH, AllWords);
                        var WVValid = Runner.Validate3(WV, AllWords);

                        if (WHValid) {
                            Moves.push(WH);
                        }
                        if (WVValid) {
                            Moves.push(WV);
                        }
                    }
                }
            }
        }
        console.log("\t\t Moves found: " + Moves.length);
        return Moves;

    }
    static WordExtensions(Cells: string[], size: number, CharSet: CharSet, AllWords: Word[], Movables: string[], SpeicalDict: any): ProbableMove[] {
        var Moves = [] as ProbableMove[];
        {
            var WordsOnBoard = Runner.GetWordsOnBoard(Cells, size, false);
            for (var indx in WordsOnBoard) {
                var wordOnBoard: Word = WordsOnBoard[indx];
                var raw = wordOnBoard.Tiles.Replace("(", "").Replace(")", "").Replace(",", "").Replace("|", ",");

                var pattern = Runner.GenWordPattern(CharSet, wordOnBoard.Tiles, "(?<Center{0}>.*?)", "", "(?<Center{0}>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)", true);
                pattern = U.Util.Format("^{0}$", [pattern.TrimEnd('|')]);
                var R = new RegExp(pattern);
                {
                    for (var indx2 in AllWords) {
                        var word: Word = AllWords[indx2];
                        if (raw == word.Tiles) {
                            continue;
                        }

                        if (!R.test(word.Tiles)) {
                            continue;
                        }

                        var M: any = R.exec(word.Tiles);
                        var Pre = "";
                        var Post = "";
                        var Center = "";


                        Pre = Runner.MatchedString(M.groups["Pre"], "");
                        for (var i = 0; i < word.Syllables; i++) {
                            Center = Center + Runner.MatchedString(M.groups["Center" + (i + 1)], ",") + ":";
                        }
                        Center = Center.TrimEnd(':');
                        Post = Runner.MatchedString(M.groups["Post"], "");


                        var Pres = Pre == "" ? [] as string[] : Pre.TrimEnd(',').split(',');
                        var Centers = Center.split(':');
                        var Posts = Post == "" ? [] as string[] : Post.TrimStart(',').split(',');
                        var Tiles = Movables.slice(0, Movables.length);
                        var res = Runner.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                        if (!res) {
                            continue;
                        }

                        if (wordOnBoard.Position == "R") {
                            var WH = Runner.TryHarizontal(Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
                            var WHValid = Runner.Validate3(WH, AllWords);
                            if (WHValid) {
                                Moves.push(WH);
                            }
                        }
                        if (wordOnBoard.Position == "C") {
                            var WH = Runner.TryVertical(Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
                            var WHValid = Runner.Validate3(WH, AllWords);
                            if (WHValid) {
                                Moves.push(WH);
                            }
                        }
                    }
                }
            }
        }
        console.log("\t\t Moves found: " + Moves.length);
        return Moves;
    }

    static TryHarizontal(Cells: string[], size: number, Index: number, offset: number, Pre: string[], Centers: string[], Post: string[]): ProbableMove {
        var Moves: Word[] = [] as Word[];
        var PreCount = Pre.length;
        var PostCount = Post.length;
        var NewCells: string[] = Cells.Clone();
        var Impacted: number[] = [] as number[];

        if (Pre.length != 0) {
            for (var x = Pre.length - 1; x >= 0; x--) {
                var n = BoardUtil.FindNeighbors(Index - x, size);
                if (n.Left != -1) {
                    NewCells[n.Left] += Pre[x];
                    Impacted.push(n.Left);
                    Moves.push({ Tiles: Pre[x], Index: n.Left } as Word);
                }
                else {
                    return { Words: [] as ProbableWord[], Direction: "H", WordsCount: 0, Moves: [] as Word[] } as ProbableMove;
                }
            }
        }

        if (Centers.length != 0) {
            for (var c = 0; c < Centers.length; c++) {
                var cellIndex = Index + c;
                if (cellIndex == -1 || Centers[c] == "") {
                    continue;
                }

                NewCells[cellIndex] += Centers[c];
                Impacted.push(cellIndex);
                Moves.push({ Tiles: Centers[c], Index: cellIndex } as Word);
            }
        }

        if (Post.length != 0) {
            for (var x = 0; x < Post.length; x++) {
                var n = BoardUtil.FindNeighbors(Index + offset + x, size);
                if (n.Right != -1) {
                    NewCells[n.Right] += Post[x];
                    Impacted.push(n.Right);
                    Moves.push({ Tiles: Post[x], Index: n.Right } as Word);
                }
                else {
                    return { Words: [] as ProbableWord[], Direction: "H", WordsCount: 0, Moves: [] as Word[] } as ProbableMove;
                }
            }
        }

        var W = [] as ProbableWord[];
        for (var i in Impacted) {
            var index = Impacted[i];
            W = W.concat(Runner.WordsAt(NewCells, size, index));
        }
        return { Words: W, Moves: Moves, WordsCount: W.length, Direction: "H" } as ProbableMove;
    }
    static TryVertical(Cells: string[], size: number, Index: number, offset: number, Pre: string[], Centers: string[], Post: string[]): ProbableMove {
        var Moves = [] as Word[];
        var PreCount = Pre.length;
        var PostCount = Post.length;
        var Pos: Point = BoardUtil.Position(Index, size);
        var NewCells = Cells.Clone();
        var Impacted = [] as number[];

        if (Pre.length != 0) {
            for (var x = Pre.length - 1; x >= 0; x--) {
                var cellIndex = BoardUtil.Abs(Pos.X - x, Pos.Y, size);
                var n = BoardUtil.FindNeighbors(cellIndex, size);
                if (n.Top != -1) {
                    NewCells[n.Top] += Pre[x];
                    Impacted.push(n.Top);
                    Moves.push({ Tiles: Pre[x], Index: n.Top } as Word);
                }
                else {
                    return { Words: [] as ProbableWord[], Direction: "V", WordsCount: 0, Moves: [] as Word[] } as ProbableMove;
                }
            }
        }

        if (Centers.length != 0) {
            for (var c = 0; c < Centers.length; c++) {
                var cellIndex = BoardUtil.Abs(Pos.X + c, Pos.Y, size);
                if (cellIndex == -1 || Centers[c] == "") {
                    continue;
                }
                NewCells[cellIndex] += Centers[c];
                Impacted.push(cellIndex);
                Moves.push({ Tiles: Centers[c], Index: cellIndex } as Word);
            }
        }

        if (Post.length != 0) {
            for (var x = 0; x < Post.length; x++) {
                var cellIndex = BoardUtil.Abs(Pos.X + offset + x, Pos.Y, size);
                var n = BoardUtil.FindNeighbors(cellIndex, size);
                if (n.Bottom != -1) {
                    NewCells[n.Bottom] += Post[x];
                    Impacted.push(n.Bottom);
                    Moves.push({ Tiles: Post[x], Index: n.Bottom } as Word);
                }
                else {
                    return { Words: [] as ProbableWord[], Direction: "V", WordsCount: 0, Moves: [] as Word[] } as ProbableMove;
                }
            }
        }

        var W: ProbableWord[] = [] as ProbableWord[];
        for (var i in Impacted) {
            var index = Impacted[i];
            W = W.concat(Runner.WordsAt(NewCells, size, index));
        }
        return { Words: W, Moves: Moves, WordsCount: W.length, Direction: "V" } as ProbableMove;
    }

    RefreshScores(Moves: ProbableMove[], Weights: number[], size: number): void {
        for (var indx in Moves) {
            var Move = Moves[indx];
            var score: number = 0;
            for (var indx2 in Move.Words) {
                var w = Move.Words[indx2];
                var wordScore = 0;
                for (var indx3 in w.Cells) {
                    var cell = w.Cells[indx3];
                    var weight = Weights[cell.Index];
                    wordScore = wordScore + weight;
                    cell.Score = weight;
                }
                w.Score = wordScore;
                score = score + wordScore;
            }
            Move.Score = score;
        }
        Moves.sort(function (x: ProbableMove, y: ProbableMove) { return x.Score - y.Score; });
        Moves.reverse();
    }

    ShortList(Words: Word[], NonCornerPattern: string, Dict: any): Word[] {
        if (U.Util.IsNullOrEmpty(NonCornerPattern)) {
            return [] as Word[];
        }

        var R = RegExp(NonCornerPattern);

        var Matches = this.MatchedWords(Words, NonCornerPattern);
        var Shortlisted = [] as Word[];
        {
            for (var indx in Matches) {
                var word: Word = Matches[indx];
                if (word.Syllables == 1) {
                    continue;
                }

                var CharCount = this.GetCountDict2(word.Tiles);
                var isValid = this.Validate(Dict, CharCount);
                if (!isValid) {
                    continue;
                }

                Shortlisted.push(word);
            }
            console.log("\t\t\t Shortlisted: " + Shortlisted.length + "  of " + Matches.length);
        }
        return Shortlisted;
    }

    static Validate3(WV: ProbableMove, AllWords: Word[]): boolean {
        WV.Words = ProbableWordComparer.Distinct(WV.Words);
        WV.WordsCount = WV.Words.length;
        if (WV.Words.length == 0 || WV.Moves.length == 0) {
            return false;
        }
        return Runner.Validate2(WV.Words, AllWords);
    }
    static Validate2(WV: ProbableWord[], AllWords: Word[]): boolean {
        for (var indx in WV) {
            var w: ProbableWord = WV[indx];
            var v = AllWords.filter(function (x: Word) { return x.Tiles == w.String });
            if (v == null || v.length == 0) {
                return false;
            }
        }
        return true;
    }
    Validate(InputDict: any, CharCount: any): boolean {
        if (InputDict == null) {
            return true;
        }
        var isValid = true;
        for (var key in CharCount) {
            var item = CharCount[key];
            if (InputDict[key] == null) {
                isValid = false;
                break;
            }
            if (InputDict[item.Key] < item.Value) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }

    static Resolve2(prev: string, Tiles: string[], SpeicalList: any): any {
        if (U.Util.IsNullOrEmpty(prev)) {
            return { res: true, temp: "" };
        }
        if (prev.length == 1) {
            if (Tiles.Contains(prev)) {
                Tiles.Remove(prev);
                return { res: true, temp: prev };
            }
            else {
                return { res: false, temp: prev }; //Can't be Reoslved for Sure.
            }
        }
        else {
            if (SpeicalList.hasOwnProperty(prev)) {
                if (Tiles.Contains(prev)) {
                    Tiles.Remove(prev);
                    return { res: true, temp: prev };
                }
                //More checks needed
            }

            //region Is a Set of Specials
            for (var key in SpeicalList) {
                var special = SpeicalList[key];
                if (!special.test(prev)) {
                    continue;
                }

                if (Tiles.Contains(key)) {
                    Tiles.Remove(key);
                }
                else {
                    continue;
                }
                var order = [] as string[];

                var M = special.exec(prev);
                var Pre = M.groups["Pre"];
                var Center = M.groups["Center"];
                var Post = M.groups["Post"];

                if (!U.Util.IsNullOrEmpty(Pre)) {
                    var temp = "";
                    var resolved = Runner.Resolve2(Pre, Tiles, SpeicalList);
                    if (!resolved.res) {
                        return { res: false, temp: Pre };
                    }
                    temp = resolved.temp;
                    order.push(U.Util.IsNullOrEmpty(temp) ? Pre : temp);
                }
                order.push(special.Key);

                if (!U.Util.IsNullOrEmpty(Center)) {
                    var temp = "";
                    var resolved = Runner.Resolve2(Center, Tiles, SpeicalList);
                    if (!resolved.res) {
                        return { res: false, temp: Center };
                    }
                    order.push(U.Util.IsNullOrEmpty(temp) ? Center : temp);
                }

                if (!U.Util.IsNullOrEmpty(Post)) {
                    var temp = "";
                    var resolved = Runner.Resolve2(Post, Tiles, SpeicalList);
                    if (!resolved) {
                        return { res: false, temp: "" };
                    }
                    order.push(U.Util.IsNullOrEmpty(temp) ? Post : temp);
                }
                return { res: true, temp: order.join(',') };
            }
            //Now Every Char must be resovled.
            {
                var order = [] as string[];
                for (var i: number = 0; i < prev.length; i++) {
                    var c = prev[i];
                    if (Tiles.Contains(c)) {
                        Tiles.Remove(c);
                        order.push(c);
                    }
                    else {
                        return { res: false, temp: c }; //Can't be Reoslved for Sure.
                    }
                }
                return { res: true, temp: order.join(',') };
            }
        }
    }
    static Resolve(Pres: string[], Centers: string[], Posts: string[], Tiles: string[], SpeicalDict: any): boolean {
        var res: boolean = true;
        for (var i = 0; i < Pres.length; i++) {
            var tile = Pres[i];
            var result = Runner.Resolve2(tile, Tiles, SpeicalDict);
            if (!result.res) {
                return false;
            }
            var temp = result.temp;
            if (!U.Util.IsNullOrEmpty(temp)) {
                Pres[i] = temp;
            }
        }
        for (var i = 0; i < Centers.length; i++) {
            var tile = Centers[i];
            var result = Runner.Resolve2(tile, Tiles, SpeicalDict);
            if (!result.res) {
                return false;
            }
            var temp = result.temp;
            if (!U.Util.IsNullOrEmpty(temp)) {
                Centers[i] = temp;
            }
        }
        for (var i = 0; i < Posts.length; i++) {
            var tile = Posts[i];
            var result = Runner.Resolve2(tile, Tiles, SpeicalDict);
            if (!result.res) {
                return false;
            }
            var temp = result.temp;
            if (!U.Util.IsNullOrEmpty(temp)) {
                Posts[i] = temp;
            }
        }
        return true;
    }

    MatchedWords(words: Word[], Pattern: string): Word[] {
        var r = RegExp(Pattern);
        var List = words.filter(function (s: Word) { return r.test(s.Tiles); });
        console.log("\t\t\t" + List.length + " of " + words.length + " found: " + Pattern);
        return List;

    }
    static MatchedString(group: any, seperator: string): string {
        if (group == null) {
            return "";
        }
        var ret: string = "";
        for (var indx in group) {
            var capture = group[indx];
            ret = ret + capture + seperator;
        }
        if (!U.Util.IsNullOrEmpty(seperator)) {
            ret = ret.TrimEnd(seperator);
        }
        return ret;
    }

    static GetWordsOnBoard(Cells: string[], size: number, includeDuplicates: boolean): Word[] {
        var Words: Word[] = [] as Word[];
        for (var i = 0; i < size; i++) {
            var R = Runner.GetWords(Cells, "R", i, size, includeDuplicates);
            var C = Runner.GetWords(Cells, "C", i, size, includeDuplicates);
            Words = Words.concat(R);
            Words = Words.concat(C);
        }
        return Words;
    }
    static GetWords(Cells: string[], option: string, r: number, size: number, includeDuplicates: boolean): Word[] {
        var Words: Word[] = [] as Word[];
        var pending = "";
        var cnt = 0;
        for (var i = 0; i < size; i++) {
            var index = -1;
            switch (option) {
                case "R":
                    index = BoardUtil.Abs(r, i, size);
                    break;
                case "C":
                    index = BoardUtil.Abs(i, r, size);
                    break;
            }
            var cell = Cells[index];
            if (cell != "") {
                pending += "(" + cell + ")|";
                cnt++;
                continue;
            }
            if (pending != "" && cell == "") {
                if (cnt > 1) {
                    var word = pending.TrimEnd('|');
                    if (includeDuplicates) {
                        var startIndex: number = Runner.GetStartIndex(option, r, i, size, cnt);
                        Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex } as Word);
                    }
                    else {
                        var X: Word[] = Words.filter(x => x.Tiles == word);
                        if (X == null || X.length == 0) {
                            var startIndex: number = Runner.GetStartIndex(option, r, i, size, cnt);
                            Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex } as Word);
                        }
                    }
                }
                pending = "";
                cnt = 0;
                continue;
            }
        }
        if (cnt > 1) {
            var word = pending.TrimEnd('|');
            if (includeDuplicates) {
                var startIndex = Runner.GetStartIndex(option, r, size, size, cnt);
                Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex } as Word);
            }
            else {
                var X: Word[] = Words.filter(x => x.Tiles == word);
                if (X == null || X.length == 0) {
                    var startIndex = Runner.GetStartIndex(option, r, size, size, cnt);
                    Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex } as Word);
                }
            }
        }
        return Words;
    }
    static WordsAt(Cells: string[], size: number, index: number): ProbableWord[] {
        var List: ProbableWord[] = [] as ProbableWord[];
        var Neighbor: Neighbor = BoardUtil.FindNeighbors(index, size);

        var r = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
        var l = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
        var t = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
        var b = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";

        var Lefties: Word[] = [] as Word[];
        var Righties: Word[] = [] as Word[];

        if (r != "") {
            //Move Right..
            Righties.push({ Tiles: r, Index: Neighbor.Right } as Word);
            var index_: number = Neighbor.Right;
            var flg: boolean = true;
            while (flg) {
                var n = BoardUtil.FindNeighbors(index_, size);
                var r_ = n.Right != -1 ? Cells[n.Right] : "";
                if (r_ == "") {
                    flg = false;
                    break;
                }
                Righties.push({ Tiles: r_, Index: n.Right } as Word);
                index_ = n.Right;
            }
        }
        if (l != "") {
            //Move Left..
            Lefties.push({ Tiles: l, Index: Neighbor.Left } as Word);

            var index_ = Neighbor.Left;
            var flg: boolean = true;
            while (flg) {
                var n: Neighbor = BoardUtil.FindNeighbors(index_, size);
                var l_ = n.Left != -1 ? Cells[n.Left] : "";
                if (l_ == "") {
                    flg = false;
                    break;
                }
                Lefties.push({ Tiles: l_, Index: n.Left } as Word);
                index_ = n.Left;
            }
        }

        var Topies: Word[] = [] as Word[];
        var Downies: Word[] = [] as Word[];

        if (t != "") {
            //Move Top..
            Topies.push({ Tiles: t, Index: Neighbor.Top } as Word);
            var index_ = Neighbor.Top;
            var flg = true;
            while (flg) {
                var n = BoardUtil.FindNeighbors(index_, size);
                var t_: string = n.Top != -1 ? Cells[n.Top] : "";
                if (t_ == "") {
                    flg = false;
                    break;
                }
                Topies.push({ Tiles: t_, Index: n.Top } as Word);
                index_ = n.Top;
            }
        }

        if (b != "") {
            //Move Bottom..
            Downies.push({ Tiles: b, Index: Neighbor.Bottom } as Word);
            var index_ = Neighbor.Bottom;
            var flg = true;
            while (flg) {
                var n = BoardUtil.FindNeighbors(index_, size);
                var d_ = n.Bottom != -1 ? Cells[n.Bottom] : "";
                if (d_ == "") {
                    flg = false;
                    break;
                }
                Downies.push({ Tiles: d_, Index: n.Bottom } as Word);
                index_ = n.Bottom;
            }
        }

        Topies.reverse();
        Lefties.reverse();

        if (Topies.length + Downies.length > 0) {
            var Vertical = Runner.MakeAWord(Topies, { Tiles: Cells[index], Index: index } as Word, Downies);
            List.push(Vertical);
        }
        if (Lefties.length + Righties.length > 0) {
            var Harizontal = Runner.MakeAWord(Lefties, { Tiles: Cells[index], Index: index } as Word, Righties);
            List.push(Harizontal);
        }
        return List;
    }
    static MakeAWord(F1: Word[], C: Word, F2: Word[]): ProbableWord {
        var W = {} as ProbableWord;
        var List: TargetCell[] = [] as TargetCell[];
        var ret: string = "";
        for (var indx in F1) {
            var s = F1[indx];
            ret = ret + s.Tiles.Replace(",", "") + ",";
            var Cell: TargetCell = { Target: s.Tiles, Index: s.Index } as TargetCell;
            List.push(Cell);
        }
        {
            ret = ret + C.Tiles.Replace(",", "") + ",";
            var Cell: TargetCell = { Target: C.Tiles, Index: C.Index } as TargetCell;
            List.push(Cell);
        }
        for (var indx in F2) {
            var s = F2[indx];
            ret = ret + s.Tiles.Replace(",", "") + ",";
            var Cell: TargetCell = { Target: s.Tiles, Index: s.Index } as TargetCell;
            List.push(Cell);
        }
        ret = ret.Trim(',');
        W.String = ret;
        W.Cells = List;
        return W;
    }
    static GetStartIndex(option: string, r: number, pos: number, size: number, move: number): number {
        switch (option) {
            case "R":
                return BoardUtil.Abs(r, pos - move, size);

            case "C":
                return BoardUtil.Abs(pos - move, r, size);

        }
        return -1;
    }

    static GetSyllableList2(Cells: string[], size: number, filter: boolean, free: boolean): Word[] {
        var List: Word[] = [] as Word[];
        for (var index: number = 0; index < Cells.length; index++) {
            var cell: string = Cells[index];
            if (cell == "") {
                continue;
            }
            var Neighbor = BoardUtil.FindNeighbors(index, size);

            var r = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
            var l = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
            var t = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
            var b = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";

            if (filter) {
                if ((r != "" || l != "") && (t != "" || b != "")) {
                }
                else {
                    var x = free ? cell : "(" + cell + ")";
                    List.push({ Tiles: x, Index: index } as Word);
                }
            }
            else {
                var x = free ? cell : "(" + cell + ")";
                List.push({ Tiles: x, Index: index } as Word);
            }
        }
        return List;
    }
    GetSyllableList(Cells: string[], size: number, filterEdges: boolean, asGroups: boolean): string[] {
        var List: string[] = [] as string[];
        for (var index = 0; index < Cells.length; index++) {
            var cell: string = Cells[index];
            if (cell == "") {
                continue;
            }
            var Neighbor: Neighbor = BoardUtil.FindNeighbors(index, size);

            var r: string = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
            var l: string = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
            var t: string = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
            var b: string = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";

            if (filterEdges) {
                if ((r != "" || l != "") && (t != "" || b != "")) {

                }
                else {
                    var x: string = asGroups ? cell : "(" + cell + ")";
                    if (!List.Contains(x)) {
                        List.push(x);
                    }
                }
            }
            else {
                var x: string = asGroups ? cell : "(" + cell + ")";
                if (!List.Contains(x)) {
                    List.push(x);
                }
            }
        }
        return List;
    }
    static GetSpecialSyllablePattern2(CharSet: CharSet, specialOptions: string): string {
        if (U.Util.IsNullOrEmpty(specialOptions)) {
            return "";
        }

        var ret: string = "";
        {
            var temp: string = "";

            var Consos: string[] = [] as string[];
            var Vowels: string[] = [] as string[];
            Runner.Classify2(CharSet, specialOptions, Consos, Vowels);

            if (Vowels.length > 0 && Consos.length > 0) {
                //Both Exists
                //(మ[ConsoOptions]ఉ)
                for (var indx in Consos) {
                    var a: string = Consos[indx];
                    temp = temp + a;
                }
                temp = temp + "(?<Center>.*?)";
                for (var indx in Vowels) {
                    var a: string = Vowels[indx];
                    temp = temp + a;
                }
                temp = "(?<Pre>.*?)" + temp + "(?<Post>.*?)";
            }
            else {
                //Both Exists
                //(కష)
                for (var indx in Consos) {
                    var a: string = Consos[indx];
                    temp = temp + a;
                }
                for (var indx in Vowels) {
                    var a: string = Vowels[indx];
                    temp = temp + a;
                }
                temp = "(?<Pre>.*?)" + temp + "(?<Post>.*?)";
            }
            ret = "^" + temp + "$";
        }
        return ret;
    }
    static GetSyllablePattern(CharSet: CharSet, syllable: string, consoPatternNoComma: string, sunnaPattern: string, allPatternNoComma: string): string {
        var temp: string = "";
        var Consos: string[] = [] as string[];
        var Vowels: string[] = [] as string[];
        Runner.Classify(CharSet, syllable, Consos, Vowels);

        if (Vowels.length > 0 && Consos.length > 0) {
            // H-V:
            //       H1 ConsoPatternNoComma V1 AllPattern
            var tempC: string = "";
            for (var indx in Consos) {
                var a = Consos[indx];
                tempC = tempC + a;
            }

            var tempA: string = "";
            for (var indx in Vowels) {
                var a = Vowels[indx];
                tempA = tempA + a;
            }
            ////కష(ConsoNoComma)ఇ(Sunna)
            temp = U.Util.Format("{0}{1}{2}{3}", [tempC, consoPatternNoComma, tempA, sunnaPattern]);
        }
        else {
            for (var indx in Consos) {
                var a = Consos[indx];
                temp = temp + a;
            }
            if (Vowels.length == 0) {
                //కష(AllNoComma)
                temp = U.Util.Format("{0}{1}", [temp, allPatternNoComma == "" ? "" : (allPatternNoComma)]);
            }

            for (var indx in Vowels) {
                var a = Vowels[indx];
                temp = temp + a;
            }

            if (Consos.length == 0) {
                //అ(Sunna)
                temp = U.Util.Format("{0}{1}", [temp, sunnaPattern]);
            }

            if (Vowels.length == 0 && Consos.length == 0) {
                debugger;
            }

        }
        return temp;
    }
    static GetSyllablePattern2(CharSet: CharSet, syllable: string, consoPatternNoComma: string, prePattern: string, PostPattern: string): string {
        var temp: string = "";
        var Consos: string[] = [] as string[];
        var Vowels: string[] = [] as string[];
        Runner.Classify(CharSet, syllable, Consos, Vowels);

        if (Vowels.length > 0 && Consos.length > 0) {
            // H-V:
            //       AllPattern H1 ConsoPatternNoComma V1 AllPattern
            var tempC: string = "";
            for (var indx in Consos) {
                var a: string = Consos[indx];
                tempC = tempC + a;
            }

            var tempA: string = "";
            for (var indx in Vowels) {
                var a: string = Vowels[indx];
                tempA = tempA + a;
            }
            temp = U.Util.Format("({3}({0}{1}{2}){4})", [tempC, consoPatternNoComma, tempA, prePattern, PostPattern]);
        }
        else {
            // Accu or Hallu:
            //      AllPattern Accu AllPattern
            for (var indx in Consos) {
                var a: string = Consos[indx];
                temp = temp + a;
            }
            for (var indx in Vowels) {
                var a: string = Vowels[indx];
                temp = temp + a;
            }
            temp = U.Util.Format("({1}{0}{2})", [temp, prePattern, PostPattern]);
        }
        return temp;
    }

    static Join(str: string, join: string): string {
        var ret: string = "";
        for (var indx = 0; indx < str.length; indx++) {
            var ch: string = str[indx];
            ret = ret + ch + join;
        }
        ret = ret.TrimEnd(join);
        return ret;
    }

    GetFlatList2(inputs: string[]): string {
        var list = inputs.Clone();
        list.sort();

        var X: string[] = [] as string[];
        for (var indx in list) {
            var input: string = list[indx];
            if (!X.Contains(input)) {
                X.push(input);
            }
        }

        return this.GetFlatList(X, ' ').Replace(" ", "");
    }
    GetFlatList(List: string[], Seperator: string): string {
        var ret = "";
        for (var indx in List) {
            var s: string = List[indx];
            ret = ret + s + Seperator;
        }
        ret = ret.TrimEnd(Seperator);
        return ret;
    }
    GetFlatList3(List: Word[], Seperator: string): string {
        var ret: string = "";
        for (var indx in List) {
            var s: Word = List[indx];
            ret = ret + s.Tiles + Seperator;
        }
        ret = ret.TrimEnd(Seperator);
        return ret;
    }

    DistinctList(Set: string, Seperator: string): string[] {
        var List = [] as string[];
        var arr: string[] = Set.split(Seperator);
        for (var indx in arr) {
            var s: string = arr[indx];
            if (U.Util.IsNullOrEmpty(s)) {
                continue;
            }
            if (!List.Contains(s)) {
                List.push(s);
            }
        }
        return List;
    }
    GetCountDict2(input: string): any {
        var Dict = {} as any;
        var arr: string[] = input.split(',');
        for (var indx in arr) {
            var s = arr[indx];
            for (var indx2 = 0; indx2 < s.length; indx2++) {
                var c = s[indx2];
                if (Dict.hasOwnProperty(c)) {
                    Dict[c]++;
                }
                else {
                    Dict[c] = 1;
                }
            }
        }
        return Dict;
    }
    GetCountDict(inputs: string[]): any {
        if (inputs == null) {
            return null;
        }
        var Dict: any = {};
        for (var indx in inputs) {
            var input: string = inputs[indx];
            if (U.Util.IsNullOrEmpty(input)) {
                continue;
            }
            if (Dict.hasOwnProperty(input)) {
                Dict[input]++;
            }
            else {
                Dict[input] = 1;
            }
        }
        return Dict;
    }

    static Classify(CharSet: CharSet, syllable: string, Consos: string[], Vowels: string[]): void {
        var Sunna = [] as string[];
        var arr = syllable.split(',');
        for (var indx in arr) {
            var c = arr[indx];
            if (CharSet.SunnaSet.Contains(c)) {
                Sunna.push(c);
            }
            else {
                if (CharSet.Vowels.Contains(c)) {
                    Vowels.push(c);
                }
                else if (CharSet.Consonents.Contains(c)) {
                    Consos.push(c);
                }
                else {
                    debugger;
                }
            }
        }
        Vowels = Vowels.concat(Sunna);
    }
    static Classify2(CharSet: CharSet, syllable: string, Consos: string[], Vowels: string[]): void {
        var Sunna = [] as string[];
        for (var indx = 0; indx < syllable.length; indx++) {
            var c = syllable[indx];
            if (CharSet.SunnaSet.Contains(c)) {
                Sunna.push(c);
            }
            else {
                if (CharSet.Vowels.Contains(c)) {
                    Vowels.push(c);
                }
                else if (CharSet.Consonents.Contains(c)) {
                    Consos.push(c);
                }
                else {
                    debugger;
                }
            }
        }
        Vowels = Vowels.concat(Sunna);
    }

    static GenWordPattern(CharSet: CharSet, word: string, consoPatternNoComma: string, sunnaPattern: string, allPatternNoComma: string, prePattern: string, postPattern: string, useSyllableIndex: boolean): string {
        var temp: string = "";
        var arr = word.split('|');
        for (var i = 0; i < arr.length; i++) {
            var syllable: string = arr[i];
            var pattern: String = "";
            if (useSyllableIndex) {
                pattern = Runner.GetSyllablePattern(CharSet,
                    syllable.Replace("(", "").Replace(")", ""),
                    U.Util.Format(consoPatternNoComma, [i + 1]),
                    U.Util.Format(sunnaPattern, [i + 1]),
                    i == arr.length - 1 ? "" : U.Util.Format(allPatternNoComma, [i + 1]));
            }
            else {
                pattern = Runner.GetSyllablePattern(CharSet,
                    syllable.Replace("(", "").Replace(")", ""),
                    consoPatternNoComma,
                    sunnaPattern,
                    i == arr.length - 1 ? "" : allPatternNoComma);
            }
            temp = temp + pattern + ",";
        }
        temp = temp.TrimEnd(',');
        temp = prePattern + temp + postPattern;
        temp = U.Util.Format("({0})|", [temp]);
        return temp;
    }

    GetSpecialDict(CharSet: CharSet, SpecialList: string[]): any {
        var SpeicalDict = {} as any;
        for (var indx in SpecialList) {
            var sp = SpecialList[indx];
            var pattern: string = Runner.GetSpecialSyllablePattern2(CharSet, sp);
            SpeicalDict[sp] = new RegExp(pattern);
        }
        return SpeicalDict;
    }
    MaxWeightIndex(Weights: number[]): number {
        var maxIndex = 0;
        var maxVal = 0;
        var index = 0;
        for (var indx in Weights) {
            var weight = Weights[index];
            if (weight > maxVal) {
                maxVal = weight;
                maxIndex = index;
            }
            index++;
        }
        return maxIndex;
    }
}
//export class RunerTest {
//    static Go(): void {

//        var Board =
//            {
//                Bot: "eenadu",
//                Reference: "281",
//                Name: "11x11",
//                Cells: [
//                    "",    "",    "",    "",    "",    "",    "","",    "",    "",    "",   
//                    "",    "",    "",    "",    "",    "",    "","",    "",    "",    "",   
//                    "",    "",    "",    "",    "",    "",    "","",    "శ",    "",    "",   
//                    "",    "",    "",    "",    "",    "",    "", "క","స,ఇ",    "",    "",   
//                    "",    "",    "",    "",    "",    "",    "గ","క",    "",    "",    "",   
//                    "",    "",    "",    "",    "",    "శ",   "బ","శ",    "",    "",    "",   
//                    "",    "",    "",    "",    "చ,ఆ","వ,ఇ","",    "",    "",    "",    "",   
//                    "",    "",    "",    "",    "ల",   "",   "",    "",    "",    "",    "",   
//                    "",    "",    "",    "",    "",    "",    "",    "",    "",    "",    "",   
//                    "",    "",    "",    "",    "",    "",    "",    "",    "",    "",    "",   
//                    "",    "",    "",    "",    "",    "",    "",    "",    "",    "",    "",   
//                ],
//                Conso: "క ఙ చ జ ప ల స",
//                Special: "(ల,ఉ) ",
//                Vowels: "అ ఆ ఈ ఉ ఉ ఎ ఏ ఓ"
//            } as ScrabbleBoard;
//        AskBot.BotMoveClient(Board);
//    }
//}