# Indic Scrabble 

*Scrabble* is a popular word game originally designed for Latin (English) Languages. Later it was adopted by many other languages.
Multiple attempts were made in the past to bring the Scrabble to Indian Languages targeted to work on mobiles and tablets. But the attempts were not successful and were not widely populared.
This project is another attempt to build Scrabble for Indian Languages by customizing some of the rules.

## Dynamic Nature of Scripts

* Indian Language scripts are dynamic in nature.
* Scripts of Indic Languages are very dynamic i
* *Telugu* is a South Indian Language which has around around *100milion* Native speakers.
* It consists of 16 vowels and 38 Consonants and 2 Modifiers i.e. Total 56 Letters.
* 56 Letters
* When each Consonant combined with a Vowel it take a new form i.e. 38*16 = 608 Glyphs
* Each Consonant also have a subscript Form i.e. additional 38 Glyphs
* The subscript form is assumed by a consonant when it is combined with another consonant.
* Roughly around 56 + 608 + 38=702Gyphs (or Tiles) are needed to build Scrabble for Telugu (or for any other Indian Languages).

## Syllables and Tiles

* Syllable (Aksharam) is the writing unit for Indic Languages. A Syllable is a set of Letters.
* Logically it makes sense to choose a valid Syllable as a tile. 
* When we say that a valid Syllable can only be placed on board then it increases the no. of tiles. This number is theoretically *infinite*. But we would in thousand's in real.
* Hence I came up with following rules or exceptions for *Indic Scrabble*. 
    * A tile placed on the board can be *altered* by adding new *tile(s)* to form a new Syllable.
    * Total of 14 tiles would be used with 7 Consonants and 7 Vowels + Modifiers instead of 7 tiles. Since Combining Consonants with Vowels and Modifiers is very frequent and in fact most of the Syllables ends with one of the vowels or modifiers.
* Rest of the Scrabble rules to stay as it is.

## Languages

* Telugu
* Kannada
* Other Languages (Immediate Targets)
    * Hindi (Devanagari Script)
    * Sinhala
    * Nepali
    * Tamil
    * Punjabi
    * Gujarati

## Bots and Dictionaries

* Artificial Intelligence Bot framework was developed for users to play against Bots
* All the Bots uses the same intelligence but have different vocabularies.
* Bots uses the browser resources to think But it is allowed to configure bots to have their own intelligence distributed.
* Average response time of the Bot is between 80ms to 8sec. Bots take more time as the size of vocabulary and open ends of the board.
* Bots uses Regular Expressions to shortlist the words.
* Bots vocabulary is pre-complied in tile(Not Letter) format.
* Currently Telugu has 6 Bots and Kananada has 1 Bots.
* Bots were named after the source of vocabulary.
* Vocabulary was built by crawling & compiling various sources. 
* The Crawling Source code is not part of this. Reach me incase you are interested in it.

## Technologies

*  The Game designed to work on a browser with no or minimum server round trips.
*  ASP.NET (C#.NET) as the Server Language but any other language can also be used. Python is my personal choice for porting.
*  JavaScript/Typescript(version 1.8).
*  React(version 15.0.0) with Redux.

## Demo
    http://indicscrabble.apphb.com/





