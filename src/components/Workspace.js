import React from "react";
import EditToolbar from "./EditToolbar";
import ItemCard from "./ItemCard";
export default class Workspace extends React.Component {
    
    getItemIndex=(item)=>{
        if (this.props.currentList==null) return null;
        for(let i=0;i<=this.props.currentList.items.length;i++)
        {if(item===this.props.currentList.items[i]) return i;
        }
    }
    render() {
        const{currentList,
            renameItemCallback,
            closeCurrentListCallback,
            moveItemCallback,
        }=this.props;
        let items =[];
        if (currentList!=null)  {items=currentList.items;}  
        return (
                <div id="top5-workspace">                 
                <div id="workspace-edit">
                    <EditToolbar close={closeCurrentListCallback}/>                    
                    <div id="edit-numbering">
                        <div className="item-number">1.</div>
                        <div className="item-number">2.</div>
                        <div className="item-number">3.</div>
                        <div className="item-number">4.</div>
                        <div className="item-number">5.</div>
                    </div>
                    <div id="edit-items">
                    { items.map((item)=>( 
                        <ItemCard 
                        currentList={this.currentList}
                        text={item}
                        index={this.getItemIndex(item)}
                        renameItemCallback={renameItemCallback}
                        moveItemCallback={moveItemCallback}
                        />
                        ))
                       
                    }
                    
                    </div>
                </div>
            </div>
        )
    }
}