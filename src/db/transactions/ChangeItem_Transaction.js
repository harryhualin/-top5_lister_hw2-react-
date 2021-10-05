import App from "../../App.js";
import jsTPS_Transaction from "../../db/jsTPS.js"

/**
 * ChangeItem_Transaction
 * 
 * This class represents a transaction that updates the text
 * for a given item. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author Hua Lin
 */
export default class ChangeItem_Transaction extends jsTPS_Transaction {
    constructor(initApp, initIndex,initOldText, initNewText) {
        super();
        this.App = initApp;
        this.Index=initIndex;
        this.oldText = initOldText;
        this.newText = initNewText;
    }

    doTransaction() {
        this.App.changeItem(this.Index, this.newText);
    }
    
    undoTransaction() {
        this.App.changeItem(this.Index, this.oldText);
        
    }
}