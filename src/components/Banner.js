import React from "react";


export default class Banner extends React.Component {
    render() {
        const { title} = this.props;
        return (
            <div id="top5-banner">
                {title}
                
            </div>
        );
    }
}