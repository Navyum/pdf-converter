import React from 'react';
import PropTypes from 'prop-types';
import FaFilePdfO from 'react-icons/lib/fa/file-pdf-o'

export default class AppLogo extends React.Component {

    static propTypes = {
        onClick: PropTypes.func,
    };

    constructor(props, context) {
        super(props, context);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        this.props.onClick(e);
    }



    render() {
        return (
            <a href="" onClick={ this.handleClick }>
              <FaFilePdfO/> PDF To Markdown</a>
            );
    }
}
