const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const inputElements = Array.from(document.querySelectorAll(".inputElement"));
const inputsNotEmail = [];
const backSettingBtn = $(".setting__back-btn");

// Lấy ra các thẻ Input, trừ field Email
inputElements.forEach((inputElement) => {
  if (inputElement.name !== "email") {
    inputsNotEmail.push(inputElement);
  }
});

// Lấy ra các elements trong DOM
const avtBtn = $(".header__avt");
const options = $(".header__avt--options");
const footerElement = $(".footer");
const settingBtn = $(".setting");
const editBtns = $$(".btn-edit");
const saveBtns = $$(".btn-save");
const cancelBtns = $$(".btn-cancel");
const editMode = $$(".setting__form-right--editmode");
const accountId = localStorage.getItem("accountId");

// Hàm lấy dữ liệu gán vào Profile Account
async function renderProfileAccount() {
  const userNameElement = $(".options__right-name");
  const userEmailElement = $(".options__right-email");

  await db
    .collection("userAccounts")
    .get()
    .then((queryAccounts) => {
      queryAccounts.forEach((doc) => {
        const user = doc.data();

        if (user.id === accountId) {
          userNameElement.innerText = user.fullname;
          userEmailElement.innerText = user.email;
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// Render setting account
async function renderSettingProfile() {
  // Lấy ra tất cả các thẻ input
  const inputElements = Array.from(document.querySelectorAll(".inputElement"));

  await db
    .collection("userAccounts")
    .get()
    .then((queryAccounts) => {
      queryAccounts.forEach((doc) => {
        const user = doc.data();

        if (user.id === accountId) {
          inputElements.forEach((inputElement) => {
            Object.keys(user).forEach((key) => {
              if (inputElement.name === key) {
                inputElement.value = user[key] === "undefined" ? "" : user[key];
              }
            });
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// Hàm render content
async function renderContent() {
  const centerContent = $(".center__content");
  const htmls = [];

  await db
    .collection("donersContent")
    .get()
    .then((queryContent) => {
      queryContent.forEach((docs) => {
        const data = docs.data();

        let html = `
        <div class="content__item col-4">
          <a href="">
              <img alt="" class="content__item-img" src="${data.image}">
              <div class="content__item-title">${data.title}</div>
          </a>
        </div>
      `;

        htmls.push(html);
        if (centerContent) {
          centerContent.innerHTML = htmls.join("");
        }
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
  app.handleEvents();
}

// Hàm render Kho dự trữ máu (Blood storage)
async function renderStorage() {
  // Lấy ra DOM Element chứa contents
  const storageList = $(".storage__list");
  const htmls = [];

  await db
    .collection("bloodStorage")
    .get()
    .then((queryStorage) => {
      queryStorage.forEach((data) => {
        const storage = data.data();

        let html = `
        <div class="storage__list-item col-3">
          <img src="../assets/img/Donor-img/blood-item.jpg" alt="">
          <div class="storage__list-item--desc no-select">
              <div class="item__bloodType">${storage.type}</div>
              <div class="storage__list-item--amount">${storage.amount}ml</div>
          </div>
        </div>
      `;

        htmls.push(html);
        if (storageList) {
          storageList.innerHTML = htmls.join("");
        }
      });
    });
  app.handleEvents();
}

const app = {
  // Hàm Render ra giao diện người dùng
  render: function () {
    renderContent();
    renderStorage();
    renderProfileAccount();
    renderSettingProfile();
  },

  // Hàm xử lý tất các các Events DOM
  handleEvents: function () {
    const logoutBtn = $(".logout");

    // Xử lý khi nhấn vào avt, sẽ hiện options của tài khoản đó
    avtBtn.onclick = function () {
      options.classList.toggle("active");
    };

    // Xử lý khi cuộn xuống dưới cùng, thanh Footer sẽ đẩy Menulist đi lên chứ không che đi
    document.onscroll = function () {
      const menuListItem = $(".main__menu");
      const mainSettings = $(".main__setting");

      // Lấy ra tọa độ chiều cao của Footer
      const footerTop = footerElement.getBoundingClientRect().top;

      if (!mainSettings) {
        footerTop < 390
          ? menuListItem.classList.add("bottom__0")
          : menuListItem.classList.remove("bottom__0");
      }
    };

    // Xử lý khi click vào nút Logout
    logoutBtn.onclick = function () {
      window.location.assign("../index.html");
    };

    // Khi click vào setting tài khoản
    settingBtn.onclick = function () {
      window.location.assign("./setting.html");
    };

    // Khi click vào nút Edit
    editBtns.forEach((editBtn, index) => {
      const inputElement = inputsNotEmail[index];

      editBtn.onclick = function () {
        editBtn.style.display = "none";
        editMode[index].style.display = "block";
        inputElement.disabled = false;
        inputElement.focus();
      };

      cancelBtns.forEach((cancelBtn, index) => {
        const inputElement = inputsNotEmail[index];
        cancelBtn.onclick = function () {
          editMode[index].style.display = "none";
          editBtns[index].style.display = "block";
          inputElement.disabled = true;
          renderSettingProfile();
        };
      });
    });

    // Khi click vào nút Save
    saveBtns.forEach((saveBtn, index) => {
      const inputElement = inputsNotEmail[index];
      const key = inputElement.name;
      saveBtn.onclick = function () {
        async function editInformationAccount() {
          await db
            .collection("userAccounts")
            .get()
            .then((queryInformation) => {
              queryInformation.forEach((doc) => {
                const information = doc.data();

                if (information.id === accountId) {
                  db.collection("userAccounts")
                    .doc(information.id)
                    .update({
                      [key]: inputElement.value,
                    });
                }
              });
            });
        }
        editInformationAccount();
        editMode[index].style.display = "none";
        editBtns[index].style.display = "block";
        inputElement.disabled = true;
      };
    });

    // Click vào nút back ở page setting
    if (backSettingBtn)
      return (backSettingBtn.onclick = function () {
        window.location.assign("./donor.html");
      });
  },

  start: function () {
    this.render();
    this.handleEvents();
  },
};

app.start();
