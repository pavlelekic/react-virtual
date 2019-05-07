import React from 'react';
import PropTypes from 'prop-types';
import './invisible-measurer.scss';

export default class InvisibleMeasurer extends React.PureComponent {
    render() {
        const { indexes } = this.props;
        const items = [];
        for (let i = 0; i < indexes.length; i++) {
            items.push(
                <div
                    key={i}
                    className="invisible-measurer__item-wrapper"
                    data-index={indexes[i]}
                >
                    <ItemComponent index={indexes[i]} />
                </div>
            );
        }

        return items;
        // return (
        //     <React.Fragment>
        //         {items}
        //     </React.Fragment>
        // );
    }
}

InvisibleMeasurer.propTypes = {
    ItemComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    indexes: PropTypes.arrayOf(PropTypes.number).isRequired
}

InvisibleMeasurer.defaultProps = {
};
