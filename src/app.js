import React from 'react';
import VirtualList from './virtual-list';

const items = [];
for (let i = 0; i < 1000; i++) {
    items.push({
        text: 'Row #' + i,
        height: Math.floor(300 * Math.random()) + 50
    });
}

class Item extends React.PureComponent {
    render() {
        const { index } = this.props; 
        const item = items[index];
        const style = {
            paddingLeft: 12,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: index % 2 === 0 ? '#cacaca' : '#aaaaaa',
            height: item.height
        }
        return (
            <div style={style}>
                {item.text}
            </div>
        );
    }
}

const App = () => {
    return (
        <VirtualList
            itemsCount={items.length}
            height={500}
            ItemComponent={Item}
        />
    );
};

export default App;
