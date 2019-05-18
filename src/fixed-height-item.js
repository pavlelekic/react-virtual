import React from 'react';

export const items = [];
for (let i = 0; i < 1000; i++) {
    items.push('Row #' + i);
}

export default class FixedHeightItem extends React.PureComponent {
    static sharedStyle = {
        paddingLeft: 12,
        display: 'flex',
        alignItems: 'center',
        height: '100%'
    };

    static oddItemStyle = {
        ...FixedHeightItem.sharedStyle,
        backgroundColor: '#aaaaaa'
    };

    static evenItemStyle = {
        ...FixedHeightItem.sharedStyle,
        backgroundColor: '#cacaca'
    };

    render() {
        return (
            <div style={this.props.index % 2 === 0 ? FixedHeightItem.evenItemStyle : FixedHeightItem.oddItemStyle}>
                {items[this.props.index]}
            </div>
        );
    }
}
