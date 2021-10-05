import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';
import jsTPS from './db/jsTPS';
import MoveItem_Transaction from './db/transactions/MoveItem_Transaction';
import ChangeItem_Transaction from'./db/transactions/ChangeItem_Transaction';
// THESE ARE OUR REACT COMPONENTS
import DeleteModal from './components/DeleteModal';
import Banner from './components/Banner.js';
import Sidebar from './components/Sidebar.js';
import Workspace from './components/Workspace.js';
import Statusbar from './components/Statusbar.js';

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();
        
        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();
        
        this.tps = new jsTPS();
        // SETUP THE INITIAL STATE
        this.state = {   
            currentList : null,
            keyNamePair : { "key": "", "name": "" },
            redoStack:[[]],
            undoStack:[[]],
            sessionData : loadedSessionData
        }

    }
    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = this.state.sessionData.nextKey;
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            items: ["?", "?", "?", "?", "?"]
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.setState(prevState => ({
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.tps.clearAllTransactions();
            this.updateToolbarButtons();
            this.db.mutationCreateList(newList);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            this.tps.clearAllTransactions();
            this.updateToolbarButtons();
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    addChangeItemTransaction = (index, newText) => {
        // GET THE CURRENT TEXT
        let oldText = this.state.currentList.items[index];
        let transaction = new ChangeItem_Transaction(this,index, oldText, newText);
        this.tps.addTransaction(transaction);
        this.updateToolbarButtons();
    }  

    changeItem = (index,newText) => {  
        let newCurrentList = this.state.currentList;
            newCurrentList.items[index]= newText;
          this.setState(prevState => ({
            currentList: newCurrentList,
            
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let key= this.state.currentList.key;
            let list = this.db.queryGetList(key);
            list.items[index] = newText;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    // this function move item
    addMoveItemTransaction = (oldItemIndex, newItemIndex) => {
        let transaction = new MoveItem_Transaction(this, oldItemIndex, newItemIndex);
        this.tps.addTransaction(transaction);
        this.updateToolbarButtons();       
       
    }  
    moveItem=(oldIndex,newIndex)=>{      
        let newCurrentList = this.state.currentList;
        newCurrentList.items.splice(newIndex, 0, newCurrentList.items.splice(oldIndex, 1)[0]);
        this.setState({
        currentList: newCurrentList,
    }, () => {  
        this.db.mutationUpdateList(this.state.currentList);
        this.db.mutationUpdateSessionData(this.state.sessionData);
    });
             
    }
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        let newCurrentList = this.db.queryGetList(key);
        this.setState(prevState => ({
            currentList: newCurrentList,
            sessionData: prevState.sessionData
        }), () => {
               this.tps.clearAllTransactions();    
                this.updateToolbarButtons(); 
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.setState(prevState => ({
            currentList: null,
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            sessionData: this.state.sessionData
        }), () => {
            this.updateToolbarButtons(); 
            this.tps.clearAllTransactions();
        });
    }
    deleteList = (KeyNamePair) => {
        // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
        // WHICH LIST IT IS THAT THE USER WANTS TO
        // DELETE AND MAKE THAT CONNECTION SO THAT THE
        // NAME PROPERLY DISPLAYS INSIDE THE MODAL   
        this.setState({
            keyNamePair:KeyNamePair
        })
        this.showDeleteListModal();
    }

    deleteConfirm=(keyNamePair)=>{
        this.db.deleteList(keyNamePair.key);
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        let index=null;
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            if (newKeyNamePairs[i]===keyNamePair) index=i;
        }  
        if (newKeyNamePairs.length===1||index===0) {newKeyNamePairs.shift();}
        else if (index) newKeyNamePairs.splice(index,1);       
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = null;
    
        this.setState(prevState => ({
            currentList: currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            this.tps.clearAllTransactions();
            this.updateToolbarButtons();
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });

    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }

    undoAction=()=>{
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
        }
    }
    redoAction=()=>{
        if(this.tps.hasTransactionToRedo()){
            this.tps.doTransaction();
           
        }
    }
    updateToolbarButtons=()=> {
        if (!this.tps.hasTransactionToUndo()) {
            this.disableButton("undo-button");
        }
        else {
            this.enableButton("undo-button");
        }   
        if (!this.tps.hasTransactionToRedo()) {
            this.disableButton("redo-button");
        }
        else {
            this.enableButton("redo-button");
        }   
        if(this.state.currentList==null){
            this.disableButton("close-button") 
            this.enableButton("add-list-button");           
        }
        else {this.enableButton("close-button");
            this.disableButton("add-list-button");    
        }
        
    }
  
    disableButton=(id)=> {
        let button = document.getElementById(id);
        button.classList.add("disabled");
        document.getElementById(id).disabled=true;
    }
    enableButton=(id)=> {
        let button = document.getElementById(id);
        button.classList.remove("disabled");
        document.getElementById(id).disabled=false ;
    }

    render() {
        return (
            <div id="app-root">
                <Banner 
                    title='Top 5 Lister'
                    closeCallback={this.closeCurrentList} />
                <Sidebar
                    heading='Your Lists'
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    createNewListCallback={this.createNewList}
                    deleteListCallback={this.deleteList}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                   
                />
                <Workspace
                    currentList={this.state.currentList} 
                    renameItemCallback ={this.addChangeItemTransaction}
                    closeCurrentListCallback={this.closeCurrentList}
                    redoActionCallback={this.redoAction}
                    undoActionCallback={this.undoAction}
                    moveItemCallback={this.addMoveItemTransaction} 
                    Transaction={this.tps}
                    updateToolbarButtons={this.updateToolbarButtons}
                    />
                <Statusbar 
                    currentList={this.state.currentList} />
                <DeleteModal
                    listKeyPair={this.state.keyNamePair}
                    deleteConfirmCallback={this.deleteConfirm}
                    hideDeleteListModalCallback={this.hideDeleteListModal}

                />
            </div>
        );
    }
}

export default App;
