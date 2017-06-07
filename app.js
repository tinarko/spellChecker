process.stdin.resume();
process.stdin.setEncoding("ascii");
var spellcheck = require('spellchecker');

var SpellChecker = function() {
  this.checkedWords = [];
  this.word = '';
  this.goodWord = false;
  this.replacementOptions = [];
}

SpellChecker.prototype.checkCase = function() {
  var firstLetter = this.word[0];
  var restOfWord = this.word.slice(1, this.word.length).toLowerCase();
  this.word = firstLetter + restOfWord;
  this.checkDictionary(this.word);
}

SpellChecker.prototype.checkRepeatedLetters = function() {

  // find all repeated letters
  var wordAsArray = this.word.split('');
  var repeatTracker = [];
  var counter = 0;

  for (var i = 1; i < wordAsArray.length; i++) {
    if (wordAsArray[i-1] === wordAsArray[i]) {
      counter++;
      if (counter === 1) {
        repeatTracker.push(i-1);
        repeatTracker.push(counter);
      } else {
        repeatTracker[repeatTracker.length-1]++;
      }
    } else {
      counter = 0;
    }
  }

  // generate replacement word options of words that do not have all of the repeated letters
  this.replacementOptions = [this.word.trim()];

  if (repeatTracker.length > 0) {
    var index = repeatTracker.length - 1;
    var repeatCount, wordIndex;
  } else {
    return;
  }

  var wordToAlter;
  var existingOptions;

  while (index > 0) {
    repeatCount = repeatTracker[index];
    wordIndex = repeatTracker[index - 1];

    for (var i = 0; i < repeatCount; i++) {
      existingOptions = this.replacementOptions.length;
      for (var w = 0; w < existingOptions; w++) {
        wordToAlter = this.replacementOptions[w].split('');
        wordToAlter.splice(wordIndex, 1);
        wordToAlter = wordToAlter.join('').trim();
        if (this.replacementOptions.indexOf(wordToAlter) === -1) {
          this.replacementOptions.push(wordToAlter);
        }
      } 
    }
    index-=2;
  }

  this.checkReplacementOptions();
}

SpellChecker.prototype.checkVowels = function() {
  var total = this.replacementOptions.length;
  var word;
  var wordIndex = 0;
  var hasVowelToConvert = true;
  var optionsIndex = 0;

  // go through each word
  while(optionsIndex < total) {
    // go through each letter
    word = this.replacementOptions[optionsIndex];
    // this.replacementOptions.splice(optionsIndex, 1);
    while (wordIndex < word.length && hasVowelToConvert) {
      if (word[wordIndex] === 'a' || word[wordIndex] === 'e' || word[wordIndex] === 'i' 
        || word[wordIndex] === 'o' || word[wordIndex] === 'u') {
        this.replacementOptions.push(word.slice(0, wordIndex) + 'a' + word.slice(wordIndex + 1, word.length));
        this.replacementOptions.push(word.slice(0, wordIndex) + 'e' + word.slice(wordIndex + 1, word.length));
        this.replacementOptions.push(word.slice(0, wordIndex) + 'i' + word.slice(wordIndex + 1, word.length));
        this.replacementOptions.push(word.slice(0, wordIndex) + 'o' + word.slice(wordIndex + 1, word.length));
        this.replacementOptions.push(word.slice(0, wordIndex) + 'u' + word.slice(wordIndex + 1, word.length));
        hasVowelToConvert = false;
        optionsIndex = -1;
        total = this.replacementOptions.length;
      }
      wordIndex++;
    }
    hasVowelToConvert = true;
    optionsIndex++;
  }

  this.checkReplacementOptions();

}

SpellChecker.prototype.checkReplacementOptions = function () {
  for (var j = 0; j < this.replacementOptions.length; j++) {
    this.word = this.replacementOptions[j];
    this.checkDictionary(this.word);
    if (this.goodWord) {
      break;
    }
  }
}

SpellChecker.prototype.checkDictionary = function (wordToCheck) {
  this.goodWord = !spellcheck.isMisspelled(wordToCheck);
}

SpellChecker.prototype.checkAll = function(stringOfWords) {

  var arrayOfWords = stringOfWords.split(', ').join(' ').split(' ').join(',').split(',');

  for (var i = 0; i < arrayOfWords.length; i++) {
    this.goodWord = false;
    this.word = arrayOfWords[i];
    this.checkCase();

    if (!this.goodWord) {
      this.checkRepeatedLetters();
      if (!this.goodWord) {
        this.checkVowels();
      }
    }

    if (this.goodWord) {
      this.checkedWords.push(this.word);
    } else {
      this.checkedWords.push('NO SUGGESTION');
    }
  }

  process.stdout.write('Here are your spell-checked words:\n' + this.checkedWords.join(', ') + '\n');
  process.exit();
}

process.stdout.write('Which word(s) would you like to spell check? Please separate your words by commas and/or spaces: \n');

process.stdin.on("data", function (data) {
  var stringOfWords = data;
  var checkSpelling = new SpellChecker();
  checkSpelling.checkAll(stringOfWords);
});



