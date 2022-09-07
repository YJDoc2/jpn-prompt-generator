# JPN Prompter

A simple web app which will give a random prompt of words and grammar points , so one can (hopefully) stop procrastinating and start using them.

---

# What is this

While trying to learn Japanese, I felt that the amount of practice for "output"-ing, i.e. writing/speaking or doing anything that will make me think in Japanese by just doing test/work book exercises. I wanted something that will give me random prompts which I'll have to use and make sentences out of, so I'll get more practice. Thus, This!

This currently has N5 and N4 JLPT level vocabulary collected from Jisho, and Genki 1 Grammar points, which you can

- Get 1-10 random selection from vocab and grammar, as per number decided by you.
- Click on the words to open Jisho page of it, so you can understand the words you don't know.
- Choose to get a random sample, as well as a "daily random" sample, similar to how _Wordle_ gives a new one daily. The "day" is based on the timezone from which you are viewing the site. This way you can do this in group, share and compare.
- Choose up to which lesson to get grammar points from, so you can get from only the lessons you have done.

That's about it!

# Improvements

This is by no means perfect, so contributions are much welcome. Please check [contributions](#contributions) section for more information on licenses under which they will be added.

## Really like to have these

- Better styling and design : I'm not particularly good at these, so the website's a bit eyesore. I mean sure, its not a marquee with neon colors, but that's a too low bar. The dark theme is also implemented in a bit hacky way, and it especially shows in input fields. I'd love to make it look and feel better
- More accessible : This could use more aria labels and other stuff that can help more people use this, would love to make it better.
- Better Mobile design : Current mobility is based on bootstrap defaults, but they can be tweaked a bit more to make it look good on mobile devices.

## Wouldn't mind to add these

I wouldn't mind adding these if enough people want them.
- More vocab decks : Currently this only has N5 and N4, because I'm at lower N5-ish level. If people on higher levels are using this, and want N3/2/1 decks, I wouldn't mind adding them. This will take changes only from my side.
- Grammar points from other books : I have added Genki 1 , as that's what I'm currently using, but if enough people want some other book's points, I wouldn't mind adding that. For this There will be some changes needed in code as well as I will need help in getting similar JSON about the grammar points in that book from the requestors.
- Support for custom Vocab lists to sample from : I wouldn't mind adding support for importing and storing custom vocab list JSON from local-storage ( so it will be device specific), so one can get words from their chosen set. This will need some code contributions.

## Most likely won't fix

- Making this a SPA using a framework: This is a pretty simple thing doing pretty simple thing. I don't want to ship extra framework related JS to users, when this is literally a single page application. Even if I need to add any more pages, as long as they are static and don't require complex state management that will be really hard to do using vanilla JS, I would like this to be simple HTML-CSS-JS pages.

---

# Resources

Here are some resources which you can use with this, if you want to.</p>
__NOTE__ I'm not affiliated with any of these, and nor they related to this in any way (except jisho, from which  I have collected the words ).

- [Jisho](https://jisho.org/) : The great dictionary! Words for vocab section have been collected using its api.
- Tokini Andy : The great Teacher! Make sure you check out his [YouTube Channel](https://www.youtube.com/c/ToKiniAndy) and [Website](https://www.tokiniandy.com/)!
- SRS Systems : Personally I use [JPDB io](https://jpdb.io/), [WaniKani](https://www.wanikani.com/) is also another famous one.
- Grammar check : You can use [bunpro-check](https://bunpo-check.com/) and [sapling.ai](https://sapling.ai/lang/japanese) to check your grammar.

---

# IMPORTANT NOTES

## About data
All the words data used here is taken using [jisho.org](https://jisho.org) api. Thus, they are under the license which jisho offers them with. [Check near footer here](https://jisho.org/about) for more information on the license. If you are using them, please make sure to follow the appropriate license. 

## About scripts
The scripts used to get the data are in the /scripts directory. Please do not misuse them. If you just need the data, then you can use the one already collected here in the /data directory, according to the license as stated above. There is no guarantee that it is/will be up-to-date.

---
# Contributions

Contribution are welcome!

Please note that the they will be licensed in similar way, i.e
- Any contributions to words will either follow the license of the source, or will be under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/legalcode)
- Any contributions to grammar points will be under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/legalcode).
- Any contributions to code will be under [GNU-GPL V3](https://www.gnu.org/licenses/gpl-3.0.txt).

# LICENSES

- The words are taken using Jisho api, where they are collected from JMdict, Kanjidic2, JMnedict and Radkfile dictionary files. 
These files are the property of the [Electronic Dictionary Research and Development Group](http://www.edrdg.org/), and are used in conformance with the Group's [license](http://www.edrdg.org/edrdg/licence.html).

- The JLPT tagging data comes from Jonathan Waller's [JLPT Resources page](http://www.tanos.co.uk/jlpt/).

- The Genki grammar points are collected from the Genki book, and the JSON file is distributed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/legalcode). More human-readable summary of the license can be found [here](https://creativecommons.org/licenses/by-sa/3.0/legalcode) .

- The code in this repository is licensed under [GNU-GPL V3](https://www.gnu.org/licenses/gpl-3.0.txt), which can be found at [license.md](./LICENSE.md)

- Genki books, copyrights and trademarks etc are property of their authors/publishers and not related to me in any way.

