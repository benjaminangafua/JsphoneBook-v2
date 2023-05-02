    // Display contact
    const contact_list = document.querySelector(".contact-list")
    const search_field = document.querySelector("#search-input")
    const contact_block = document.querySelector(".contact_block")
    const displayContactForm = document.querySelector(".contact-display")
    const viewContact = document.querySelector(".vewContact")
    let setTime;
    let openSearchField = false
        // Create contact
    const phoneBook = [{
        username: "",
        phone: "",
        gender: "",
        img: ""
    }]
    const form = document.querySelector("form");
    const imgGenerator = document.querySelector(".prfImg"),
        imgFile = document.querySelector("input[type='file']")
    const genderVal = document.getElementsByName("gender")
    const saveBtn = document.querySelector(".save")
    const struct = document.querySelectorAll(".input")

    const displayImg = () => (imgGenerator.innerHTML = imgFile.files[0] != undefined ?
        `<img src="${URL.createObjectURL(imgFile.files[0])}"/>` : "")
    imgFile.style.display = "none"
    imgGenerator.addEventListener("click", () => {

        imgFile.click()
        imgFile.before(setTimeout(displayImg, 10000))
    })

    const requiredFile = function() {
        for (let i = 0; i < arguments.length; i++)
            arguments[i].setAttribute("required", "")
    }

    // Save Contact
    saveBtn.onclick = e => {
        const [username, phone] = struct
        requiredFile(imgFile, username, phone)
        phoneBook[0].phone = phone.value != "" ?
            phone.value : ""
        phoneBook[0].username = username.value != "" ?
            username.value : ""
        genderVal.forEach((ele) => ele.checked == true ?
            phoneBook[0].gender = ele.value : "")

        // get user's uploaded image 
        if (imgFile.files[0] != undefined) {
            const reader = new FileReader();

            reader.addEventListener("load", function() {
                // convert image file to base64 
                phoneBook[0].img = reader.result;
            }, false);
            if (imgFile.files[0]) {
                reader.readAsDataURL(imgFile.files[0]);
                console.log(imgFile.files[0])
            }
        }
        struct[0].value = genderVal[0].value = struct[1].value =
            genderVal[1].value = ""
        genderVal[0].checked = genderVal[1].checked = false

        let correct = confirm("By clicking 'Ok' this contact will be saved!")
        if (localStorage.getItem("contact") == null) {
            correct ?
                localStorage.setItem("contact", JSON.stringify(phoneBook)) :
                console.log("Contact was not save")
        } else {
            let newItem = JSON.parse(localStorage.getItem("contact"))
            newItem.push(phoneBook[0])
            correct ?
                localStorage.setItem("contact", JSON.stringify(newItem)) :
                console.log("Contact was not save")
        }
    }

    let book = JSON.parse(localStorage.getItem("contact"))
    contactBookUp(book)

    function contactBookUp(book) {

        // Check if contacts exist in localStorage
        if (book != null) {
            book.forEach(ele => {
                displayContact(ele)
            });
        }
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
        contactBookUp()
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
                    console.log(event)
                }
            }
            if (!openSearchField) {
                if (event.keyCode == 83) {
                    openSearch()
                    console.log(event)
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
        contact_list.innerHTML = ""
        clearTimeout(setTime)
        let targetValue = (ele.target.value).toLowerCase()
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



    // Delete Contact
    function deleteContact(del, element) {
        const newBook = []
        del.forEach(ele => ele.onclick = (event) => {
            let name = event.target.parentElement.children[1].firstChild.data
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
        // console.log(ele)
        contact_list.innerHTML += `
        <div class="grid">
            <div><img src="${ele.img}"/></div>
            <div>${ele.username}</div>
            <div>${ele.phone}</div>
            <div class="delete">Delete</div>
        </div>
    `
        const deleteElement = document.querySelectorAll(".delete")
        deleteContact(deleteElement, ele)
    }