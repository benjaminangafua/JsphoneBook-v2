/**
 * Use querySelector to get DOM elements
 * 
 * @param {String} selector - Select a DOM content
 * @returns DOM Content
 */

const querySelector = (selector) => document.querySelector(selector);
const querySelectorAll = (selectorAll) => document.querySelectorAll(selectorAll);
const displayNoneForAll = elem => elem.forEach(ele => ele.style.display = "none");

const contact_list = querySelector(".contact-list");
const search_field = querySelector("#search-input");
const contact_block = querySelector(".contact_block");
const displayContactForm = querySelector(".contact-display");
const viewContact = querySelector(".vewContact");
const form = querySelector("form");
const imgGenerator = querySelector(".prfImg"),
    imgFile = querySelector("input[type='file']");
const saveBtn = querySelector(".save");

const genderVal = document.getElementsByName("gender");
const struct = querySelectorAll(".input");

let setTime;
let openSearchField = false;

// Create contact
const phoneBook = [{
    username: "",
    phone: "",
    gender: "",
    img: ""
}];

/**
 * Get the user profile image URL
 * 
 * @returns return profile image
 */
const displayImg = () => (imgGenerator.innerHTML = imgFile.files[0] != undefined ?
    `<img src="${URL.createObjectURL(imgFile.files[0])}"/>` : "");

(() => {
    imgFile.style.display = "none";
    imgGenerator.addEventListener("click", () => {
        imgFile.click();
        imgFile.before(setTimeout(displayImg, 10000));
    })
})();

/**
 * Save Contact
 * 
 * @param {object} event - Get user input to saving it into phoneBook Object
 */
saveBtn.onclick = (event) => {
    validateForm()
        // get user's uploaded image 
    checkForImage()
    confirmToSave()
    emptyContactForm()
}

/**
 * Convert image file to base64 before storing it into phoneBook Object
 */

function checkForImage() {
    if (imgFile.files[0] != undefined) {
        const reader = new FileReader();
        // convert image file to base64 
        reader.addEventListener("load", () => phoneBook[0].img = reader.result, false);
        if (imgFile.files[0]) reader.readAsDataURL(imgFile.files[0]);
    }
}


/**
 * Require form contents
 */
const requiredFile = function() {
    for (let i = 0; i < arguments.length; i++)
        arguments[i].required = true
}

/**
 * Validate form then store it into phoneBook Object
 * 
 * @returns Object of phoneBook
 */
function validateForm() {
    const [username, phone] = struct;
    requiredFile(imgFile, username, phone);

    if (phone.value == "" || username.value == "") return false;

    phoneBook[0].phone = phone.value;
    phoneBook[0].username = username.value;
    genderVal.forEach((ele) => { if (ele.checked == true) phoneBook[0].gender = ele.value });
}

/**
 * Confirm the form's content before storing into phoneBook
 */
function confirmToSave() {
    const correct = confirm("By clicking 'Ok' this contact will be saved!")
    if (localStorage.getItem("contact") == null) {
        correct ?
            localStorage.setItem("contact", JSON.stringify(phoneBook)) :
            console.log("Contact was not save!")
    } else {
        const newItem = JSON.parse(localStorage.getItem("contact"))
        newItem.push(phoneBook[0])
        correct ?
            localStorage.setItem("contact", JSON.stringify(newItem)) :
            console.log("Contact was not save!")
    }
}

/**
 * Empty contact form after submitting
 */
function emptyContactForm() {
    struct[0].value = genderVal[0].value = struct[1].value = genderVal[1].value = ""
    genderVal[0].checked = genderVal[1].checked = false
}

/**
 * Get all data from localStorage
 */
const book = JSON.parse(localStorage.getItem("contact"))
contactBookUp(book)

/**
 * Check if contacts exist in localStorage
 * 
 * @param {Array} book_param - Ensuring localStorage is not null
 */
function contactBookUp(book_param) {
    if (book_param != null) book_param.forEach(ele => displayContact(ele));
}

/**
 * Display contacts
 * 
 * @param {Object} ele - DOM to display
 */
function displayContact(ele) {
    contact_list.innerHTML +=
        `<div class="grid">
        <div><img src="${ele.img}"/></div>
        <div>${ele.username}</div>
        <div>${ele.phone}</div>
        <div class="edit">Edit</div>
        <div class="saveEdit">Save</div>
        <div class="delete">Delete</div>
    </div>`
        // Select contact elements
    const rows = querySelectorAll(".grid")
    const deleteElement = querySelectorAll(".delete")
    getContactColumns(rows)
    displayNoneForAll(querySelectorAll(".saveEdit"));
    edit(querySelectorAll(".edit"), rows)
    deleteContact(deleteElement)
}

/**
 * Delete Contact
 * 
 * @param {Object} del - Delete a contact from the list of contacts
 */
function deleteContact(del) {
    const newBook = []
    del.forEach(ele => ele.onclick = (event) => {
        const name = event.target.parentElement.children[1].firstChild == null ? null : event.target.parentElement.children[1].firstChild.data
        for (let key in book) {
            if (book[key].username == name) {
                contact_list.innerHTML = ""
                continue
            }
            newBook.push(book[key])
        }
        localStorage.setItem("contact", JSON.stringify(newBook))
        contactBookUp(JSON.parse(localStorage.getItem("contact")))
    })
}

/**
 * 
 * @param {*} getSearchIcon - Open search bar if not open
 */
// Open search bar
function __(getSearchIcon) {
    getSearchIcon.onclick = () => {
        if (!openSearchField) openSearch()
    }
}

/**
 * Using Escape key to close search
 */
const keyClickEvent = function() {
    document.onkeydown = (event) => {
        if (openSearchField) {
            if (event.keyCode == 27) closeSearch()
        }
        if (!openSearchField) {
            if (event.keyCode == 83) openSearch()
        }
    }
}

/**
 * Open search bar
 */
const openSearch = function() {
    search_field.value = "";
    search_field.style.display = "grid";
    openSearchField = true;
}

/**
 * Close search bar
 */
const closeSearch = function() {
    search_field.value = "";
    search_field.style.display = "none";
    openSearchField = false;
}

/**
 * Search for a contact
 * 
 * @param {*} ele - Search for phone number and name  
 */
search_field.onkeyup = (ele) => {
    ele.target.focus = true;
    contact_list.innerHTML = "";
    clearTimeout(setTime);
    const targetValue = (ele.target.value).toLowerCase().trim();
    setTime = setTimeout(function() {
        if (book != null) {
            book.forEach(element => {
                if (element.username.toLowerCase().includes(targetValue) ||
                    element.phone.toLowerCase().includes(targetValue)) {
                    displayContact(element);
                }
            });
        }
    }, 1000)
}

contact_block.onclick = (event) => {
    form.style.display = "none";
    displayContactForm.style.display = "grid";

    const searchIcon = document.createElement("img");
    searchIcon.setAttribute("src", "./img/search.png");
    searchIcon.setAttribute("id", "searchIcon");

    viewContact.insertAdjacentElement("beforebegin", searchIcon);
    __(searchIcon);
    keyClickEvent();
}

/**
 * Edit Contact
 * 
 * @param {*} event - Event to fire for a contact to be edited
 * @param {*} rows - A contact row to edit
 */
function edit(event, rows) {
    event.forEach(elem => {
        elem.addEventListener("click", (eve) => {
            eve.target.parentElement.children[4].style.display = "grid";
            const save_edit = eve.target.parentElement.children[4];
            getContactColumns(rows);
            const current_version = eve.target.parentElement.children;
            for (let i = 1; i < 3; i++) current_version[i].contentEditable = true;
            elem.style.display = "none";
            saveEdit(elem, save_edit, current_version, current_version[1].innerText);
        })

    })
}

/**
 * Get Update Local Storage
 * 
 * @param {*} edit - Edit button displays after save
 * @param {*} save_edit - Save button that fires to store the edited content
 * @param {*} current_version - This returns the editable content from the edit function
 * @param {*} current_version_name - The name to check against in the localStorage in order to specify a row to affect
 */
function saveEdit(edit, save_edit, current_version, current_version_name) {
    const newItem = JSON.parse(localStorage.getItem("contact"));
    const update = [];
    save_edit.addEventListener("click", () => {

        for (let i = 1; i < 3; i++) update[i - 1] = current_version[i].innerText;

        for (let i = 0; i < newItem.length; i++) {
            if (newItem[i].username == current_version_name) {
                newItem[i].username = update[0];
                newItem[i].phone = update[1];
            }
        }

        localStorage.setItem("contact", JSON.stringify(newItem));
        save_edit.style.display = "none";
        edit.style.display = "grid";

        for (let i = 1; i < 3; i++) current_version[i].contentEditable = false;

    })
}

/**
 * 
 * @param {*} columns -  Split the columns base on the number of columns present
 */
function getContactColumns(columns) {
    for (let i = 0; i < columns.length; i++) columns[i].style = `grid-template-columns: repeat(${columns[i].children.length}, 1fr);`;
}