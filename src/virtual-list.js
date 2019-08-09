import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import './virtual-list.scss';

export default class VirtualList extends React.PureComponent {
  didScroll = false;

  constructor(props) {
    super(props);
    this.state = { scrollTop: 0 };

    this.updateDom = this.updateDom.bind(this);
  }

  componentDidMount() {
    this.rafHandle = window.requestAnimationFrame(this.updateDom);
  }

  updateDom() {
    if (this.didScroll) {
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

  calcContentWrapperStyle = memoize((itemHeight, itemsCount) => ({
    height: itemHeight * itemsCount
  }));

  saveListWrapperRef = (r) => this.listWrapperRef = r;

  renderVisibleItems() {
    const { itemHeight, itemsCount, ItemComponent } = this.props;
    const startIndex = Math.floor(this.state.scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(this.props.height / itemHeight) + 1,
      itemsCount
    );
    const items = [];
    for (let i = startIndex; i < endIndex; i++) {
      items.push(
        <div
          key={i - startIndex}
          className="virtual-list__item-wrapper"
          style={{ top: i * itemHeight, height: itemHeight}}
        >
          <ItemComponent index={i} />
        </div>
      );
    }

    return (
      <div
        style={this.calcContentWrapperStyle(itemHeight, itemsCount)}
        className="virtual-list__content-wrapper"
      >
        {items}
      </div>
    );
  }

  render() {
    return (
      <div
        className="virtual-list"
        ref={this.saveListWrapperRef}
        style={this.calcListWrapperStyle(this.props.style, this.props.height)}
        onScroll={this.handleScroll}
      >{this.renderVisibleItems()}</div>
    );
  }
}

VirtualList.propTypes = {
  style: PropTypes.object,
  height: PropTypes.number.isRequired,
  itemHeight: PropTypes.number.isRequired,
  ItemComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  itemsCount: PropTypes.number.isRequired
}

VirtualList.defaultProps = {
  style: {}
};
