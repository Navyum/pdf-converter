export function normalizedCharCodeArray(text: string): number[] {
  return text
    .toLowerCase()
    .split('')
    .map(char => char.charCodeAt(0));
}

export function isNumber(text: string): boolean {
  return /^\d+$/.test(text.trim());
}

export function isListItemCharacter(text: string): boolean {
  const listItemChars = ['-', '*', '+', '•', '◦', '▪', '▫'];
  return listItemChars.includes(text.trim());
} 