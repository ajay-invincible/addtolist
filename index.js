// imported function from firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// creating necessary variables
let inputEl = document.getElementById("input-field")
let buttonEl = document.getElementById("add-btn")
let logBoxEl = document.getElementById("log-box")
let listEl = document.getElementById("list-items") 
let notesEl =document.getElementById("notes")

const appSettings = {
    databaseURL : "https://realtime-database-971ba-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const itemsInDB = ref(database, "list")

// adding input to database when "Add to List" button is clicked
buttonEl.addEventListener("click", () => {
    let inputValue = inputEl.value
    if(inputValue) {
        push(itemsInDB, inputValue)
        clearInput()
    } else {
        errorLog(`Please write item name in the input field!`)
    }
})

// fetching input from database
onValue(itemsInDB, (items) => {
    if (items.exists()){
        let listItemsArray = Object.entries(items.val())
        clearListItems()
    
        for (let item of listItemsArray) {
            displayItemList(item)
        }
        errorLog("")
        displayNotes("^ Double-Click to delete items from list ^")
    } else {
        clearListItems()
        errorLog("No Items in the List!")
        displayNotes("")
    }

})

// clears the input field
function clearInput() {
    inputEl.value = ""
}

// fetches & displays list items from database
function displayItemList(itemName) {
    let itemID = itemName[0]
    let itemValue = itemName[1]
    let itemNode = document.createElement("li")

    itemNode.textContent = itemValue
    listEl.appendChild(itemNode)

    itemNode.addEventListener("dblclick", () => {
        let itemLocationInDB = ref(database, `list/${itemID}`)
        remove(itemLocationInDB)
    })
}

// logs the error message 
function errorLog(message) {
    logBoxEl.textContent = message
}

// clears the list from DOM
function clearListItems() {
    listEl.innerHTML = ""
}

// displays the notes for the user ease
function displayNotes(text) {
    notesEl.textContent = text;
}