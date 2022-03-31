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

const listItemHospital = $('#list__item-hospital');

const listHospitalIds = $$('#list__control-hospital-id');
const controlForms = $$('.list__control-select');

const dbRef = ref(getDatabase());
var dataLength = 0;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Render function ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Get data of blood storage
function selectHospitalData() {
    get(child(dbRef, "hospitalAccount")).then((snapshot) => {
        if (snapshot.exists()) {
            const contents = snapshot.val();
            dataLength = snapshot.val().length;

            let htmls = contents.map(
                (content) => `
                    <div class="list__item-units">
                        <div class="flex-item">
                            <div class="list__item-id">${content.id}</div>
                            <div class="list__item-name">${content.name}</div>
                            <div class="list__item-email">${content.email}</div> 
                            <div class="list__item-password">${content.password}</div>
                            <div class="list__item-phone_number">${content.phoneNumber}</div>
                            <div class="list__item-blood-amount">${content.O1}</div>
                            <div class="list__item-blood-amount">${content.O2}</div>
                            <div class="list__item-blood-amount">${content.A1}</div>
                            <div class="list__item-blood-amount">${content.A2}</div>
                            <div class="list__item-blood-amount">${content.B1}</div>
                            <div class="list__item-blood-amount">${content.B2}</div>
                            <div class="list__item-blood-amount">${content.AB1}</div>
                            <div class="list__item-blood-amount">${content.AB2}</div>
                        </div>
                    </div>
                `
            )

            let selects = contents.map(
                (content) => `
                    <option value="${content.id - 1}">${content.id}</option>
                `
            )

            if (listItemHospital && listHospitalIds) {
                return listItemHospital.innerHTML = htmls.join(""), listHospitalIds.forEach( listHospitalId => listHospitalId.innerHTML += selects.join(""));
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
    listHospitalIds.forEach( 
        listHospitalId => {
            listHospitalId.onchange = () => {
                const hospitalName = $('#hospital_name-update_input');
                const hospitalEmail = $('#hospital_email-update_input');
                const hospitalPass = $('#hospital_password-update_input');
                const hospitalPhone = $('#hospital_phone-update_input');
                const hospitalO1 = $('#hospital_o1-update_input');
                const hospitalO2 = $('#hospital_o2-update_input');
                const hospitalA1 = $('#hospital_a1-update_input');
                const hospitalA2 = $('#hospital_a2-update_input');
                const hospitalB1 = $('#hospital_b1-update_input');
                const hospitalB2 = $('#hospital_b2-update_input');
                const hospitalAB1 = $('#hospital_ab1-update_input');
                const hospitalAB2 = $('#hospital_ab2-update_input');
                
                get(child(dbRef, "hospitalAccount/" + listHospitalId.value)).then((snapshot) => {
                    if (snapshot.exists()) {
                        hospitalName.setAttribute('value', snapshot.val().name);
                        hospitalEmail.setAttribute('value', snapshot.val().email);
                        hospitalPass.setAttribute('value', snapshot.val().password);
                        hospitalPhone.setAttribute('value', snapshot.val().phoneNumber);
                        hospitalO1.setAttribute('value', snapshot.val().O1);
                        hospitalO2.setAttribute('value', snapshot.val().O2);
                        hospitalA1.setAttribute('value', snapshot.val().A1);
                        hospitalA2.setAttribute('value', snapshot.val().A2);
                        hospitalB1.setAttribute('value', snapshot.val().B1);
                        hospitalB2.setAttribute('value', snapshot.val().B2);
                        hospitalAB1.setAttribute('value', snapshot.val().AB1);
                        hospitalAB2.setAttribute('value', snapshot.val().AB2);
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

//Handle add hospital event
function addHospital() {
    const addHospitalBtn = $('#add_hospital-btn');

    addHospitalBtn.onclick = () => {
        const hospitalName = $('#hospital_name-add_input').value;
        const hospitalEmail = $('#hospital_email-add_input').value;
        const hospitalPass = $('#hospital_password-add_input').value;
        const hospitalPhone = $('#hospital_phone-add_input').value;
        const hospitalO1 = $('#hospital_o1-add_input').value;
        const hospitalO2 = $('#hospital_o2-add_input').value;
        const hospitalA1 = $('#hospital_a1-add_input').value;
        const hospitalA2 = $('#hospital_a2-add_input').value;
        const hospitalB1 = $('#hospital_b1-add_input').value;
        const hospitalB2 = $('#hospital_b2-add_input').value;
        const hospitalAB1 = $('#hospital_ab1-add_input').value;
        const hospitalAB2 = $('#hospital_ab2-add_input').value;
        
        set(ref(getDatabase(), 'hospitalAccount/' + dataLength), {
            id: dataLength + 1,
            name: hospitalName,
            email: hospitalEmail,
            password: hospitalPass,
            phoneNumber: hospitalPhone,
            O1: hospitalO1,
            O2: hospitalO2,
            A1: hospitalA1,
            A2: hospitalA2,
            B1: hospitalB1,
            B2: hospitalB2,
            AB1: hospitalAB1,
            AB2: hospitalAB2,
        })
        .then(() => {
            alert("Add success!");
            selectHospitalData();
        })
        .catch((error) => {
            alert("Fail to add! Error:" + error);
        })
        
    }
}

//Handle update hospital event
function updateHospital() { 
    const updateHospitalBtn = $('#update_hospital-btn');

    updateHospitalBtn.onclick = () => {
        const hospitalName = $('#hospital_name-update_input').value;
        const hospitalEmail = $('#hospital_email-update_input'.value);
        const hospitalPass = $('#hospital_password-update_input').value;
        const hospitalPhone = $('#hospital_phone-update_input').value;
        const hospitalO1 = $('#hospital_o1-update_input').value;
        const hospitalO2 = $('#hospital_o2-update_input').value;
        const hospitalA1 = $('#hospital_a1-update_input').value;
        const hospitalA2 = $('#hospital_a2-update_input').value;
        const hospitalB1 = $('#hospital_b1-update_input').value;
        const hospitalB2 = $('#hospital_b2-update_input').value;
        const hospitalAB1 = $('#hospital_ab1-update_input').value;
        const hospitalAB2 = $('#hospital_ab2-update_input').value;

        update(ref(getDatabase(), 'hospitalAccount/' + listHospitalIds[0].value), {
            name: hospitalName,
            email: hospitalEmail,
            password: hospitalPass,
            phoneNumber: hospitalPhone,
            O1: hospitalO1,
            O2: hospitalO2,
            A1: hospitalA1,
            A2: hospitalA2,
            B1: hospitalB1,
            B2: hospitalB2,
            AB1: hospitalAB1,
            AB2: hospitalAB2,
        })
        .then(() => {
            alert("update success!");
            app.start();
        })
        .catch((error) => {
            alert("Fail to update! Error:" + error);
        })
    }
}

//Handle delete blood event
function deleteHospital() {
    const deleteHospitalBtn = $('#delete_hospital-btn');
    
    deleteHospitalBtn.onclick = () => {
        remove(ref(getDatabase(), 'hospitalAccount/' + listHospitalIds[1].value))
        .then(() => {
            alert("delete success!");
            app.start();
        })
        .catch((error) => {
            alert("Fail to add! Error:" + error);
        })
    }
}

const app = {
    //Render function to render information on UI
    render: function () {
        selectHospitalData();
    },

    //Handle all events
    handleEvents: function () {
        activeControlForm();
        setDataToSelect();
        addHospital();
        updateHospital();
        deleteHospital();
    },

    //Run render function and handleEvents function
    start: function () {
        this.render();
        this.handleEvents();
    },
};

app.start();