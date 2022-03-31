import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getDatabase, set, ref, child, get, update, remove} from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";

const firebaseConfig = initializeApp({
    apiKey: "AIzaSyACSmwBun0H8a0G2NZisPo2PRmZY8KPRL4",
    authDomain: "bloodbankg5.firebaseapp.com",
    databaseURL: "https://bloodbankg5-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bloodbankg5",
    storageBucket: "bloodbankg5.appspot.com",
    messagingSenderId: "59349356493",
    appId: "1:59349356493:web:e0a49294deb29ecacb7e84",
    measurementId: "G-711G5SHMFK"
});

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const listItemBlood = $('#list__item-blood');

const listBloodIds = $$('#list__control-blood-id');
const controlForms = $$('.list__control-select');

const dbRef = ref(getDatabase());
var dataLength = 0;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Render function ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Get data of blood storage
function selectBloodData() {
    get(child(dbRef, "bloodTypesReserve")).then((snapshot) => {
        if (snapshot.exists()) {
            const contents = snapshot.val();
            dataLength = snapshot.val().length;

            let htmls = contents.map(
                (content) => `
                <div class="list__item-units">
                    <div class="flex-item">
                        <div class="list__item-id">${content.id}</div>
                        <div class="list__item-group">${content.type}</div>
                        <div class="list__item-amount">${content.amount}</div>
                    </div>
                </div>
                `
            )

            let selects = contents.map(
                (content) => `
                    <option value="${content.id - 1}">${content.id}</option>
                `
            )

            if (listItemBlood && listBloodIds) {
                return listItemBlood.innerHTML = htmls.join(""), listBloodIds.forEach( listBloodId => listBloodId.innerHTML += selects.join(""));
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
} 

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Handle events function ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Active control form
function activeControlForm() {
    controlForms.forEach((controlForm, index) => {
        controlForm.onclick = () => {
            const openForm = $$('.list__control-form')[index];
            const rollIcon = $$('.sort_down-icon')[index];

            if(openForm.style.display == "none") {
                openForm.style.display = "flex";
            } else {
                openForm.style.display = "none"
            }
            rollIcon.classList.toggle("active-icon");
        }
    });
}

//Add data to input field in select form
function setDataToSelect() {
    listBloodIds.forEach( 
        listBloodId => {
            listBloodId.onchange = () => {
                const bloodUpdate = $('#blood-update_input');
                const bloodAmount = $('#quantity-update_input');
                
                get(child(dbRef, "bloodTypesReserve/" + listBloodId.value)).then((snapshot) => {
                    if (snapshot.exists()) {
                        bloodUpdate.setAttribute('value', snapshot.val().type);
                        bloodAmount.setAttribute('value', snapshot.val().amount);
                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }
        }
    )
}

//Handle add blood event
function addBlood() {
    const addBloodBtn = $('#add_blood-btn');

    addBloodBtn.onclick = () => {
        const bloodGroup = $('#BG-add_input').value;
        const amount = $('#quantity-add_input').value;
        
        set(ref(getDatabase(), 'bloodTypesReserve/' + dataLength), {
            id: dataLength + 1,
            type: bloodGroup,
            amount: amount,
        })
        .then(() => {
            alert("Add success!");
            selectBloodData();
        })
        .catch((error) => {
            alert("Fail to add! Error:" + error);
        })
        
    }
}

//Handle update blood event
function updateBlood() { 
    const updateBloodBtn = $('#update_blood-btn');

    updateBloodBtn.onclick = () => {
        const bloodUpdate = $('#blood-update_input').value;
        const bloodAmount = $('#quantity-update_input').value;
        
        update(ref(getDatabase(), 'bloodTypesReserve/' + listBloodIds[0].value), {
            type: bloodUpdate,
            amount: bloodAmount,
        })
        .then(() => {
            alert("update success!");
            selectBloodData();
        })
        .catch((error) => {
            alert("Fail to update! Error:" + error);
        })
    }
}

//Handle delete blood event
function deleteBlood() {
    const deleteBloodBtn = $('#delete_blood-btn');
    
    deleteBloodBtn.onclick = () => {
        remove(ref(getDatabase(), 'bloodTypesReserve/' + listBloodIds[1].value))
        .then(() => {
            alert("delete success!");
            selectBloodData();
        })
        .catch((error) => {
            alert("Fail to add! Error:" + error);
        })
    }
}

const app = {
    //Render function to render information on UI
    render: function () {
        selectBloodData();
    },

    //Handle all events
    handleEvents: function () {
        activeControlForm();
        setDataToSelect()
        addBlood();
        updateBlood();
        deleteBlood();
    },

    //Run render function and handleEvents function
    start: function () {
        this.render();
        this.handleEvents();
    },
};

app.start();