# Chordpro Parser
Chordpro Parser based on the [chordsheetjs](https://www.npmjs.com/package/chordsheetjs "ChordSheeJS") module (Special thank for [martijnversluis](https://github.com/martijnversluis) )

This parser acts as a helper for the [chordsheetjs](https://www.npmjs.com/package/chordsheetjs "ChordSheeJS") module, it does not replace it at all and if you need more features than simple Chordpro format parsing, better use the [chordsheetjs](https://www.npmjs.com/package/chordsheetjs "ChordSheeJS") module.

## Installation

```javascript
const parser = require('chordpro-parser');
```

## Usage

```javascript
const chordSheet = `
       Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                G              F  C/E Dm C
Whisper words of wisdom, let it be`.substring(1);

const song = parser.parse(chordSheet, "html");
```
