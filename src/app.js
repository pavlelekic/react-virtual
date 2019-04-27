import React from 'react';
import VirtualList from './virtual-list';

const items = [];
for (let i = 0; i < 1000; i++) {
    items.push('Row #' + i);
}

class Item extends React.PureComponent {
    static sharedStyle = {
        paddingLeft: 12,
        display: 'flex',
        alignItems: 'center',
        height: '100%'
    };

    static oddItemStyle = {
        ...Item.sharedStyle,
        backgroundColor: '#aaaaaa'
    };

    static evenItemStyle = {
        ...Item.sharedStyle,
        backgroundColor: '#cacaca'
    };

    render() {
        return (
            <div style={this.props.index % 2 === 0 ? Item.evenItemStyle : Item.oddItemStyle}>
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
            itemHeight={50}
            ItemComponent={Item}
        />
    );
};

export default App;
