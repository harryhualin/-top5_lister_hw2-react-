import App from "../../App.js";
import jsTPS_Transaction from "../../db/jsTPS.js"
/**
 * MoveItem_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author Hua Lin
 */
export default class MoveItem_Transaction extends jsTPS_Transaction{
    constructor(app, initOld, initNew) {
        super();
        this.App = app;
        this.oldItemIndex = initOld;
        this.newItemIndex = initNew;
    }

    /*doTransaction() {
        this.model.getList(this.model.getListIndex(this.id)).moveItem(this.oldItemIndex, this.newItemIndex);
    }
    
    undoTransaction() {
        this.model.getList(this.model.getListIndex(this.id)).moveItem(this.newItemIndex, this.oldItemIndex);
        
    }*/

    doTransaction() {
        this.App.moveItem(this.oldItemIndex, this.newItemIndex);
    }
    
    undoTransaction() {
        this.App.moveItem(this.newItemIndex, this.oldItemIndex);
    }
}