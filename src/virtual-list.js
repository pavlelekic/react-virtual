import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import './virtual-list.scss';

const UNDEFINED = -1;

export default class AdaptiveVirtualList extends React.PureComponent {
  didScroll = false;
  indexOfMeasuredItemsSoFar = 0;

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
    // collect item heights and update itemHeights arr!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11

    
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

  renderVisibleItems() {
    const { estimatedItemHeight, itemsCount, ItemComponent } = this.props;
    const startIndex = Math.floor(this.state.scrollTop / estimatedItemHeight);
    const endIndex = Math.min(
      startIndex + this.estimatedNumItemsOnScreen + 1,
      itemsCount
    );
    const items = [];
    for (let i = startIndex; i < endIndex; i++) {
      items.push(
        <div
          key={i - startIndex}
          className="virtual-list__item-wrapper"
          style={{ top: i * estimatedItemHeight, height: estimatedItemHeight}}
        >
          <ItemComponent index={i} />
        </div>
      );
    }

    return items;
  }

  renderItemsToFigureOutHeight() {
    const { estimatedItemHeight, itemsCount, ItemComponent } = this.props;
    const style = { top: 0 };
    for (let i = 0; i < this.state.indexesOfItemsToCheckForHeight.length; i++) {
      items.push(
        <div
          key={i}
          className="virtual-list__item-wrapper virtual-list__item-wrapper--hidden"
          style={style}
          data-index={this.state.indexesOfItemsToCheckForHeight[i]}
        >
          <ItemComponent index={this.state.indexesOfItemsToCheckForHeight[i]} />
        </div>
      );
    }

    return items;
  }

  // saveHiddenItemsRef = (r) => this.hiddenItemsRef = r;

  render() {
    return (
      <div
        className="virtual-list"
        ref={this.saveListWrapperRef}
        style={this.calcListWrapperStyle(this.props.style, this.props.height)}
        onScroll={this.handleScroll}
      >
        <div
          style={this.calcContentWrapperStyle(estimatedItemHeight, itemsCount)}
          className="virtual-list__content-wrapper"
        >
          {this.renderVisibleItems()}
          {this.renderItemsToFigureOutHeight()}
        </div>
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
