import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getDatabase, ref, child, get, remove} from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";

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

const listItemDonor = $('#list__item-donor');
const listDonorId = $('#list__control-donor-id');

const controlForms = $$('.list__control-select');

const dbRef = ref(getDatabase());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Render function ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Get data of donor
function selectDonorData() {
    get(child(dbRef, "userAccounts")).then((snapshot) => {
        if (snapshot.exists()) {
            const contents = snapshot.val();

            let htmls = contents.map(
                (content) => `
                <div class="list__item-units">
                        <div class="flex-item">
                            <div class="list__item-id">${content.id}</div>
                            <div class="list__item-name">${content.fullname}</div>
                            <div class="list__item-gender">${content.gender}</div>
                            <div class="list__item-email">${content.email}</div>
                            <div class="list__item-password">${content.password}</div>
                            <div class="list__item-phone_number">${content.phonenumber}</div>
                            <div class="list__item-work">${content.occupation}</div>
                            <div class="list__item-group_user">${content.bloodgroup}</div>
                        </div>
                    </div>
                `
            )

            let selects = contents.map(
                (content) => `
                    <option value="${content.id - 1}">${content.id}</option>
                `
            )

            if (listItemDonor && listDonorId) {
                return listItemDonor.innerHTML = htmls.join(""), listDonorId.innerHTML += selects.join("");
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

function deleteDonor() {
    const deleteDonorBtn = $('#delete_donor-btn');
    
    deleteDonorBtn.onclick = () => {
        remove(ref(getDatabase(), 'userAccounts/' + listDonorId.value))
        .then(() => {
            alert("delete success!");
            selectDonorData();
        })
        .catch((error) => {
            alert("Fail to add! Error:" + error);
        })
    }
}

const app = {
    //Render function to render information on UI
    render: function () {
        selectDonorData();
    },

    //Handle all events
    handleEvents: function () {
        activeControlForm();
        deleteDonor();
    },

    //Run render function and handleEvents function
    start: function () {
        this.render();
        this.handleEvents();
    },
};

app.start();