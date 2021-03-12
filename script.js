const input = document.querySelector("form input");
const addBtn = input.nextElementSibling;
const delModal = document.querySelector(".delModal");
let backdrop = document.querySelector(".backdrop");
let delModalCancel = document.getElementById("cancelDelete")
let delModalConfirm = document.getElementById("confirmDelete");

let listLog = []

/** Replace existing content in search bar with empty string */
const clearText = () => input.value = "";

/**
 *  Create list element containing user generated content (string)
 *  and a unique ID. push object containing ID & string to listLog.
 *  @param {object} event Submit button event.
 */
const addList = (event) => {
    event.preventDefault();
    elementID = (Math.random().toString());
    const item = input.value;
    listItem = document.createElement("li");
    listItem.innerHTML = ` 
    <form class="checkboxForm">
        <label for${elementID}>
            <div class="liWrapper">
                <span>${item}</span>
                <input type="checkbox" id=${elementID}>
                <span class="tick"></span>
                <span class="delete ${elementID}">
                    <i class="fas fa-trash"></i>
                </span>
            </div>
        </label>
    </form>
    `
    const list = document.getElementById("items");
    list.append(listItem);
    listLog.push({todo:item, id:elementID});
    delElement = document.getElementsByClassName(elementID);
    delElement[0].addEventListener("click", displayModalContent.bind(null, elementID));
    clearText()
}

/** Display delete modal */
const addDeleteModal = () => {
    delModal.classList.remove("hidden");
    backdrop.classList.remove("hidden")
}

/**
 * Remove delete modal and reset default text.
 * @param {string} id Element ID for checkbox.
 */
const removeDeleteModal = (id) => {
    delModal.classList.add("hidden");
    backdrop.classList.add("hidden")
    pTag = document.querySelector(".delModal p");
    pTag.innerText = "Are you sure you want to delete "
    if (id) {
        // If delete is cancelled keep checkbox unchanged.
        // by reversing default behavior.
        let checkbox = document.getElementById(id);
        if (checkbox.checked == true) {
            checkbox.checked = false;
        } else {
            checkbox.checked = true;
        };
    };
};

/**
 * Iterate through listLog object until listLog
 * ID matches the parameter ID.
 * @param {string} id ID to be matched with ID in listLog
 * @returns {number} Index in listLog of matching ID. 
 */
const findIndex = (id) => {
    let index = 0;
    
    arrayLoop:
        for(const entry of listLog) {
            for (const key in entry){
                if (entry[key] === id) {
                    break arrayLoop;
                }
            }
            index ++;
        }
    return index;
}

/**
 * Add user input stored in listLog to delete-modal to 
 * display which item is to be deleted. Add event listeners
 * to buttons in model. 
 * @param {string} id ID for list element to be deleted.
 */
const displayModalContent = (id) => {

    addDeleteModal();
    const index = findIndex(id);

    const itemName = listLog[index]["todo"];
    const text = document.createTextNode('"' + itemName + '"');
    const pTag = document.querySelector(".delModal p");
    pTag.appendChild(text);
    // Add listener for confirm delete and cancel button.
    // Create new DOM object in order to delete event listener
    // associated with old DOM object. 
    delModalConfirm.replaceWith(delModalConfirm.cloneNode(true));
    delModalConfirm = document.getElementById("confirmDelete");
    delModalConfirm.addEventListener("click", deleteItem.bind(null, id));
    delModalCancel.replaceWith(delModalCancel.cloneNode(true));
    delModalCancel = document.getElementById("cancelDelete")
    delModalCancel.addEventListener("click", removeDeleteModal.bind(null, id))    
    backdrop.replaceWith(backdrop.cloneNode(true))
    backdrop = document.querySelector(".backdrop");
    backdrop.addEventListener("click", removeDeleteModal.bind(null, id));
}

/**
 * Remove list item from DOM and corresponding data from listLog. 
 * @param {string} id  ID for list element to be deleted. 
 */
const deleteItem = (id) => {   
    const index = findIndex(id);
    const item = document.getElementById(id).parentElement.parentElement.parentElement.parentElement;
    document.querySelector("ul").removeChild(item);
    listLog.splice(index, 1);
    removeDeleteModal();
};


addBtn.addEventListener("click", addList);
backdrop.addEventListener("click", removeDeleteModal);
delModalCancel.addEventListener("click", removeDeleteModal)
input.addEventListener("click", clearText)