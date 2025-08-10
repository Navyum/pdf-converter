import { linesToText } from './WordType.jsx';

// Plain object replacement for enumify-based BlockType
const BlockType = {};

function def(name, config) {
  BlockType[name] = { name, ...config };
}

def('H1', {
  headline: true,
  headlineLevel: 1,
  toText(block) {
    return '# ' + linesToText(block.items, true);
  }
});

def('H2', {
  headline: true,
  headlineLevel: 2,
  toText(block) {
    return '## ' + linesToText(block.items, true);
  }
});

def('H3', {
  headline: true,
  headlineLevel: 3,
  toText(block) {
    return '### ' + linesToText(block.items, true);
  }
});

def('H4', {
  headline: true,
  headlineLevel: 4,
  toText(block) {
    return '#### ' + linesToText(block.items, true);
  }
});

def('H5', {
  headline: true,
  headlineLevel: 5,
  toText(block) {
    return '##### ' + linesToText(block.items, true);
  }
});

def('H6', {
  headline: true,
  headlineLevel: 6,
  toText(block) {
    return '###### ' + linesToText(block.items, true);
  }
});

def('TOC', {
  mergeToBlock: true,
  toText(block) {
    return linesToText(block.items, true);
  }
});

def('FOOTNOTES', {
  mergeToBlock: true,
  mergeFollowingNonTypedItems: true,
  toText(block) {
    return linesToText(block.items, false);
  }
});

def('CODE', {
  mergeToBlock: true,
  toText(block) {
    return '```\n' + linesToText(block.items, true) + '```';
  }
});

def('LIST', {
  mergeToBlock: true,
  mergeFollowingNonTypedItemsWithSmallDistance: true,
  toText(block) {
    return linesToText(block.items, false);
  }
});

def('PARAGRAPH', {
  toText(block) {
    return linesToText(block.items, false);
  }
});

def('IMAGE', {
  toText(block) {
    return '[Image]';
  }
});

export function isHeadline(type) {
  return type && type.name && type.name.length === 2 && type.name[0] === 'H';
}

export function blockToText(block) {
  if (!block.type) {
    return linesToText(block.items, false);
  }
  return block.type.toText(block);
}

export function headlineByLevel(level) {
  if (level === 1) return BlockType.H1;
  if (level === 2) return BlockType.H2;
  if (level === 3) return BlockType.H3;
  if (level === 4) return BlockType.H4;
  if (level === 5) return BlockType.H5;
  if (level === 6) return BlockType.H6;
  throw 'Unsupported headline level: ' + level + ' (supported are 1-6)';
}

export default BlockType;