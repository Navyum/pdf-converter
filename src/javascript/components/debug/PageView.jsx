import React from 'react';
import PropTypes from 'prop-types';

// Abstract view for a Page
export default class PageView extends React.Component {

    static propTypes = {
        page: PropTypes.object.isRequired,
        modificationsOnly: PropTypes.bool,
        showWhitespaces: PropTypes.bool
    };

    createItemViews(items, showWhitespaces) { // eslint-disable-line no-unused-vars
        throw new TypeError("Do not call abstract method foo from child.");
    }

    render() {
        const {page, modificationsOnly, showWhitespaces} = this.props;

        var items = page.items;
        if (modificationsOnly) {
            items = items.filter(block => block.annotation);
        }


        var content;
        if (items.length == 0 && modificationsOnly) {
            content = <div/>
        } else {
            const itemViews = this.createItemViews(items, showWhitespaces);
            const header = "Page " + (page.index + 1);
            content = <div>
                        <h2 id={ header }>{ header }</h2>
                        <hr/>
                        { itemViews }
                      </div>
        }
        return (
            content
        );
    }
}