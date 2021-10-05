 import React from "react";


export default class EditToolbar extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        this.props.updateToolbarButtons();
    }
    redo=()=>{
        this.props.redo();
        this.props.updateToolbarButtons();}
    undo=()=>{
        this.props.undo();
        this.props.updateToolbarButtons();}
    close=()=>{
        this.props.close();
        this.props.updateToolbarButtons();}
    
    render() {
        return (
            <div id="edit-toolbar">
                <div>
                <input 
                    type="button" 
                    id='undo-button' 
                    onClick={this.undo}    
                    className="top5-button"
                    className="disable"
                   
                    value="&#x21B6;"/>           
                </div>
                <div > 
                    <input 
                    type="button" 
                    id='redo-button'
                    onClick={this.redo}
                    className="top5-button"
                    className="disable"
                         
                    value="&#x21B7;"/>                    
                </div>
                <div > 
                    <input 
                    type="button" 
                    id='close-button'
                    onClick={this.close}
                    className="top5-button"
                    className="disable"
                  
                    value="&#x24E7;"/>                 
                </div>
                
            </div>
           
        ) 
    }
}