import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import './adaptive-virtual-list.scss';

export default class AdaptiveVirtualList extends React.PureComponent {
    didScroll = false;

    constructor(props) {
        super(props);
        this.state = { scrollTop: 0 };
        this.itemHeights = [];
        for (let i = 0; i < props.itemsCount; i++) {
            this.itemHeights.push(props.approxItemHeight);
        }
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
                this.itemHeights[parseInt(el.dataset.index, 10)] = el.offsetHeight;
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

    handleScroll = (evt) => this.didScroll = true;

    saveListWrapperRef = (r) => this.listWrapperRef = r;

    renderVisibleItems() {
        const { itemsCount, ItemComponent, height } = this.props;
        const { scrollTop } = this.state;
        const { itemHeights } = this;
        let heightSoFar = 0;
        let topEmptySpaceHeight = 0;
        let bottomEmptySpaceHeight = 0;
        let startIndex = 0;
        let endIndex = itemsCount - 1;
        for (let i = 0; i < itemsCount; i++) {
            if (scrollTop > heightSoFar + itemHeights[i]) {
                topEmptySpaceHeight += itemHeights[i];
                startIndex++;
            } else if (heightSoFar - scrollTop < height) {
                endIndex = i;
            } else {
                bottomEmptySpaceHeight += itemHeights[i];
            }
            heightSoFar += itemHeights[i];
        }

        const items = [];
        for (let i = startIndex; i <= endIndex; i++) {
            items.push(
                <ItemComponent index={i} key={i - startIndex} />
            );
        }

        return (
            <React.Fragment>
                <div
                    className="adaptive-virtual-list__empty-space"
                    style={{ height: topEmptySpaceHeight }}
                />
                {items}
                <div
                    style={{ height: bottomEmptySpaceHeight }}
                    className="adaptive-virtual-list__empty-space"
                />
            </React.Fragment>
        );
    }

    render() {
        return (
            <div
                className="adaptive-virtual-list"
                ref={this.saveListWrapperRef}
                style={this.calcListWrapperStyle(this.props.style, this.props.height)}
                onScroll={this.handleScroll}
            >{this.renderVisibleItems()}</div>
        );
    }
}

AdaptiveVirtualList.propTypes = {
    style: PropTypes.object,
    height: PropTypes.number.isRequired,
    approxItemHeight: PropTypes.number.isRequired,
    ItemComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    itemsCount: PropTypes.number.isRequired
}

AdaptiveVirtualList.defaultProps = {
    style: {}
};
