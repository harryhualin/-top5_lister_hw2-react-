import React from "react";
import EditToolbar from "./EditToolbar";
export default class Workspace extends React.Component {
    
    
    getItemIndex=(item)=>{
        if (this.props.currentList==null) return null;
        else for(let i=1;i<=5;i++)
        if(item===this.props.currentList.items[i-1]) return i;

    }
    render() {
        const{currentList}=this.props;
        let items =[];
        if (currentList!=null)  {items=currentList.items;}  
        return (
                <div id="top5-workspace">                 
                <div id="workspace-edit">
                    <EditToolbar />                    
                    <div id="edit-numbering">
                        <div className="item-number">1.</div>
                        <div className="item-number">2.</div>
                        <div className="item-number">3.</div>
                        <div className="item-number">4.</div>
                        <div className="item-number">5.</div>
                    </div>
                    <div id="edit-items">
                    { items.map((item)=>(
                          <div id={'item-'+this.getItemIndex(item)} class="top5-item"  > 
                          <span
                              id={"list-card-text-" +this.getItemIndex(item)}
                              className="list-card-text">
                             {item}
                          </span>
                            </div>
                    ))
                       
                    }
                    
                    </div>
                </div>
            </div>
        )
    }
}