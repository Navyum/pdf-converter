import React from 'react';
import Transformation from './Transformation.jsx';
import TextItem from '../TextItem';
import TextItemPageView from '../../components/debug/TextItemPageView';
import { REMOVED_ANNOTATION } from '../Annotation';

// Abstract class for transformations producing TextItem(s) to be shown in the TextItemPageView
export default class ToTextItemTransformation extends Transformation {

    constructor(name) {
        super(name, TextItem.name);
        if (this.constructor === ToTextItemTransformation) {
            throw new TypeError("Can not construct abstract class.");
        }
        this.showWhitespaces = false;
    }

    showModificationCheckbox() {
        return true;
    }

    createPageView(page, modificationsOnly) {
        return <TextItemPageView
                                 key={ page.index }
                                 page={ page }
                                 modificationsOnly={ modificationsOnly }
                                 showWhitespaces={ this.showWhitespaces } />;
    }

    completeTransform(parseResult) {
        // The usual cleanup
        parseResult.messages = [];
        parseResult.pages.forEach(page => {
            page.items = page.items.filter(item => !item.annotation || item.annotation !== REMOVED_ANNOTATION);
            page.items.forEach(item => item.annotation = null);
        });
        return parseResult;
    }


}