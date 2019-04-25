import React from 'react';
import VirtualList from './virtual-list';

const items = [];
for (let i = 0; i < 1000; i++) {
    items.push('Row #' + i);
}
const itemHeight = 50;

class Item extends React.PureComponent {
    static itemStyle = {
        backgroundColor: '#cacaca',
        paddingLeft: 12,
        display: 'flex',
        alignItems: 'center',
        height: '100%'
    };

    render() {
        return (
            <div style={Item.itemStyle}>
                {items[this.props.index]}
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
