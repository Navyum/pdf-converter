export const WordFormat = {
  BOLD: 'bold',
  ITALIC: 'italic',
  UNDERLINE: 'underline',
  STRIKETHROUGH: 'strikethrough'
} as const;

export type WordFormat = typeof WordFormat[keyof typeof WordFormat];

export function enumValueOf(formatName?: string): WordFormat | null {
  if (!formatName) return null;
  
  const normalizedFormat = formatName.toLowerCase();
  switch (normalizedFormat) {
    case 'bold':
      return WordFormat.BOLD;
    case 'italic':
      return WordFormat.ITALIC;
    case 'underline':
      return WordFormat.UNDERLINE;
    case 'strikethrough':
      return WordFormat.STRIKETHROUGH;
    default:
      return null;
  }
}

export default { WordFormat, enumValueOf }; 