import React from 'react';
import VirtualList from './VirtualList';

const items = new Array(1000).fill(true).map((v, i) => 'Row #' + i);
const itemHeight = 50;
const itemStyle = {backgroundColor: '#cacaca', padding: 5, margin: 3, height: itemHeight, width: '100%'};

const renderItem = (...args) => (
    <div style={itemStyle}>
        {JSON.stringify(args)}
    </div>
);

const App = () => {
    return (
        <VirtualList
            itemsCount={items.length}
            height={500}
            itemHeight={itemHeight}
            renderItem={renderItem}
        />
    );
};

export default App;
