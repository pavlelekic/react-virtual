import React from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';


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
      console.log(e.srcElement.scrollTop);
      this.currentState = this.currentState.set('scrollTop', e.srcElement.scrollTop);
    }
  }

  calcContentWrapperStyle = memoize((itemHeight, itemsCount) => ({
    height: itemHeight * itemsCount,
    position: 'relative'
  }));

  renderVisibleItems() {
    const startIndex = Math.floor(this.state.renderedState.get('scrollTop') / this.props.itemHeight);
    const endIndex = startIndex + Math.ceil(this.props.height / this.props.itemHeight);
    const items = [];
    for (let i = startIndex; i < endIndex; i++) {
      items.push(
        <div key={i} style={{ position: 'absolute', top: i * this.props.itemHeight, height: this.props.itemHeight, width: '100%'}}>
          <this.props.ItemComponent index={i} />
        </div>
      );
    }

    return (
      <div style={this.calcContentWrapperStyle(
        this.props.itemHeight,
        this.props.itemsCount
      )}>
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
