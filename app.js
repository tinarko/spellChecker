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

  console.log('WOOHOOO!', this.replacementOptions);

  for (var j = 0; j < this.replacementOptions.length; j++) {
    this.word = this.replacementOptions[j];
    this.checkDictionary(this.word);
    if (this.goodWord) {
      break;
    }
  }

}



SpellChecker.prototype.checkVowels = function() {
  this.checkDictionary(this.word);
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



