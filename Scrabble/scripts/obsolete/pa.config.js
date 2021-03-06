var InitState = {
    Id: "Punjabi",
    GameTable: {
        MaxOnTable: 16,
        MaxVowels: 8,
    },
    Cabinet: {
        Trays: [
            {
                Id: "Vowels",
                Title: "ਅਚ੍ਚੁਲੁ",
                Show: true,
                Set: [
                    { "ਅ": 10 },
                    { "ਆ": 20 },
                    { "ਇ": 20 },
                    { "ਈ": 20 },
                    { "ਉ": 20 },
                    { "ਊ": 20 },
                    { "਎": 20 },
                    { "ਏ": 20 },
                    { "ਐ": 20 },
                    { "਒": 20 },
                    { "ਓ": 20 },
                    { "ਔ": 20 },
                    { "਋": 10 },
                    { "੠": 10 },
                    { "੍Ḍ": 5 },
                    { "ਂ": 5 },
                    { "ਃ": 5 }
                ]
            },
            {
                Id: "Consonants",
                Title: "ਹਲ੍ਲੁਲੁ",
                Show: true,
                Set: [
                    { "ਕ": 20 }, { "ਖ": 5 }, { "ਗ": 20 }, { "ਘ": 5 }, { "ਙ": 5 },
                    { "ਚ": 20 }, { "ਛ": 10 }, { "ਜ": 20 }, { "ਝ": 5 }, { "ਞ": 5 },
                    { "ਟ": 20 }, { "ਠ": 5 }, { "ਡ": 20 }, { "ਢ": 5 }, { "ਣ": 5 },
                    { "ਤ": 20 }, { "ਥ": 5 }, { "ਦ": 20 }, { "ਧ": 10 }, { "ਨ": 5 },
                    { "ਪ": 20 }, { "ਫ": 5 }, { "ਬ": 20 }, { "ਭ": 20 }, { "ਮ": 20 },
                    { "ਯ": 20 }, { "ਰ": 20 }, { "ਲ": 20 }, { "ਵ": 20 },
                    { "ਸ਼": 20 }, { "਷": 20 }, { "ਸ": 20 }, { "ਹ": 20 },
                    { "ਲ਼": 20 }, { "਱": 20 },
                    { "ਕ੍਷": 5 }, { "ਮੁ": 20 },
                ]
            }
        ]
    },
    Board: {
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
            6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
        ]
    }
};
var Configuration = {
    Language: "pa",
    FullSpecialSet: [
        "ਾ",
        "ਿ", "ੀ",
        "ੁ", "ੂ",
        "੃", "੄",
        "੆", "ੇ",
        "ੈ",
        "੊", "ੋ",
        "ੌ", "੍", "੍Ḍ"
    ],
    SpecialSet: [
        "ਾ",
        "ਿ", "ੀ",
        "ੁ", "ੂ",
        "੃", "੄",
        "੆", "ੇ",
        "ੈ",
        "੊", "ੋ",
        "ੌ"
    ],
    SunnaSet: ["ਂ", "ਃ"],
    Vowels: [
        "ਅ", "ਆ",
        "ਇ", "ਈ",
        "ਉ", "ਊ",
        "਎", "ਏ", "ਐ",
        "਒", "ਓ", "ਔ",
        "਋", "੠"],
    Consonents: [
        "ਕ", "ਖ", "ਗ", "ਘ", "ਙ",
        "ਚ", "ਛ", "ਜ", "ਝ", "ਞ",
        "ਟ", "ਠ", "ਡ", "ਢ", "ਣ",
        "ਤ", "ਥ", "ਦ", "ਧ", "ਨ",
        "ਪ", "ਫ", "ਬ", "ਭ", "ਮ",
        "ਯ", "ਰ", "ਲ", "ਵ",
        "ਸ਼", "਷", "ਸ", "ਹ",
        "ਲ਼", "਱",
        "ਕ੍਷", "ਮੁ"],
    Virama: "੍",
    Synonyms: {
        "ਆ": "ਾ",
        "ਇ": "ਿ",
        "ਈ": "ੀ",
        "ਉ": "ੁ",
        "ਊ": "ੂ",
        "਋": "੃",
        "੠": "੄",
        "਎": "੆",
        "ਏ": "ੇ",
        "ਐ": "ੈ",
        "਒": "੊",
        "ਓ": "ੋ",
        "ਔ": "ੌ",
        "ਾ": "ਆ",
        "ਿ": "ਇ",
        "ੀ": "ਈ",
        "ੁ": "ਉ",
        "ੂ": "ਊ",
        "੃": "਋",
        "੄": "੠",
        "੆": "਎",
        "ੇ": "ਏ",
        "ੈ": "ਐ",
        "੊": "਒",
        "ੋ": "ਓ",
        "ੌ": "ਔ"
    },
    Syllables: {
        "ਮੁ": ["ਮ", "ੁ"]
    },
    Messages: {
        InvalidMove: "'{0}' can't be combined with '{1}'",
        UseSynonym: "Attempting to use '{2}' instead of '{1}' with '{0}'.",
        Messages: "Messages",
        CrossCells: "All letters should be arranged either hariontally or vertically.",
        HasIslands: "Words are spreaded across islands.",
        HasOraphans: "Single Letter (Akshara) Words are not allowed.",
        OrphanCell: "Single Letter(Akshara) at position Harizontal: {2} Vertical: {0}",
        HasDupliates: "The word ('{0}') already exists on the board.",
        Claimed: "* Is a Claim"
    }
};
