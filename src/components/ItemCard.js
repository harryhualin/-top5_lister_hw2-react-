import React from "react";

export default class ItemCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text:this.props.text,
            index:this.props.index,
            editActive: false,
        }
    }
    handleClick = (event) => {
       
        if (event.detail === 2) {
            this.handleToggleEdit(event);
        }
    }
    handleToggleEdit = (event) => {       
        this.setState({
            editActive: !this.state.editActive,
        });
    }
    handleUpdate = (event) => {
        this.setState({ text: event.target.value });
    }
    handleKeyPress = (event) => {
        if (event.code === "Enter") {
            this.handleBlur();
        }
    }
    handleBlur = () => {
        let textValue = this.state.text;
        let index = this.state.index;
        console.log("ListCard handleBlur: " + textValue);
        this.props.renameItemCallback(index, textValue);
        this.handleToggleEdit();
    }

    onDragStart=(ev)=>{
        ev.dataTransfer.setData("text", ev.target.id);
       
    };
    onDragOver=(ev)=>{ 
        ev.preventDefault();
        ev.target.classList.add("top5-item-dragged-to");
    }
    onDragLeave=(ev)=>{
        ev.target.classList.remove("top5-item-dragged-to");

    }
    onDrop=(event)=>{
        event.target.classList.remove("top5-item-dragged-to")
        event.preventDefault();
        let data=event.dataTransfer.getData("text");
        let oldItemIndex=data.substring("item-".length);; 
        this.props.moveItemCallback(oldItemIndex,this.state.index)                      
    };
render(){
        const {text,index} = this.props;    
        if (this.state.editActive) {
            return (
                <input
                    id={"item-" + index}
                    class='top5-item'
                    type='text'
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    onChange={this.handleUpdate}
                    defaultValue={text}
                />)
        }  

        return(    
            <div id={'item-'+index} 
                    className="top5-item" 
                    onClick={this.handleClick} 
                    draggable="true" 
                    onDrop={this.onDrop} 
                    onDragStart={this.onDragStart}
                    onDragOver={this.onDragOver}
                    onDragLeave={this.onDragLeave}
                    > 
                    {text}
        
            </div>)

}
}