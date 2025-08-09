// Plain object replacement for enumify-based WordFormat
const WordFormat = {
    BOLD: { name: 'BOLD', startSymbol: '**', endSymbol: '**' },
    OBLIQUE: { name: 'OBLIQUE', startSymbol: '_', endSymbol: '_' },
    BOLD_OBLIQUE: { name: 'BOLD_OBLIQUE', startSymbol: '**_', endSymbol: '_**' },
};

WordFormat.enumValueOf = function(name) {
    return WordFormat[name];
};

export default WordFormat;
