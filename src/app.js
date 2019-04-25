import React from 'react';
import VirtualList from './VirtualList';

const items = new Array(1000).fill(true).map((v, i) => 'Row #' + i);
const itemHeight = 50;

class Item extends React.PureComponent {
    itemStyle = { backgroundColor: '#cacaca', padding: 5, height: '100%' };

    render() {
        return (
            <div style={this.itemStyle}>
                {this.props.index}
            </div>
        );
    }
}

const App = () => {
    return (
        <VirtualList
            itemsCount={items.length}
            height={500}
            itemHeight={itemHeight}
            ItemComponent={Item}
        />
    );
};

export default App;
