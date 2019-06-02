import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import './adaptive-virtual-list.scss';

export default class AdaptiveVirtualList extends React.PureComponent {
    didScroll = false;

    static UNDEFINED = -1;

    constructor(props) {
        super(props);
        this.state = { scrollTop: 0 };
        const { UNDEFINED } = AdaptiveVirtualList;
        const measuredItemHeights = [];
        const len = props.itemsCount;
        for (let i = 0; i < len; i++) {
            measuredItemHeights.push(UNDEFINED);
        }
        this.measuredItemHeights = measuredItemHeights;
        this.updateDom = this.updateDom.bind(this);
    }

    componentDidMount() {
        this.rafHandle = window.requestAnimationFrame(this.updateDom);
    }

    getSnapshotBeforeUpdate = () => this.listWrapperRef.scrollTop;

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot !== null) {
            this.listWrapperRef.scrollTop = snapshot;
        }
    }

    updateDom() {
        if (this.didScroll) {
            const items = this.listWrapperRef.childNodes;
            let el;
            for (let i = 1; i < items.length - 1; i++) { // skipping empty space divs
                el = items[i];
                this.measuredItemHeights[parseInt(el.dataset.index, 10)] = el.offsetHeight;
            }
            this.setState({ scrollTop: this.listWrapperRef.scrollTop });
            this.didScroll = false;
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

    handleScroll = () => this.didScroll = true;

    saveListWrapperRef = (r) => this.listWrapperRef = r;

    render() {
        const { itemsCount, ItemComponent, approxItemHeight } = this.props;
        const { scrollTop } = this.state;
        const { measuredItemHeights } = this;
        let heightSoFar = 0;
        let topEmptySpaceHeight = 0;
        let bottomEmptySpaceHeight = 0;
        let startIndex = 0;
        let itemHeight;
        const { UNDEFINED } = AdaptiveVirtualList;
        for (let i = 0; i < itemsCount; i++) {
            itemHeight = measuredItemHeights[i] === UNDEFINED
                ? approxItemHeight
                : measuredItemHeights[i];
            if (scrollTop > heightSoFar + itemHeight) {
                topEmptySpaceHeight += itemHeight;
                startIndex++;
            }
            heightSoFar += itemHeight;
        }
        const totalHeight = heightSoFar;
        const endIndex = Math.min(itemsCount - 1, startIndex + this.props.numOfItemsToRender);
        let renderedItemsHeight = 0;
        const items = [];
        let areAllRenderedItemsMeasured = true;
        for (let i = startIndex; i < endIndex; i++) {
            if (measuredItemHeights[i] === UNDEFINED) {
                renderedItemsHeight += approxItemHeight;
                areAllRenderedItemsMeasured = false;
            }
            else {
                renderedItemsHeight += measuredItemHeights[i];
            }
            items.push(<ItemComponent index={i} key={i - startIndex} />);
        }
        bottomEmptySpaceHeight = totalHeight - topEmptySpaceHeight - renderedItemsHeight;

        if (process.env.NODE_ENV !== 'production' && areAllRenderedItemsMeasured && renderedItemsHeight < this.props.height) {
            console.warn('You need to increase numOfItemsToRender, there is empty space on screen not covered with items!');
        }

        return (
          <div
            className="adaptive-virtual-list"
            ref={this.saveListWrapperRef}
            style={this.calcListWrapperStyle(this.props.style, this.props.height)}
            onScroll={this.handleScroll}
          >
            <div
                className="adaptive-virtual-list__empty-space"
                style={{ height: topEmptySpaceHeight }}
            />
            {items}
            <div
                style={{ height: bottomEmptySpaceHeight }}
                className="adaptive-virtual-list__empty-space"
            />
          </div>
        );
    }
}

AdaptiveVirtualList.propTypes = {
    style: PropTypes.object,
    height: PropTypes.number.isRequired,
    numOfItemsToRender: PropTypes.number.isRequired,
    approxItemHeight: PropTypes.number.isRequired,
    ItemComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    itemsCount: PropTypes.number.isRequired
}

AdaptiveVirtualList.defaultProps = {
    style: {}
};
