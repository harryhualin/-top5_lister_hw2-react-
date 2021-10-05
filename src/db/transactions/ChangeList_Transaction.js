import jsTPS_Transaction from "./src/db/jsTPS.js"

/**
 * ChangeItem_Transaction
 * 
 * This class represents a transaction that updates the text
 * for a given item. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author Hua Lin
 */
export default class ChangeList_Transaction extends jsTPS_Transaction {
    constructor(initModel,initId,initOldText, initNewText) {
        super();
        this.model = initModel;
        this.id=initId;
        this.oldText = initOldText;
        this.newText = initNewText;
    }

    doTransaction() {
       // this.model.changeList(this.id, this.newText);
    }
    
    undoTransaction() {
        //this.model.changeList(this.id, this.oldText);
    }
}