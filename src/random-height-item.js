import React from 'react';
import loremIpsumText from './lorem-ipsum';

const alwaysIncluded = loremIpsumText.length * 0.1;
const randomFactor = loremIpsumText.length * 0.9;
export const items = [];
for (let i = 0; i < 1000; i++) {
    items.push(`Row #${i} ${loremIpsumText.substr(
        0,
        Math.floor(alwaysIncluded + Math.random() * randomFactor)
    )}`);
}

export default class RandomHeightItem extends React.PureComponent {
    static sharedStyle = {
        padding: '10px 20px',
        contain: 'layout', // add this to your component
        willChange: 'contents' // add this to your component
    };

    static oddItemStyle = {
        ...RandomHeightItem.sharedStyle,
        backgroundColor: '#aaaaaa'
    };

    static evenItemStyle = {
        ...RandomHeightItem.sharedStyle,
        backgroundColor: '#cacaca'
    };

    render() {
        const {index} = this.props;
        return (
            <div
                style={index % 2 === 0 ? RandomHeightItem.evenItemStyle : RandomHeightItem.oddItemStyle}
                data-index={index}
            >
                {items[index]}
            </div>
        );
    }
}
