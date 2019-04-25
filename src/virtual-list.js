import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import './virtual-list.scss';

export default class VirtualList extends React.PureComponent {
  scrollTop = 0;

  constructor(props) {
    super(props);
    this.state = { scrollTop: this.scrollTop };

    this.updateDom = this.updateDom.bind(this);
  }

  componentDidMount() {
    this.rafHandle = window.requestAnimationFrame(this.updateDom);
  }

  updateDom() {
    if (this.state.scrollTop !== this.scrollTop) {
      this.setState({ scrollTop: this.scrollTop });
    }
    window.requestAnimationFrame(this.updateDom);
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.rafHandle);
  }

  calcListWrapperStyle = memoize((style, height) => ({
    ...style,
    height,
    overflowY: 'scroll'
  }));

  handleScroll = (event) => {
    const e = event.nativeEvent;
    // if (e) {
      this.scrollTop = e.srcElement.scrollTop;
    // }
  }

  calcContentWrapperStyle = memoize((itemHeight, itemsCount) => ({
    height: itemHeight * itemsCount,
    position: 'relative'
  }));

  renderVisibleItems() {
    const { itemHeight, itemsCount, ItemComponent } = this.props;
    const startIndex = Math.floor(this.state.scrollTop / itemHeight);
    const numVisibleItems = Math.ceil(this.props.height / itemHeight);
    const endIndex = Math.min(startIndex + numVisibleItems, itemsCount);
    const items = [];
    for (let i = startIndex; i < endIndex; i++) {
      items.push(
        <div key={i} className="virtual-list__item-wrapper" style={{ top: i * itemHeight, height: itemHeight}}>
          <ItemComponent index={i} />
        </div>
      );
    }

    return (
      <div style={this.calcContentWrapperStyle(itemHeight, itemsCount)}>
        {items}
      </div>
    );
  }

  render() {
    return (
      <div
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
