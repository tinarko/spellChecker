# Spell Checker

## Overview
Write a program that reads a large list of English words (e.g. from /usr/share/dict/words on a unix system) into memory, and uses that dictionary to provide spelling suggestions for user input.

* Code quality is more important to us than algorithmic perfection, but your solution shouldn't take multiple seconds per word.
* At Lantern we believe in the value of test driven development, so bonus points if your solution includes valuable unit tests.
* Building on top of existing work (especially open source work) is expected in a professional environment and this challenge is attempting to mimick that environment as closely as possible. 

## Language

Solutions should be written in 1 of the following languages: 

* Ruby
* Javascript
* Objective-C
* Go
* Java

## Spec

Your program should be a cli that takes first argument and outputs the results to STDOUT 

Sample classes of spelling mistakes to be corrected is as follows:

* Case (upper/lower) errors: "inSIDE" => "inside" 
* Repeated letters: "jjoobbb" => "job" 
* Incorrect vowels: "weke" => "wake" 

## Other Notes

* Any combination of the above types of error in a single word should be corrected (e.g. "CUNsperrICY" => "conspiracy").
* If there are many possible corrections of an input word, program can choose one in any way you like. It just has to be an English word that is a spelling correction of the input by the above rules.
* If no correction can be found using the above rules your program should print "NO SUGGESTION"

## Submission

You can submit your answer as either a ZIP or by sharing a hosted (github, gitlab, etc) repo with us. Please include a README that details how to build + run your project. 

#### Examples

```
$ ./spellchecker sheeeeep
sheep
$ ./spellchecker peepple
people
$ ./spellchecker sheeple
NO SUGGESTION
```

### START
Run the program by typing into your cli:
npm start
