﻿//---------------------------------------------------------------------------------------------
// <copyright file="te.config.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 29-Jan-2018 21:53EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
var InitState: any = {
    Id: "Telugu",
    GameTable: {
        MaxOnTable: 16,
        MaxVowels: 8,
    },
    Cabinet: {
        Trays: [
            {
                Id: "Vowels",
                Title: "అచ్చులు",
                Show: true,
                Set:
                [
                    { "అ": 3 },
                    { "ఆ": 5 },
                    { "ఇ": 5 },
                    { "ఈ": 5 },
                    { "ఉ": 5 },
                    { "ఊ": 5 },
                    { "ఎ": 5 },
                    { "ఏ": 5 },
                    { "ఐ": 5 },
                    { "ఒ": 5 },
                    { "ఓ": 5 },
                    { "ఔ": 5 },
                    { "ఋ": 3 },
                    { "ౠ": 3 },
                    { "్‌": 1 },
                    { "ం": 1 },
                    { "ః": 1 }
                ]
            },
            {
                Id: "Consonants",
                Title: "హల్లులు",
                Show: true,
                Set:
                [
                    { "క": 5 }, { "ఖ": 1 }, { "గ": 5 }, { "ఘ": 1 }, { "ఙ": 1 },
                    { "చ": 5 }, { "ఛ": 3 }, { "జ": 5 }, { "ఝ": 1 }, { "ఞ": 1 },
                    { "ట": 5 }, { "ఠ": 1 }, { "డ": 5 }, { "ఢ": 1 }, { "ణ": 1 },
                    { "త": 5 }, { "థ": 1 }, { "ద": 5 }, { "ధ": 3 }, { "న": 1 },
                    { "ప": 5 }, { "ఫ": 1 }, { "బ": 5 }, { "భ": 5 }, { "మ": 5 },
                    { "య": 5 }, { "ర": 5 }, { "ల": 5 }, { "వ": 5 },
                    { "శ": 5 }, { "ష": 5 }, { "స": 5 }, { "హ": 5 },
                    { "ళ": 5 }, { "ఱ": 5 },
                    { "క్ష": 1 }, { "ము": 5 }, { "లు": 5 },
                ]
            }
        ]
    },
    Board: {
        Name: "11x11",
        Size: 11,
        Weights:
        [
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
    }
};
var Configuration: any = {
    Language: "te",
    FullSpecialSet: [
        "ా",
        "ి", "ీ",
        "ు", "ూ",
        "ృ", "ౄ",
        "ె", "ే",
        "ై",
        "ొ", "ో",
        "ౌ", "్", "్‌"// Including Virama,Virama+ZWJ
    ],
    SpecialSet: [
        "ా",
        "ి", "ీ",
        "ు", "ూ",
        "ృ", "ౄ",
        "ె", "ే",
        "ై",
        "ొ", "ో",
        "ౌ" // Excluding Virama
    ],
    SunnaSet: ["ం", "ః"],
    Vowels: [
        "అ", "ఆ",
        "ఇ", "ఈ",
        "ఉ", "ఊ",
        "ఎ", "ఏ", "ఐ",
        "ఒ", "ఓ", "ఔ",
        "ఋ", "ౠ"],
    Consonents: [
        "క", "ఖ", "గ", "ఘ", "ఙ",
        "చ", "ఛ", "జ", "ఝ", "ఞ",
        "ట", "ఠ", "డ", "ఢ", "ణ",
        "త", "థ", "ద", "ధ", "న",
        "ప", "ఫ", "బ", "భ", "మ",
        "య", "ర", "ల", "వ",
        "శ", "ష", "స", "హ",
        "ళ", "ఱ",
        "క్ష", "ము", "లు"],
    Virama: "్",
    Synonyms:
    {
        "ఆ": "ా",
        "ఇ": "ి",
        "ఈ": "ీ",
        "ఉ": "ు",
        "ఊ": "ూ",
        "ఋ": "ృ",
        "ౠ": "ౄ",
        "ఎ": "ె",
        "ఏ": "ే",
        "ఐ": "ై",
        "ఒ": "ొ",
        "ఓ": "ో",
        "ఔ": "ౌ",
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
    SyllableTiles: {
        "ము": ["మ", "ఉ"],
        "లు": ["ల", "ఉ"],
        "క్ష": ["క", "ష"]
    },
    SyllableChars: {
        "ము": ["మ", "ు"],
        "లు": ["ల", "ు"],
        "క్ష": ["క", "ష"]
    },
    SyllableSynonym:
    {
        "మఉ": "ము",
        "లఉ": "లు",
        "కష": "క్ష"
    },
    Messages:
    {
        InvalidMove: "'{0}' ను '{1}' తో కలపడం సాధ్యంకాదు.",
        UseSynonym: " '{1}' కు బదులుగా '{2}' తో '{0}' ను కలపడానికి ప్రయత్నం చేస్తున్నాం.",
        Messages: "సందేశాలు",
        CrossCells: "అన్నీ ఒకే నిలువు లేదా అడ్డం గడులలో మాత్రమే ఉండాలి.",
        HasIslands: "పదాలు వేరువేరు లంకలలో విస్తరించి ఉన్నాయి.",
        HasOraphans: "ఏకాక్షరపదాలు అంగీకారం కావు.",
        OrphanCell: "ఏకాక్షరము {2} అడ్డం: {0} నిలువు:{1} వద్ధ ఉన్నది ",
        HasDupliates: "ఇదే పదం ('{0}') ఇప్పటికే పటంపై ఉంది.",
        Claimed: "* దావాలో ఉన్నది",
        Thinking: "'{0}' ఆలోచిస్తున్నారు.",
        YourTurn: "ఇప్పుడు '{0}' వంతు",
        BotEffort2: "{1} : {0}లు ఆలోచించీ {2} పదాలు పేర్చారు.",
        BotEffort: "{1} : {0}లు ఆలోచించీ ఒక పదం పేర్చారు.",
        BotNoWords: "{1} :{0}లు ఆలోచించినా ఏపదాలు పేర్చలేకపోయారు.",
        GameOver: "ఆట పూర్తయ్యింది.",
        Winner: "విజేత : {0}",
        MatchTied: "!!..ఇద్దరూ విజేతలే..!!",
        WhyGameOver: "'{0}' వరుసగా {1} సార్లు ఏపదాలు పేర్చనందున ఆటపూర్తయ్యింది.",
        NoWordsAdded: "# సూచన # : '{0}' ఏపదాలూ పేర్చలేదు. ఇది వరుసగా {1}వ సారి.",
        Stats: "నిండుదనం: {1}% మొత్తం పదాలు: {2} నిల్వ: {3}% వెలితి:{0}"
    }
};
