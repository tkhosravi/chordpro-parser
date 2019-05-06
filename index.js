const ChordSheetJS = require('chordsheetjs').default;

const format = {
  HTML: "html",
  HTML_DIV: "htmldiv",
  HTML_TABLE: "htmltable",
  TEXT: "text"  
};

module.exports.parse(chordproSheet, returnFormat) {
  const parser = new ChordSheetJS.ChordProParser().default;
  const song = parser.parse(chordSheet);
  returnFormat = (typeof returnFormat === 'undefined' ) ? format.TEXT : returnFormat.toLowerCase();
  var formatter;
  switch (returnFormat) {
	case "html","htmldiv":
	  formatter = new ChordSheetJS.HtmlDivFormatter();
	  break;
	case "htmltable":
	  formatter = new ChordSheetJS.HtmlTableFormatter();
	  break;
	default:
	  formatter = new ChordSheetJS.TextFormatter();
  }
  return formatter.format(song);
}

