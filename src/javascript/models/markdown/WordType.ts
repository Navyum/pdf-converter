export const WordType = {
  NORMAL: 'normal',
  HEADER: 'header',
  LIST_ITEM: 'list_item',
  CODE: 'code',
  QUOTE: 'quote',
  LINK: 'link',
  FOOTNOTE_LINK: 'footnote_link',
  FOOTNOTE: 'footnote'
} as const;

export type WordType = typeof WordType[keyof typeof WordType];

export default WordType; 