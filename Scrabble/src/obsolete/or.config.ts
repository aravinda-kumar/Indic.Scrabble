//---------------------------------------------------------------------------------------------
// <copyright file="or.config.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 25-Feb-2018 15:18EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
var InitState: any = {
    Id: "Odia",
    GameTable: {
        MaxOnTable: 16,
        MaxVowels: 8,
    },
    Cabinet: {
        Trays: [
            {
                Id: "Vowels",
                Title: "ଅଚ୍ଚୁଲୁ",
                Show: true,
                Set:
                [
                    { "ଅ": 10 },
                    { "ଆ": 20 },
                    { "ଇ": 20 },
                    { "ଈ": 20 },
                    { "ଉ": 20 },
                    { "ଊ": 20 },
                    { "଎": 20 },
                    { "ଏ": 20 },
                    { "ଐ": 20 },
                    { "଒": 20 },
                    { "ଓ": 20 },
                    { "ଔ": 20 },
                    { "ଋ": 10 },
                    { "ୠ": 10 },
                    { "୍Ἄ": 5 },
                    { "ଂ": 5 },
                    { "ଃ": 5 }
                ]
            },
            {
                Id: "Consonants",
                Title: "ହଲ୍ଲୁଲୁ",
                Show: true,
                Set:
                [
                    { "କ": 20 }, { "ଖ": 5 }, { "ଗ": 20 }, { "ଘ": 5 }, { "ଙ": 5 },
                    { "ଚ": 20 }, { "ଛ": 10 }, { "ଜ": 20 }, { "ଝ": 5 }, { "ଞ": 5 },
                    { "ଟ": 20 }, { "ଠ": 5 }, { "ଡ": 20 }, { "ଢ": 5 }, { "ଣ": 5 },
                    { "ତ": 20 }, { "ଥ": 5 }, { "ଦ": 20 }, { "ଧ": 10 }, { "ନ": 5 },
                    { "ପ": 20 }, { "ଫ": 5 }, { "ବ": 20 }, { "ଭ": 20 }, { "ମ": 20 },
                    { "ଯ": 20 }, { "ର": 20 }, { "ଲ": 20 }, { "ଵ": 20 },
                    { "ଶ": 20 }, { "ଷ": 20 }, { "ସ": 20 }, { "ହ": 20 },
                    { "ଳ": 20 }, { "଱": 20 },
                    { "କ୍ଷ": 5 }, { "ମୁ": 20 },
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
var Configuration: any = {
    Language: "or",
    FullSpecialSet: [
        "ା",
        "ି", "ୀ",
        "ୁ", "ୂ",
        "ୃ", "ୄ",
        "୆", "େ",
        "ୈ",
        "୊", "ୋ",
        "ୌ", "୍", "୍Ἄ"// Including Virama,Virama+ZWJ
    ],
    SpecialSet: [
        "ା",
        "ି", "ୀ",
        "ୁ", "ୂ",
        "ୃ", "ୄ",
        "୆", "େ",
        "ୈ",
        "୊", "ୋ",
        "ୌ" // Excluding Virama
    ],
    SunnaSet: ["ଂ", "ଃ"],
    Vowels: [
        "ଅ", "ଆ",
        "ଇ", "ଈ",
        "ଉ", "ଊ",
        "଎", "ଏ", "ଐ",
        "଒", "ଓ", "ଔ",
        "ଋ", "ୠ"],
    Consonents: [
        "କ", "ଖ", "ଗ", "ଘ", "ଙ",
        "ଚ", "ଛ", "ଜ", "ଝ", "ଞ",
        "ଟ", "ଠ", "ଡ", "ଢ", "ଣ",
        "ତ", "ଥ", "ଦ", "ଧ", "ନ",
        "ପ", "ଫ", "ବ", "ଭ", "ମ",
        "ଯ", "ର", "ଲ", "ଵ",
        "ଶ", "ଷ", "ସ", "ହ",
        "ଳ", "଱",
        "କ୍ଷ", "ମୁ"],
    Virama: "୍",
    Synonyms:
    {
        "ଆ": "ା",
        "ଇ": "ି",
        "ଈ": "ୀ",
        "ଉ": "ୁ",
        "ଊ": "ୂ",
        "ଋ": "ୃ",
        "ୠ": "ୄ",
        "଎": "୆",
        "ଏ": "େ",
        "ଐ": "ୈ",
        "଒": "୊",
        "ଓ": "ୋ",
        "ଔ": "ୌ",
        "ା": "ଆ",
        "ି": "ଇ",
        "ୀ": "ଈ",
        "ୁ": "ଉ",
        "ୂ": "ଊ",
        "ୃ": "ଋ",
        "ୄ": "ୠ",
        "୆": "଎",
        "େ": "ଏ",
        "ୈ": "ଐ",
        "୊": "଒",
        "ୋ": "ଓ",
        "ୌ": "ଔ"
    },
    Syllables: {
        "ମୁ": ["ମ", "ୁ"]
    },
    Messages:
    {
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