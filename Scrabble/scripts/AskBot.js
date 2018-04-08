define(["require", "exports", 'axios', 'GameLoader', 'Contracts', 'Util'], function (require, exports, axios, GameLoader, Contracts, U) {
    "use strict";
    var AskBot = (function () {
        function AskBot() {
        }
        AskBot.NextMove = function () {
            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.BotMove,
                args: {}
            });
        };
        AskBot.BotMove = function (post) {
            AskBot.BotMoveClient(post);
        };
        AskBot.BotMoveServer = function (post) {
            axios
                .post("/API.ashx?nextmove", post)
                .then(function (response) {
                GameLoader.GameLoader.store.dispatch({
                    type: Contracts.Actions.BotMoveResponse,
                    args: response.data
                });
            })
                .catch(function (error) { });
            AskBot.BotMoveClient(post);
        };
        AskBot.BotMoveClient = function (post) {
            setTimeout(function () {
                var st = performance.now();
                var move = new Runner().BestMove(post);
                var effort = U.Util.ElapsedTime(performance.now() - st);
                var response = {
                    Action: "nextmove",
                    Result: move,
                    Effort: effort
                };
                GameLoader.GameLoader.store.dispatch({
                    type: Contracts.Actions.BotMoveResponse,
                    args: response
                });
            }, 10);
        };
        return AskBot;
    }());
    exports.AskBot = AskBot;
    var BoardUtil = (function () {
        function BoardUtil() {
        }
        BoardUtil.FindNeighbors = function (index, size) {
            var arr = { Right: -1, Left: -1, Top: -1, Bottom: -1 };
            var pos = BoardUtil.Position(index, size);
            var bottom = BoardUtil.Abs(pos.X + 1, pos.Y, size);
            var top = BoardUtil.Abs(pos.X - 1, pos.Y, size);
            var left = BoardUtil.Abs(pos.X, pos.Y - 1, size);
            var right = BoardUtil.Abs(pos.X, pos.Y + 1, size);
            arr = { Right: right, Left: left, Top: top, Bottom: bottom };
            return arr;
        };
        BoardUtil.Position = function (N, size) {
            var X = Math.floor(N / size);
            var Y = (N % size);
            return { X: X, Y: Y };
        };
        BoardUtil.Abs = function (X, Y, size) {
            var min = 0;
            var max = size - 1;
            if ((X < min || X > max) || (Y < min || Y > max)) {
                return -1;
            }
            return (size * (X + 1)) + Y - size;
        };
        return BoardUtil;
    }());
    exports.BoardUtil = BoardUtil;
    var WordLoader = (function () {
        function WordLoader() {
        }
        WordLoader.LoadWords = function (file) {
            if (WordLoader.List != null) {
                return WordLoader.List;
            }
            WordLoader.List = [];
            var cnt = 0;
            for (var indx in BigDict) {
                var line = BigDict[indx];
                WordLoader.List.push({
                    Tiles: line,
                    Index: cnt++,
                    Syllables: line.split(',').length,
                });
            }
            BigDict = [];
            return WordLoader.List;
        };
        WordLoader.Load = function (file) {
            return WordLoader.LoadWords(file);
        };
        WordLoader.List = null;
        return WordLoader;
    }());
    exports.WordLoader = WordLoader;
    var ProbableWordComparer = (function () {
        function ProbableWordComparer() {
        }
        ProbableWordComparer.Distinct = function (_Words) {
            var Words = [];
            for (var indx in _Words) {
                if (ProbableWordComparer.Contains(Words, _Words[indx])) {
                    continue;
                }
                Words.push(_Words[indx]);
            }
            return Words;
        };
        ProbableWordComparer.Equals = function (x, y) {
            if (x.Cells.length != y.Cells.length) {
                return false;
            }
            for (var i = 0; i < x.Cells.length; i++) {
                if (x.Cells[i].Index != y.Cells[i].Index) {
                    return false;
                }
                if (x.Cells[i].Target != y.Cells[i].Target) {
                    return false;
                }
            }
            return true;
        };
        ProbableWordComparer.Contains = function (Words, Word) {
            for (var indx in Words) {
                if (ProbableWordComparer.Equals(Words[indx], Word)) {
                    return true;
                }
            }
            return false;
        };
        return ProbableWordComparer;
    }());
    exports.ProbableWordComparer = ProbableWordComparer;
    var Config2 = (function () {
        function Config2() {
        }
        Config2.GetBot = function (bot) {
            return {
                Id: "eenadu",
                Name: "ఈనాడు",
                Language: "te",
                Dictionary: "www.eenadu.net.scrabble"
            };
        };
        Config2.GetBoard = function (name) {
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
            };
        };
        Config2.GetCharSet = function (lang) {
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
            };
        };
        return Config2;
    }());
    exports.Config2 = Config2;
    var Runner = (function () {
        function Runner() {
        }
        Runner.prototype.BestMove = function (Board) {
            console.log(Board);
            debugger;
            var Moves = this.Probables(Board);
            if (Moves.length == 0) {
                return null;
            }
            return Moves[0];
        };
        Runner.prototype.Probables = function (Board) {
            var Moves = [];
            if (Board == null) {
                return;
            }
            var bot = Config2.GetBot(Board.Bot);
            if (bot == null) {
                return;
            }
            var board = Config2.GetBoard(Board.Name);
            if (board == null) {
                return;
            }
            var CharSet = Config2.GetCharSet(bot.Language);
            var size = board.Size;
            var weights = board.Weights;
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
            var All = [];
            var NonCornerTiles = [];
            var AllPattern = "";
            var NonCornerPattern = "";
            var Movables = (vowels + " " + conso + " " + special);
            var MovableList = Movables.Replace("(", " ").Replace(")", " ").Replace(",", "").split(' ');
            MovableList = MovableList.filter(function (x) { return x.length != 0; });
            var SpecialList = this.DistinctList(special.Replace("(", " ").Replace(")", " ").Replace(",", ""), ' ');
            var EverySyllableOnBoard = this.GetSyllableList(cells, size, false, true);
            var NonCornerSyllables = this.GetSyllableList(cells, size, true, false);
            All = (this.GetFlatList(EverySyllableOnBoard, ',') + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").split(' ');
            AllPattern = U.Util.Format("^(?<All>[{0},])*$", [this.GetFlatList2(All)]);
            NonCornerTiles = (this.GetFlatList2(NonCornerSyllables) + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").split(' ');
            NonCornerPattern = U.Util.Format("^(?<All>[{0},])*$", [this.GetFlatList2(NonCornerTiles)]);
            var AllDict = this.GetCountDict(All);
            var NonCornerDict = this.GetCountDict(NonCornerTiles);
            var WordsDictionary = WordLoader.Load(file);
            WordsDictionary = this.ShortList(WordsDictionary, AllPattern, AllDict);
            var NonCornerProbables = this.ShortList(WordsDictionary, NonCornerPattern, NonCornerDict);
            var SpeicalDict = this.GetSpecialDict(CharSet, SpecialList);
            if (EverySyllableOnBoard.length > 0) {
                Moves = Moves.concat(Runner.SyllableExtensions(cells, size, CharSet, WordsDictionary, NonCornerProbables, MovableList, SpeicalDict));
                Moves = Moves.concat(Runner.WordExtensions(cells, size, CharSet, WordsDictionary, MovableList, SpeicalDict));
            }
            else {
                var maxIndex = this.MaxWeightIndex(weights);
                Moves = Moves.concat(Runner.EmptyExtensions(cells, size, CharSet, maxIndex, WordsDictionary, MovableList, SpeicalDict));
            }
            WordsDictionary = null;
            this.RefreshScores(Moves, weights, size);
            return Moves;
        };
        Runner.EmptyExtensions = function (Cells, size, CharSet, maxIndex, AllWords, Movables, SpeicalDict) {
            var Moves = [];
            {
                for (var indx in AllWords) {
                    var word = AllWords[indx];
                    var Pre = "";
                    var Center = "";
                    var Post = "";
                    var f = word.Tiles.indexOf(',');
                    Center = word.Tiles.substring(0, f);
                    Post = word.Tiles.substring(f + 1);
                    var Pres = Pre == "" ? [] : Pre.TrimEnd(',').split(',');
                    var Centers = Center.split(',');
                    var Posts = Post == "" ? [] : Post.TrimStart(',').split(',');
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
        };
        Runner.SyllableExtensions = function (Cells, size, CharSet, AllWords, Probables, Movables, SpeicalDict) {
            var Moves = [];
            {
                var All = Runner.GetSyllableList2(Cells, size, false, true);
                for (var indx in All) {
                    var syllable = All[indx];
                    var pattern = Runner.GetSyllablePattern2(CharSet, syllable.Tiles.Replace("(", "").Replace(")", ""), "(?<Center>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)");
                    pattern = U.Util.Format("^{0}$", [pattern]);
                    var R = new RegExp(pattern);
                    {
                        for (var indx2 in Probables) {
                            var probable = Probables[indx2];
                            if (!R.test(probable.Tiles)) {
                                continue;
                            }
                            var M = R.exec(probable.Tiles);
                            var Pre = Runner.MatchedString(M.groups["Pre"], "");
                            var Center = Runner.MatchedString(M.groups["Conso"], "");
                            var Post = Runner.MatchedString(M.groups["Post"], "");
                            var Pres = Pre == "" ? [] : Pre.TrimEnd(',').split(',');
                            var Centers = Center == "" ? [] : Center.split(',');
                            var Posts = Post == "" ? [] : Post.TrimStart(',').split(',');
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
        };
        Runner.WordExtensions = function (Cells, size, CharSet, AllWords, Movables, SpeicalDict) {
            var Moves = [];
            {
                var WordsOnBoard = Runner.GetWordsOnBoard(Cells, size, false);
                for (var indx in WordsOnBoard) {
                    var wordOnBoard = WordsOnBoard[indx];
                    var raw = wordOnBoard.Tiles.Replace("(", "").Replace(")", "").Replace(",", "").Replace("|", ",");
                    var pattern = Runner.GenWordPattern(CharSet, wordOnBoard.Tiles, "(?<Center{0}>.*?)", "", "(?<Center{0}>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)", true);
                    pattern = U.Util.Format("^{0}$", [pattern.TrimEnd('|')]);
                    var R = new RegExp(pattern);
                    {
                        for (var indx2 in AllWords) {
                            var word = AllWords[indx2];
                            if (raw == word.Tiles) {
                                continue;
                            }
                            if (!R.test(word.Tiles)) {
                                continue;
                            }
                            var M = R.exec(word.Tiles);
                            var Pre = "";
                            var Post = "";
                            var Center = "";
                            Pre = Runner.MatchedString(M.groups["Pre"], "");
                            for (var i = 0; i < word.Syllables; i++) {
                                Center = Center + Runner.MatchedString(M.groups["Center" + (i + 1)], ",") + ":";
                            }
                            Center = Center.TrimEnd(':');
                            Post = Runner.MatchedString(M.groups["Post"], "");
                            var Pres = Pre == "" ? [] : Pre.TrimEnd(',').split(',');
                            var Centers = Center.split(':');
                            var Posts = Post == "" ? [] : Post.TrimStart(',').split(',');
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
        };
        Runner.TryHarizontal = function (Cells, size, Index, offset, Pre, Centers, Post) {
            var Moves = [];
            var PreCount = Pre.length;
            var PostCount = Post.length;
            var NewCells = Cells.Clone();
            var Impacted = [];
            if (Pre.length != 0) {
                for (var x = Pre.length - 1; x >= 0; x--) {
                    var n = BoardUtil.FindNeighbors(Index - x, size);
                    if (n.Left != -1) {
                        NewCells[n.Left] += Pre[x];
                        Impacted.push(n.Left);
                        Moves.push({ Tiles: Pre[x], Index: n.Left });
                    }
                    else {
                        return { Words: [], Direction: "H", WordsCount: 0, Moves: [] };
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
                    Moves.push({ Tiles: Centers[c], Index: cellIndex });
                }
            }
            if (Post.length != 0) {
                for (var x = 0; x < Post.length; x++) {
                    var n = BoardUtil.FindNeighbors(Index + offset + x, size);
                    if (n.Right != -1) {
                        NewCells[n.Right] += Post[x];
                        Impacted.push(n.Right);
                        Moves.push({ Tiles: Post[x], Index: n.Right });
                    }
                    else {
                        return { Words: [], Direction: "H", WordsCount: 0, Moves: [] };
                    }
                }
            }
            var W = [];
            for (var i in Impacted) {
                var index = Impacted[i];
                W = W.concat(Runner.WordsAt(NewCells, size, index));
            }
            return { Words: W, Moves: Moves, WordsCount: W.length, Direction: "H" };
        };
        Runner.TryVertical = function (Cells, size, Index, offset, Pre, Centers, Post) {
            var Moves = [];
            var PreCount = Pre.length;
            var PostCount = Post.length;
            var Pos = BoardUtil.Position(Index, size);
            var NewCells = Cells.Clone();
            var Impacted = [];
            if (Pre.length != 0) {
                for (var x = Pre.length - 1; x >= 0; x--) {
                    var cellIndex = BoardUtil.Abs(Pos.X - x, Pos.Y, size);
                    var n = BoardUtil.FindNeighbors(cellIndex, size);
                    if (n.Top != -1) {
                        NewCells[n.Top] += Pre[x];
                        Impacted.push(n.Top);
                        Moves.push({ Tiles: Pre[x], Index: n.Top });
                    }
                    else {
                        return { Words: [], Direction: "V", WordsCount: 0, Moves: [] };
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
                    Moves.push({ Tiles: Centers[c], Index: cellIndex });
                }
            }
            if (Post.length != 0) {
                for (var x = 0; x < Post.length; x++) {
                    var cellIndex = BoardUtil.Abs(Pos.X + offset + x, Pos.Y, size);
                    var n = BoardUtil.FindNeighbors(cellIndex, size);
                    if (n.Bottom != -1) {
                        NewCells[n.Bottom] += Post[x];
                        Impacted.push(n.Bottom);
                        Moves.push({ Tiles: Post[x], Index: n.Bottom });
                    }
                    else {
                        return { Words: [], Direction: "V", WordsCount: 0, Moves: [] };
                    }
                }
            }
            var W = [];
            for (var i in Impacted) {
                var index = Impacted[i];
                W = W.concat(Runner.WordsAt(NewCells, size, index));
            }
            return { Words: W, Moves: Moves, WordsCount: W.length, Direction: "V" };
        };
        Runner.prototype.RefreshScores = function (Moves, Weights, size) {
            for (var indx in Moves) {
                var Move = Moves[indx];
                var score = 0;
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
            Moves.sort(function (x, y) { return x.Score - y.Score; });
            Moves.reverse();
        };
        Runner.prototype.ShortList = function (Words, NonCornerPattern, Dict) {
            if (U.Util.IsNullOrEmpty(NonCornerPattern)) {
                return [];
            }
            var R = RegExp(NonCornerPattern);
            var Matches = this.MatchedWords(Words, NonCornerPattern);
            var Shortlisted = [];
            {
                for (var indx in Matches) {
                    var word = Matches[indx];
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
        };
        Runner.Validate3 = function (WV, AllWords) {
            WV.Words = ProbableWordComparer.Distinct(WV.Words);
            WV.WordsCount = WV.Words.length;
            if (WV.Words.length == 0 || WV.Moves.length == 0) {
                return false;
            }
            return Runner.Validate2(WV.Words, AllWords);
        };
        Runner.Validate2 = function (WV, AllWords) {
            for (var indx in WV) {
                var w = WV[indx];
                var v = AllWords.filter(function (x) { return x.Tiles == w.String; });
                if (v == null || v.length == 0) {
                    return false;
                }
            }
            return true;
        };
        Runner.prototype.Validate = function (InputDict, CharCount) {
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
        };
        Runner.Resolve2 = function (prev, Tiles, SpeicalList) {
            if (U.Util.IsNullOrEmpty(prev)) {
                return { res: true, temp: "" };
            }
            if (prev.length == 1) {
                if (Tiles.Contains(prev)) {
                    Tiles.Remove(prev);
                    return { res: true, temp: prev };
                }
                else {
                    return { res: false, temp: prev };
                }
            }
            else {
                if (SpeicalList.hasOwnProperty(prev)) {
                    if (Tiles.Contains(prev)) {
                        Tiles.Remove(prev);
                        return { res: true, temp: prev };
                    }
                }
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
                    var order = [];
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
                {
                    var order = [];
                    for (var i = 0; i < prev.length; i++) {
                        var c = prev[i];
                        if (Tiles.Contains(c)) {
                            Tiles.Remove(c);
                            order.push(c);
                        }
                        else {
                            return { res: false, temp: c };
                        }
                    }
                    return { res: true, temp: order.join(',') };
                }
            }
        };
        Runner.Resolve = function (Pres, Centers, Posts, Tiles, SpeicalDict) {
            var res = true;
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
        };
        Runner.prototype.MatchedWords = function (words, Pattern) {
            var r = RegExp(Pattern);
            var List = words.filter(function (s) { return r.test(s.Tiles); });
            console.log("\t\t\t" + List.length + " of " + words.length + " found: " + Pattern);
            return List;
        };
        Runner.MatchedString = function (group, seperator) {
            if (group == null) {
                return "";
            }
            var ret = "";
            for (var indx in group) {
                var capture = group[indx];
                ret = ret + capture + seperator;
            }
            if (!U.Util.IsNullOrEmpty(seperator)) {
                ret = ret.TrimEnd(seperator);
            }
            return ret;
        };
        Runner.GetWordsOnBoard = function (Cells, size, includeDuplicates) {
            var Words = [];
            for (var i = 0; i < size; i++) {
                var R = Runner.GetWords(Cells, "R", i, size, includeDuplicates);
                var C = Runner.GetWords(Cells, "C", i, size, includeDuplicates);
                Words = Words.concat(R);
                Words = Words.concat(C);
            }
            return Words;
        };
        Runner.GetWords = function (Cells, option, r, size, includeDuplicates) {
            var Words = [];
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
                            var startIndex = Runner.GetStartIndex(option, r, i, size, cnt);
                            Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex });
                        }
                        else {
                            var X = Words.filter(function (x) { return x.Tiles == word; });
                            if (X == null || X.length == 0) {
                                var startIndex = Runner.GetStartIndex(option, r, i, size, cnt);
                                Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex });
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
                    Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex });
                }
                else {
                    var X = Words.filter(function (x) { return x.Tiles == word; });
                    if (X == null || X.length == 0) {
                        var startIndex = Runner.GetStartIndex(option, r, size, size, cnt);
                        Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex });
                    }
                }
            }
            return Words;
        };
        Runner.WordsAt = function (Cells, size, index) {
            var List = [];
            var Neighbor = BoardUtil.FindNeighbors(index, size);
            var r = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
            var l = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
            var t = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
            var b = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";
            var Lefties = [];
            var Righties = [];
            if (r != "") {
                Righties.push({ Tiles: r, Index: Neighbor.Right });
                var index_ = Neighbor.Right;
                var flg = true;
                while (flg) {
                    var n = BoardUtil.FindNeighbors(index_, size);
                    var r_ = n.Right != -1 ? Cells[n.Right] : "";
                    if (r_ == "") {
                        flg = false;
                        break;
                    }
                    Righties.push({ Tiles: r_, Index: n.Right });
                    index_ = n.Right;
                }
            }
            if (l != "") {
                Lefties.push({ Tiles: l, Index: Neighbor.Left });
                var index_ = Neighbor.Left;
                var flg = true;
                while (flg) {
                    var n = BoardUtil.FindNeighbors(index_, size);
                    var l_ = n.Left != -1 ? Cells[n.Left] : "";
                    if (l_ == "") {
                        flg = false;
                        break;
                    }
                    Lefties.push({ Tiles: l_, Index: n.Left });
                    index_ = n.Left;
                }
            }
            var Topies = [];
            var Downies = [];
            if (t != "") {
                Topies.push({ Tiles: t, Index: Neighbor.Top });
                var index_ = Neighbor.Top;
                var flg = true;
                while (flg) {
                    var n = BoardUtil.FindNeighbors(index_, size);
                    var t_ = n.Top != -1 ? Cells[n.Top] : "";
                    if (t_ == "") {
                        flg = false;
                        break;
                    }
                    Topies.push({ Tiles: t_, Index: n.Top });
                    index_ = n.Top;
                }
            }
            if (b != "") {
                Downies.push({ Tiles: b, Index: Neighbor.Bottom });
                var index_ = Neighbor.Bottom;
                var flg = true;
                while (flg) {
                    var n = BoardUtil.FindNeighbors(index_, size);
                    var d_ = n.Bottom != -1 ? Cells[n.Bottom] : "";
                    if (d_ == "") {
                        flg = false;
                        break;
                    }
                    Downies.push({ Tiles: d_, Index: n.Bottom });
                    index_ = n.Bottom;
                }
            }
            Topies.reverse();
            Lefties.reverse();
            if (Topies.length + Downies.length > 0) {
                var Vertical = Runner.MakeAWord(Topies, { Tiles: Cells[index], Index: index }, Downies);
                List.push(Vertical);
            }
            if (Lefties.length + Righties.length > 0) {
                var Harizontal = Runner.MakeAWord(Lefties, { Tiles: Cells[index], Index: index }, Righties);
                List.push(Harizontal);
            }
            return List;
        };
        Runner.MakeAWord = function (F1, C, F2) {
            var W = {};
            var List = [];
            var ret = "";
            for (var indx in F1) {
                var s = F1[indx];
                ret = ret + s.Tiles.Replace(",", "") + ",";
                var Cell = { Target: s.Tiles, Index: s.Index };
                List.push(Cell);
            }
            {
                ret = ret + C.Tiles.Replace(",", "") + ",";
                var Cell = { Target: C.Tiles, Index: C.Index };
                List.push(Cell);
            }
            for (var indx in F2) {
                var s = F2[indx];
                ret = ret + s.Tiles.Replace(",", "") + ",";
                var Cell = { Target: s.Tiles, Index: s.Index };
                List.push(Cell);
            }
            ret = ret.Trim(',');
            W.String = ret;
            W.Cells = List;
            return W;
        };
        Runner.GetStartIndex = function (option, r, pos, size, move) {
            switch (option) {
                case "R":
                    return BoardUtil.Abs(r, pos - move, size);
                case "C":
                    return BoardUtil.Abs(pos - move, r, size);
            }
            return -1;
        };
        Runner.GetSyllableList2 = function (Cells, size, filter, free) {
            var List = [];
            for (var index = 0; index < Cells.length; index++) {
                var cell = Cells[index];
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
                        List.push({ Tiles: x, Index: index });
                    }
                }
                else {
                    var x = free ? cell : "(" + cell + ")";
                    List.push({ Tiles: x, Index: index });
                }
            }
            return List;
        };
        Runner.prototype.GetSyllableList = function (Cells, size, filterEdges, asGroups) {
            var List = [];
            for (var index = 0; index < Cells.length; index++) {
                var cell = Cells[index];
                if (cell == "") {
                    continue;
                }
                var Neighbor = BoardUtil.FindNeighbors(index, size);
                var r = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
                var l = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
                var t = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
                var b = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";
                if (filterEdges) {
                    if ((r != "" || l != "") && (t != "" || b != "")) {
                    }
                    else {
                        var x = asGroups ? cell : "(" + cell + ")";
                        if (!List.Contains(x)) {
                            List.push(x);
                        }
                    }
                }
                else {
                    var x = asGroups ? cell : "(" + cell + ")";
                    if (!List.Contains(x)) {
                        List.push(x);
                    }
                }
            }
            return List;
        };
        Runner.GetSpecialSyllablePattern2 = function (CharSet, specialOptions) {
            if (U.Util.IsNullOrEmpty(specialOptions)) {
                return "";
            }
            var ret = "";
            {
                var temp = "";
                var Consos = [];
                var Vowels = [];
                Runner.Classify2(CharSet, specialOptions, Consos, Vowels);
                if (Vowels.length > 0 && Consos.length > 0) {
                    for (var indx in Consos) {
                        var a = Consos[indx];
                        temp = temp + a;
                    }
                    temp = temp + "(?<Center>.*?)";
                    for (var indx in Vowels) {
                        var a = Vowels[indx];
                        temp = temp + a;
                    }
                    temp = "(?<Pre>.*?)" + temp + "(?<Post>.*?)";
                }
                else {
                    for (var indx in Consos) {
                        var a = Consos[indx];
                        temp = temp + a;
                    }
                    for (var indx in Vowels) {
                        var a = Vowels[indx];
                        temp = temp + a;
                    }
                    temp = "(?<Pre>.*?)" + temp + "(?<Post>.*?)";
                }
                ret = "^" + temp + "$";
            }
            return ret;
        };
        Runner.GetSyllablePattern = function (CharSet, syllable, consoPatternNoComma, sunnaPattern, allPatternNoComma) {
            var temp = "";
            var Consos = [];
            var Vowels = [];
            Runner.Classify(CharSet, syllable, Consos, Vowels);
            if (Vowels.length > 0 && Consos.length > 0) {
                var tempC = "";
                for (var indx in Consos) {
                    var a = Consos[indx];
                    tempC = tempC + a;
                }
                var tempA = "";
                for (var indx in Vowels) {
                    var a = Vowels[indx];
                    tempA = tempA + a;
                }
                temp = U.Util.Format("{0}{1}{2}{3}", [tempC, consoPatternNoComma, tempA, sunnaPattern]);
            }
            else {
                for (var indx in Consos) {
                    var a = Consos[indx];
                    temp = temp + a;
                }
                if (Vowels.length == 0) {
                    temp = U.Util.Format("{0}{1}", [temp, allPatternNoComma == "" ? "" : (allPatternNoComma)]);
                }
                for (var indx in Vowels) {
                    var a = Vowels[indx];
                    temp = temp + a;
                }
                if (Consos.length == 0) {
                    temp = U.Util.Format("{0}{1}", [temp, sunnaPattern]);
                }
                if (Vowels.length == 0 && Consos.length == 0) {
                    debugger;
                }
            }
            return temp;
        };
        Runner.GetSyllablePattern2 = function (CharSet, syllable, consoPatternNoComma, prePattern, PostPattern) {
            var temp = "";
            var Consos = [];
            var Vowels = [];
            Runner.Classify(CharSet, syllable, Consos, Vowels);
            if (Vowels.length > 0 && Consos.length > 0) {
                var tempC = "";
                for (var indx in Consos) {
                    var a = Consos[indx];
                    tempC = tempC + a;
                }
                var tempA = "";
                for (var indx in Vowels) {
                    var a = Vowels[indx];
                    tempA = tempA + a;
                }
                temp = U.Util.Format("({3}({0}{1}{2}){4})", [tempC, consoPatternNoComma, tempA, prePattern, PostPattern]);
            }
            else {
                for (var indx in Consos) {
                    var a = Consos[indx];
                    temp = temp + a;
                }
                for (var indx in Vowels) {
                    var a = Vowels[indx];
                    temp = temp + a;
                }
                temp = U.Util.Format("({1}{0}{2})", [temp, prePattern, PostPattern]);
            }
            return temp;
        };
        Runner.Join = function (str, join) {
            var ret = "";
            for (var indx = 0; indx < str.length; indx++) {
                var ch = str[indx];
                ret = ret + ch + join;
            }
            ret = ret.TrimEnd(join);
            return ret;
        };
        Runner.prototype.GetFlatList2 = function (inputs) {
            var list = inputs.Clone();
            list.sort();
            var X = [];
            for (var indx in list) {
                var input = list[indx];
                if (!X.Contains(input)) {
                    X.push(input);
                }
            }
            return this.GetFlatList(X, ' ').Replace(" ", "");
        };
        Runner.prototype.GetFlatList = function (List, Seperator) {
            var ret = "";
            for (var indx in List) {
                var s = List[indx];
                ret = ret + s + Seperator;
            }
            ret = ret.TrimEnd(Seperator);
            return ret;
        };
        Runner.prototype.GetFlatList3 = function (List, Seperator) {
            var ret = "";
            for (var indx in List) {
                var s = List[indx];
                ret = ret + s.Tiles + Seperator;
            }
            ret = ret.TrimEnd(Seperator);
            return ret;
        };
        Runner.prototype.DistinctList = function (Set, Seperator) {
            var List = [];
            var arr = Set.split(Seperator);
            for (var indx in arr) {
                var s = arr[indx];
                if (U.Util.IsNullOrEmpty(s)) {
                    continue;
                }
                if (!List.Contains(s)) {
                    List.push(s);
                }
            }
            return List;
        };
        Runner.prototype.GetCountDict2 = function (input) {
            var Dict = {};
            var arr = input.split(',');
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
        };
        Runner.prototype.GetCountDict = function (inputs) {
            if (inputs == null) {
                return null;
            }
            var Dict = {};
            for (var indx in inputs) {
                var input = inputs[indx];
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
        };
        Runner.Classify = function (CharSet, syllable, Consos, Vowels) {
            var Sunna = [];
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
        };
        Runner.Classify2 = function (CharSet, syllable, Consos, Vowels) {
            var Sunna = [];
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
        };
        Runner.GenWordPattern = function (CharSet, word, consoPatternNoComma, sunnaPattern, allPatternNoComma, prePattern, postPattern, useSyllableIndex) {
            var temp = "";
            var arr = word.split('|');
            for (var i = 0; i < arr.length; i++) {
                var syllable = arr[i];
                var pattern = "";
                if (useSyllableIndex) {
                    pattern = Runner.GetSyllablePattern(CharSet, syllable.Replace("(", "").Replace(")", ""), U.Util.Format(consoPatternNoComma, [i + 1]), U.Util.Format(sunnaPattern, [i + 1]), i == arr.length - 1 ? "" : U.Util.Format(allPatternNoComma, [i + 1]));
                }
                else {
                    pattern = Runner.GetSyllablePattern(CharSet, syllable.Replace("(", "").Replace(")", ""), consoPatternNoComma, sunnaPattern, i == arr.length - 1 ? "" : allPatternNoComma);
                }
                temp = temp + pattern + ",";
            }
            temp = temp.TrimEnd(',');
            temp = prePattern + temp + postPattern;
            temp = U.Util.Format("({0})|", [temp]);
            return temp;
        };
        Runner.prototype.GetSpecialDict = function (CharSet, SpecialList) {
            var SpeicalDict = {};
            for (var indx in SpecialList) {
                var sp = SpecialList[indx];
                var pattern = Runner.GetSpecialSyllablePattern2(CharSet, sp);
                SpeicalDict[sp] = new RegExp(pattern);
            }
            return SpeicalDict;
        };
        Runner.prototype.MaxWeightIndex = function (Weights) {
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
        };
        return Runner;
    }());
    exports.Runner = Runner;
    var RunerTest = (function () {
        function RunerTest() {
        }
        RunerTest.Go = function () {
            var Board = {
                Bot: "eenadu",
                Reference: "281",
                Name: "11x11",
                Cells: [
                    "", "", "", "", "", "", "", "", "", "", "",
                    "", "", "", "", "", "", "", "", "", "", "",
                    "", "", "", "", "", "", "", "", "శ", "", "",
                    "", "", "", "", "", "", "", "క", "స,ఇ", "", "",
                    "", "", "", "", "", "", "గ", "క", "", "", "",
                    "", "", "", "", "", "శ", "బ", "శ", "", "", "",
                    "", "", "", "", "చ,ఆ", "వ,ఇ", "", "", "", "", "",
                    "", "", "", "", "ల", "", "", "", "", "", "",
                    "", "", "", "", "", "", "", "", "", "", "",
                    "", "", "", "", "", "", "", "", "", "", "",
                    "", "", "", "", "", "", "", "", "", "", "",
                ],
                Conso: "క ఙ చ జ ప ల స",
                Special: "(ల,ఉ) ",
                Vowels: "అ ఆ ఈ ఉ ఉ ఎ ఏ ఓ"
            };
            AskBot.BotMoveClient(Board);
        };
        return RunerTest;
    }());
    exports.RunerTest = RunerTest;
});