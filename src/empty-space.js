import React from 'react';
import PropTypes from 'prop-types';
import './adaptive-virtual-list.scss';

export default class EmptySpace extends React.Component {
    shouldComponentUpdate(nextProps) {
        this.divRef.style.height = `${nextProps.height}px`;
        return false;
    }

    saveRef = (r) => {
      this.divRef = r;
    }

    render() {
        return (
            <div
                ref={this.saveRef}
                className="adaptive-virtual-list__empty-space"
                style={{ height: this.props.height }}
            />
        );
    }
}

EmptySpace.propTypes = {
    height: PropTypes.number.isRequired
}
