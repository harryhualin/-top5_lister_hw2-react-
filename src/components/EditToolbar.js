 import React from "react";

export default class EditToolbar extends React.Component {
    
    render() {
        return (
            <div id="edit-toolbar">
                <div>
                <input 
                    type="button" 
                    id='undo-button' 
                   // onClick={}
                    className="top5-button" 
                    value="&#x21B6;"/>           
                </div>
                <div > 
                    <input 
                    type="button" 
                    id='redo-button'
                   // onClick={}
                    className="top5-button"
                    value="&#x21B7;"/>                    
                </div>
                <div > 
                    <input 
                    type="button" 
                    id='close-button'
                    onClick={this.props.close}
                    className="top5-button"
                    value="&#x24E7;"/>                 
                </div>
            </div>
        )
    }
}