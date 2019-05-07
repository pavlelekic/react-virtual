import React from 'react';
import PropTypes from 'prop-types';

export default class VisibleItems extends React.PureComponent {
    render() {
        const { indexes, topOffset, itemHeights } = this.props;
        let offset = topOffset;
        const items = [];
        let itemIndex;
        for (let i = 0; i < indexes.length; i++) {
            itemIndex = indexes[i];
            items.push(
                <div
                    key={i}
                    className="virtual-list__item-wrapper"
                    style={{ top: offset }}
                >
                    <ItemComponent itemIndex={itemIndex} />
                </div>
            );
            offset += itemHeights[itemIndex];
        }

        return items;
    }
}

VisibleItems.propTypes = {
    ItemComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    indexes: PropTypes.arrayOf(PropTypes.number).isRequired,
    itemHeights: PropTypes.arrayOf(PropTypes.number).isRequired,
    topOffset: PropTypes.number.isRequired
}

VisibleItems.defaultProps = {
};
