import React from 'react';
import VirtualList from './virtual-list';
import AdaptiveVirtualList from './adaptive-virtual-list';
import FixedHeightItem, {items} from './fixed-height-item';
import RandomHeightItem, {items as randomHeightItems} from './random-height-item';

const App = () => {
    return (
        <div style={{ padding: 20 }}>
            <h2>Examples</h2>
            <h3>List with fixed item heights</h3>
            <VirtualList
                itemsCount={items.length}
                height={500}
                itemHeight={50}
                ItemComponent={FixedHeightItem}
            />
            <h3>List where item height adapts to its content height</h3>
            <AdaptiveVirtualList
                itemsCount={randomHeightItems.length}
                height={500}
                approxItemHeight={200}
                numOfItemsToRender={4}
                ItemComponent={RandomHeightItem}
            />
        </div>
    );
};

export default App;
