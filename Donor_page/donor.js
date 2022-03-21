const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// API
const donorCenterContentApi = "http://localhost:3000/donorHomePageContent";
const bloodTypesReserve = "http://localhost:3000/bloodTypesReserve";
const userAccountsLink = "http://localhost:3000/userAccounts";
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
const accountId = Number(localStorage.getItem("accountId"));

// Hàm lấy ra giữ liệu tài khoản ở JSON Server
async function getProfileAccount() {
  try {
    const users = await axios.get(userAccountsLink);
    return users;
  } catch (err) {
    console.log(err);
  }
}

// Hàm lấy dữ liệu gán vào Profile Account
function renderProfileAccount() {
  getProfileAccount().then((users) => {
    users.data.forEach((user) => {
      if (user.id === accountId) {
        const userNameElement = $(".options__right-name");
        const userEmailElement = $(".options__right-email");

        userNameElement.innerText = user.fullname;
        userEmailElement.innerText = user.email;
      }
    });
  });
}

// Render setting account
function renderSettingProfile() {
  // Lấy ra tất cả các thẻ input
  const inputElements = Array.from(document.querySelectorAll(".inputElement"));

  getProfileAccount()
    .then((users) => {
      return users.data.find((user) => {
        if (user.id === accountId) {
          return user;
        }
      });
    })
    .then((user) => {
      inputElements.forEach((inputElement) => {
        Object.keys(user).forEach((key) => {
          if (inputElement.name === key) {
            inputElement.value = user[key] === "undefined" ? "" : user[key];
          }
        });
      });
    });
}

// Lấy dữ liệu từ API
function getData(apiUrl) {
  return fetch(apiUrl).then((res) => res.json());
}

// Hàm render content
async function renderContent() {
  // Lấy ra dữ liệu của Content gửi về từ API
  const contents = await getData(donorCenterContentApi);
  const centerContent = $(".center__content");

  let htmls = contents.map(
    (content) => `
    <div class="content__item col-4">
      <a href="">
          <img alt="" class="content__item-img" src="${content.image}">
          <div class="content__item-title">${content.title}</div>
      </a>
    </div>
  `
  );

  if (centerContent) return (centerContent.innerHTML = htmls.join(""));
}

// Hàm render Kho dự trữ máu (Blood storage)
async function renderBloodTypesReserve() {
  // Hàm lấy ra dữ liệu của Content gửi về từ API
  const bloodTypes = await getData(bloodTypesReserve);

  // Lấy ra DOM Element chứa contents
  const storageList = $(".storage__list");

  let htmls = bloodTypes.map(
    (bloodType) => `
    <div class="storage__list-item col-3">
      <img src="../assets/img/Donor-img/blood-item.jpg" alt="">
      <div class="storage__list-item--desc no-select">
          <div class="item__bloodType">${bloodType.type}</div>
          <div class="storage__list-item--amount">${bloodType.amount}ml</div>
      </div>
    </div>
  `
  );

  if (storageList) {
    storageList.innerHTML = htmls.join("");
  }
}

const app = {
  // Hàm Render ra giao diện người dùng
  render: function () {
    renderContent();
    renderBloodTypesReserve();
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

      saveBtns.forEach((saveBtn, index) => {
        const inputElement = inputsNotEmail[index];
        const key = inputElement.name;
        saveBtn.onclick = function () {
          getProfileAccount()
            .then((users) => {
              return users.data.find((user) => user.id === accountId);
            })
            .then((user) => {
              axios.patch(userAccountsLink + "/" + user.id, {
                [key]: inputElement.value,
              });
            });
        };
      });
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
