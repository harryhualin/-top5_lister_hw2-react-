 import React from "react";

export default class EditToolbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redoStack:this.props.redoStack,
            UndoStack:this.props.UndoStack,
        }
    }
    updateToolbarButtons() {
            if (!this.state.UndoStack) {
                this.disableButton("undo-button");
            }
            else {
                this.enableButton("undo-button");
            }   
            if (!this.state.redoStack) {
                this.disableButton("redo-button");
            }
            else {
                this.enableButton("redo-button");
            }   
            if(document.getElementById("top5-statusbar").innerHTML===""){
                this.disableButton("close-button") 
                this.enableButton("add-list-button");           
            }
            else {this.enableButton("close-button");this.disableButton("add-list-button");    
            }
            
        }
      
    render() {
       
        return (
            <div id="edit-toolbar">
                <div>
                <input 
                    type="button" 
                    id='undo-button' 
                    onClick={this.props.undo}
                    className="top5-button" 
                    value="&#x21B6;"/>           
                </div>
                <div > 
                    <input 
                    type="button" 
                    id='redo-button'
                    onClick={this.props.redo}
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