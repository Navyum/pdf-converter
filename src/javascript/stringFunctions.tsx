const MIN_DIGIT_CHAR_CODE = 48;
const MAX_DIGIT_CHAR_CODE = 57;
const WHITESPACE_CHAR_CODE = 32;
const TAB_CHAR_CODE = 9;
const DOT_CHAR_CODE = 46;

export function isDigit(charCode: number): boolean {
  return charCode >= MIN_DIGIT_CHAR_CODE && charCode <= MAX_DIGIT_CHAR_CODE;
}

export function isNumber(text: string): boolean {
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    if (!isDigit(charCode)) {
      return false;
    }
  }
  return true;
}

export function hasOnly(text: string, char: string): boolean {
  const target = char.charCodeAt(0);
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code !== target) {
      return false;
    }
  }
  return true;
}

export function hasUpperCaseCharacterInMiddleOfWord(text: string): boolean {
  let beginningOfWord = true;
  for (let i = 0; i < text.length; i++) {
    const character = text.charAt(i);
    if (character === ' ') {
      beginningOfWord = true;
    } else {
      if (
        !beginningOfWord &&
        isNaN((character as unknown as number) * 1) &&
        character === character.toUpperCase() &&
        character.toUpperCase() !== character.toLowerCase()
      ) {
        return true;
      }
      beginningOfWord = false;
    }
  }
  return false;
}

// 保持与 TS 版一致：转换为小写并保留所有字符
export function normalizedCharCodeArray(text: string): number[] {
  return text
    .toLowerCase()
    .split('')
    .map(char => char.charCodeAt(0));
}

export function charCodeArray(text: string): number[] {
  const charCodes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    charCodes.push(text.charCodeAt(i));
  }
  return charCodes;
}

export function removeLeadingWhitespaces(text: string): string {
  while (text.charCodeAt(0) === WHITESPACE_CHAR_CODE) {
    text = text.substring(1, text.length);
  }
  return text;
}

export function removeTrailingWhitespaces(text: string): string {
  while (text.charCodeAt(text.length - 1) === WHITESPACE_CHAR_CODE) {
    text = text.substring(0, text.length - 1);
  }
  return text;
}

export function prefixAfterWhitespace(prefix: string, text: string): string {
  if (text.charCodeAt(0) === WHITESPACE_CHAR_CODE) {
    text = removeLeadingWhitespaces(text);
    return ' ' + prefix + text;
  } else {
    return prefix + text;
  }
}

export function suffixBeforeWhitespace(text: string, suffix: string): string {
  if (text.charCodeAt(text.length - 1) === WHITESPACE_CHAR_CODE) {
    text = removeTrailingWhitespaces(text);
    return text + suffix + ' ';
  } else {
    return text + suffix;
  }
}

export function isListItemCharacter(text: string): boolean {
  if (text.length > 1) {
    return false;
  }
  const char = text.charAt(0);
  return char === '-' || char === '•' || char === '–';
}

export function isListItem(text: string): boolean {
  return /^[\s]*[-•–][\s].*$/g.test(text);
}

export function isNumberedListItem(text: string): boolean {
  return /^[\s]*[\d]*[.][\s].*$/g.test(text);
}

export function wordMatch(string1: string, string2: string): number {
  const arr1 = string1.toUpperCase().split(' ').filter(Boolean);
  const arr2 = string2.toUpperCase().split(' ').filter(Boolean);

  const uniq1: Record<string, true> = {};
  const uniq2: Record<string, true> = {};
  for (let i = 0; i < arr1.length; i++) {
    uniq1[arr1[i]] = true;
  }
  for (let i = 0; i < arr2.length; i++) {
    uniq2[arr2[i]] = true;
  }
  const keys1 = Object.keys(uniq1);
  const keys2 = Object.keys(uniq2);
  const denom = Math.max(keys1.length, keys2.length);
  if (denom === 0) return 0;
  let inter = 0;
  for (let i = 0; i < keys1.length; i++) {
    if (uniq2[keys1[i]]) inter++;
  }
  return inter / denom;
} 