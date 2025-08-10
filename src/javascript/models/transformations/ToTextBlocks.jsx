import React from 'react';
import Transformation from './Transformation.jsx';
import TextPageView from '../../components/debug/TextPageView';
import { blockToText } from '../markdown/BlockType';
import ParseResult from '../ParseResult';

export default class ToTextBlocks extends Transformation {

    constructor() {
        super("To Text Blocks", "TextBlock");
    }

    createPageView(page, modificationsOnly) { // eslint-disable-line no-unused-vars
        return <TextPageView key={ page.index } page={ page } />;
    }

    transform(parseResult) {
        parseResult.pages.forEach(page => {
            const textItems = [];
            page.items.forEach(block => {
                //TODO category to type (before have no unknowns, have paragraph)
                const category = block.type ? block.type.name : 'Unknown';
                
                // 处理所有类型的块
                textItems.push({
                    category: category,
                    text: blockToText(block)
                });
            });
            page.items = textItems;
        });
        return new ParseResult({
            ...parseResult,
        });
    }

}