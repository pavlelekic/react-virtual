import React from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import './virtual-list.scss';

export default class VirtualList extends React.PureComponent {
  currentState = Map({
    scrollTop: 0
  });

  constructor(props) {
    super(props);
    this.state = { renderedState: this.currentState };

    this.updateDom = this.updateDom.bind(this);
  }

  componentDidMount() {
    this.rafHandle = window.requestAnimationFrame(this.updateDom);
  }

  replaceCurrnetStateWithRenderedState = () => {
    this.currentState = this.state.renderedState;
  }

  updateDom() {
    if (this.state.renderedState !== this.currentState) {
      this.setState({ renderedState: this.currentState }, this.replaceCurrnetStateWithRenderedState);
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
    if (e) {
      this.currentState = this.currentState.set('scrollTop', e.srcElement.scrollTop);
    }
  }

  calcContentWrapperStyle = memoize((itemHeight, itemsCount) => ({
    height: itemHeight * itemsCount,
    position: 'relative'
  }));

  renderVisibleItems() {
    const { itemHeight, itemsCount, ItemComponent } = this.props;
    const startIndex = Math.floor(this.state.renderedState.get('scrollTop') / itemHeight);
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
  ItemComponent: PropTypes.node.isRequired,
  itemsCount: PropTypes.number.isRequired
}

VirtualList.defaultProps = {
  style: {}
};
