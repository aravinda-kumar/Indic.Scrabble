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
    Cabinet: {
        Trays: [
            {
                Id: "Favourites",
                Title: "తరచూవాడేవి",
                Count: 10,
                Show: false,
                Set:
                ["క", "గ"]
            },
            {
                Id: "Vowels",
                Title: "అచ్చులు",
                Count: 5,
                Show: true,
                Set:
                ["అ", "ఆ",
                    "ఇ", "ఈ",
                    "ఉ", "ఊ",
                    "ఎ", "ఏ", "ఐ",
                    "ఒ", "ఓ", "ఔ",
                    "ఋ", "ౠ",
                    "్‌", "ం", "ః"]
            },
            {
                Id: "SuperScripts",
                Title: "గుణింతాలు",
                Count: 20,
                Show: false,
                Set: ["ా",
                    "ి", "ీ",
                    "ు", "ూ",
                    "ృ", "ౄ",
                    "ె", "ే",
                    "ై",
                    "ొ", "ో",
                    "ౌ"]
            },
            {
                Id: "Consonants",
                Title: "హల్లులు",
                Count: 5,
                Show: true,
                Set:
                ["క", "ఖ", "గ", "ఘ", "ఙ",
                    "చ", "ఛ", "జ", "ఝ", "ఞ",
                    "ట", "ఠ", "డ", "ఢ", "ణ",
                    "త", "థ", "ద", "ధ", "న",
                    "ప", "ఫ", "బ", "భ", "మ",
                    "య", "ర", "ల", "వ",
                    "శ", "ష", "స",
                    "హ", "ళ", "ఱ",
                    "క్ష"]
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
    },
    Players:
    {
        Players:
        [
            { Name: "శర్వాణీ" },
            { Name: "శ్రీదీపిక" }
        ]
    },
    InfoBar: {}
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
        "శ", "ష", "స",
        "హ", "ళ", "ఱ",
        "క్ష"],
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
    }
};
