import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import InvisibleMeasurer from './invisible-measurer';
import VisibleItems from './visible-items';
import './virtual-list.scss';
/*
THE IDEA
- Measure items just before render (have a separate hidden pool for measuring items)
- Once Measured items can be rendered (use relative positioning against clip rect,
        not runway, so they stay on screen until new items are ready (measured) to be rendered)
- Use sentinels on top & bottom to shrink and expand the runway
*/

const UNDEFINED = -1;

export default class AdaptiveVirtualList extends React.PureComponent {
    didScroll = false;

    constructor(props) {
        super(props);

        this.estimatedNumItemsOnScreen = Math.ceil(props.height / props.itemHeight);
        const indexesOfItemsToCheckForHeight = [];
        for (let i = 0; i < this.estimatedNumItemsOnScreen; i++) {
            indexesOfItemsToCheckForHeight.push(i);
        }
        this.state = { scrollTop: 0, indexesOfItemsToCheckForHeight };
        const { itemsCount } = props;
        const itemHeights = [];
        for (let i = 0; i < itemsCount; i++) {
            itemHeights.push(UNDEFINED);
        }
        this.itemHeights = itemHeights;
        this.updateDom = this.updateDom.bind(this);
    }

    componentDidMount() {
        this.rafHandle = window.requestAnimationFrame(this.updateDom);
    }

    updateDom() {
        // determine which items to check for height
        let startIndexOfItemsToCheckForHeight;
        if (this.didScroll) {
            this.setState({ scrollTop: this.listWrapperRef.scrollTop });
            this.didScroll = false;
            // find approx next frame start index and set that for startIndexOfItemsToCheckForHeight, use polynomial approx
            startIndexOfItemsToCheckForHeight = this.itemHeights.indexOf(UNDEFINED, this.indexOfMeasuredItemsSoFar); // this is temporary
        } else {
            startIndexOfItemsToCheckForHeight = this.itemHeights.indexOf(UNDEFINED, this.indexOfMeasuredItemsSoFar);
            // this is approx, indexOfMeasuredItemsSoFar could be greather than this
            this.indexOfMeasuredItemsSoFar = Math.min(this.props.itemsCount - 1, this.indexOfMeasuredItemsSoFar + this.estimatedNumItemsOnScreen)
        }
        const indexesOfItemsToCheckForHeight = [];
        for (let i = startIndexOfItemsToCheckForHeight; i < this.props.itemsCount || indexesOfItemsToCheckForHeight.length !== this.estimatedNumItemsOnScreen; i++) {
            if (this.props.itemHeights[i] === UNDEFINED) {
                indexesOfItemsToCheckForHeight.push(i);
            }
        }

        if (indexesOfItemsToCheckForHeight.length > 0) {
            this.setState({ indexesOfItemsToCheckForHeight });
        }
        this.rafHandle = window.requestAnimationFrame(this.updateDom);
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.rafHandle);
    }

    calcListWrapperStyle = memoize((style, height) => ({
        ...style,
        height
    }));

    handleScroll = (event) => this.didScroll = true;

    calcContentWrapperStyle = memoize((estimatedItemHeight, itemsCount) => ({
        height: estimatedItemHeight * itemsCount
    }));

    saveListWrapperRef = (r) => this.listWrapperRef = r;

    renderRunway() {
        // currently I'm setting height, but in future I will use top & bottom sentinel
        // and make it a pure component
        const style = this.calcContentWrapperStyle(
            this.props.estimatedItemHeight,
            this.props.itemsCount
        );

        return (
            <div
                style={style}
                className="virtual-list__runway"
            />
        );
    }

    render() {
        return (
            <div
                className="virtual-list"
                ref={this.saveListWrapperRef}
                style={this.calcListWrapperStyle(this.props.style, this.props.height)}
                onScroll={this.handleScroll}
            >
                {this.renderRunway()}
                <InvisibleMeasurer
                    indexes={this.state.indexesOfItemsToCheckForHeight}
                    ItemComponent={this.props.ItemComponent}
                />
                <VisibleItems
                    ItemComponent={this.props.ItemComponent}
                    indexes={this.state.visibleItems}
                    itemHeights={this.state.itemHeights}
                    topOffset={this.state.topOffset}
                />
            </div>
        );
    }
}

AdaptiveVirtualList.propTypes = {
    style: PropTypes.object,
    height: PropTypes.number,
    estimatedItemHeight: PropTypes.number.isRequired,
    ItemComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    itemsCount: PropTypes.number.isRequired
}

AdaptiveVirtualList.defaultProps = {
    style: {},
    height: 500
};
