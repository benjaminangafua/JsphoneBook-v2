    // Display contact
    const contact_list = document.querySelector(".contact-list")
    const search_field = document.querySelector("#search-input")
    const contact_block = document.querySelector(".contact_block")
    const displayContactForm = document.querySelector(".contact-display")
    const viewContact = document.querySelector(".vewContact")
    const form = document.querySelector("form");
    const imgGenerator = document.querySelector(".prfImg"),
        imgFile = document.querySelector("input[type='file']")
    const genderVal = document.getElementsByName("gender")
    const saveBtn = document.querySelector(".save")
    const struct = document.querySelectorAll(".input")

    let setTime;
    let openSearchField = false

    // Create contact
    const phoneBook = [{
        username: "",
        phone: "",
        gender: "",
        img: ""
    }]

    const displayImg = () => (imgGenerator.innerHTML = imgFile.files[0] != undefined ?

        `<img src="${URL.createObjectURL(imgFile.files[0])}"/>` : "")
    imgFile.style.display = "none"
    imgGenerator.addEventListener("click", () => {
        imgFile.click()
        imgFile.before(setTimeout(displayImg, 10000))
    })

    // Save Contact
    saveBtn.onclick = e => {
        validateForm()
            // get user's uploaded image 
        checkForImage()
        confirmToSave()
        emptyContactForm()
    }

    function checkForImage() {
        if (imgFile.files[0] != undefined) {
            const reader = new FileReader();

            // convert image file to base64 
            reader.addEventListener("load", () => phoneBook[0].img = reader.result, false);

            if (imgFile.files[0]) {
                reader.readAsDataURL(imgFile.files[0]);
            }
        }
    }

    // Validate form contents before storing

    const requiredFile = function() {
        for (let i = 0; i < arguments.length; i++)
            arguments[i].required = true
    }

    function validateForm() {
        const [username, phone] = struct
        requiredFile(imgFile, username, phone)

        if (phone.value == "" || username.value == "") {
            return false
        }
        phoneBook[0].phone = phone.value
        phoneBook[0].username = username.value

        genderVal.forEach((ele) => {
            if (ele.checked == true) phoneBook[0].gender = ele.value
        })

    }

    function confirmToSave() {

        const correct = confirm("By clicking 'Ok' this contact will be saved!")
        if (localStorage.getItem("contact") == null) {
            correct ?
                localStorage.setItem("contact", JSON.stringify(phoneBook)) :
                console.log("Contact was not save")
        } else {
            const newItem = JSON.parse(localStorage.getItem("contact"))
            newItem.push(phoneBook[0])
            correct ?
                localStorage.setItem("contact", JSON.stringify(newItem)) :
                console.log("Contact was not save")
        }
    }

    function emptyContactForm() {

        struct[0].value = genderVal[0].value = struct[1].value =
            genderVal[1].value = ""
        genderVal[0].checked = genderVal[1].checked = false
    }

    const book = JSON.parse(localStorage.getItem("contact"))
    contactBookUp(book)

    function contactBookUp(book) {
        // Check if contacts exist in localStorage
        if (book != null) {
            book.forEach(ele => {
                displayContact(ele)
            });
        }
    }

    // Delete Contact
    function deleteContact(del, element) {
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
    // Display contacts
    function displayContact(ele) {
        contact_list.innerHTML +=
            `
        <div class="grid">
            <div><img src="${ele.img}"/></div>
            <div>${ele.username}</div>
            <div>${ele.phone}</div>
            <div class="edit">Edit</div>
            <div class="saveEdit">Save</div>
            <div class="delete">Delete</div>
        </div>
    `
            // Select contact elements
        const rows = document.querySelectorAll(".grid")
        const deleteElement = document.querySelectorAll(".delete")
        getContactRow(rows)
        displayNoneForAll(document.querySelectorAll(".saveEdit"));
        edit(document.querySelectorAll(".edit"), rows)
        deleteContact(deleteElement, ele)
    }

    // Open search bar
    function __(getSearchIcon) {
        getSearchIcon.onclick = () => {
            if (!openSearchField) {
                openSearch()
            }
        }
    }

    // Using Escape key to close search
    const keyClickEvent = function() {
        document.onkeydown = (event) => {
            if (openSearchField) {
                if (event.keyCode == 27) {
                    closeSearch()
                }
            }
            if (!openSearchField) {
                if (event.keyCode == 83) {
                    openSearch()
                }
            }
        }
    }

    const openSearch = function() {
        search_field.value = ""
        search_field.style.display = "grid"
        openSearchField = true
    }

    const closeSearch = function() {
            search_field.value = ""
            search_field.style.display = "none"
            openSearchField = false

        }
        // Search for a contact
    search_field.onkeyup = (ele) => {
            ele.target.focus = true
            contact_list.innerHTML = ""
            clearTimeout(setTime)

            const targetValue = (ele.target.value).toLowerCase().trim()
            setTime = setTimeout(function() {
                if (book != null) {
                    book.forEach(element => {
                        if (element.username.toLowerCase().includes(targetValue) ||
                            element.phone.toLowerCase().includes(targetValue)) {
                            displayContact(element)
                        }
                    });
                }
            }, 1000)
        }
        // On display contact
    contact_block.onclick = (event) => {
        form.style.display = "none"
        displayContactForm.style.display = "grid"

        const searchIcon = document.createElement("img")
        searchIcon.setAttribute("src", "./img/search.png")
        searchIcon.setAttribute("id", "searchIcon")

        viewContact.insertAdjacentElement("beforebegin", searchIcon)
        __(searchIcon)
        keyClickEvent()
    }

    // Edit Contact
    function edit(event, rows) {
        event.forEach(elem => {
            elem.addEventListener("click", (eve) => {
                eve.target.parentElement.children[4].style.display = "grid";
                const save_edit = eve.target.parentElement.children[4]

                getContactRow(rows)
                let current_version = eve.target.parentElement.children

                for (let i = 1; i < 3; i++) current_version[i].contentEditable = true

                elem.style.display = "none";
                saveEdit(elem, save_edit, current_version, current_version[1].innerText)
            })

        })
    }

    // Get Update Local Storage
    function saveEdit(edit, save_edit, current_version, current_version_name) {
        let newItem = JSON.parse(localStorage.getItem("contact"))
        let update = []
        save_edit.addEventListener("click", () => {

            for (let i = 1; i < 3; i++) {
                update[i - 1] = current_version[i].innerText
            }

            for (let i = 0; i < newItem.length; i++) {
                if (newItem[i].username == current_version_name) {
                    newItem[i].username = update[0]
                    newItem[i].phone = update[1]
                }
            }

            localStorage.setItem("contact", JSON.stringify(newItem))
            save_edit.style.display = "none"
            edit.style.display = "grid"

            for (let i = 1; i < 3; i++) current_version[i].contentEditable = false

        })
    }

    function getContactRow(rows) {
        for (let i = 0; i < rows.length; i++) {
            rows[i].style = `grid-template-columns: repeat(${rows[i].children.length}, 1fr);`

        }
    }

    function displayNoneForAll(elem) {
        elem.forEach(ele => ele.style.display = "none")
    }