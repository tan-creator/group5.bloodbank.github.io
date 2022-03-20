const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// API
const donorCenterContentApi = "http://localhost:3000/donorHomePageContent";
const bloodTypesReserve = "http://localhost:3000/bloodTypesReserve";
const userAccountsLink = "http://localhost:3000/userAccounts";

// Lấy ra các elements trong DOM
const avtBtn = $(".header__avt");
const options = $(".header__avt--options");
const footerElement = $(".footer");
const menuListItem = $(".main__menu");
const accountId = Number(localStorage.getItem("accountId"));

function renderProfileAccount() {
  // Hàm lấy dữ liệu gán vào Profile Account
  async function getProfileAccount() {
    try {
      const users = await axios.get(userAccountsLink);
      return users;
    } catch (err) {
      console.log(err);
    }
  }

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

  centerContent.innerHTML = htmls.join("");
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

  storageList.innerHTML = htmls.join("");
}

const app = {
  // Hàm Render ra giao diện người dùng
  render: function () {
    renderContent();
    renderBloodTypesReserve();
    renderProfileAccount();
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
      // Lấy ra tọa độ chiều cao của Footer
      const footerTop = footerElement.getBoundingClientRect().top;

      footerTop < 390
        ? menuListItem.classList.add("bottom__0")
        : menuListItem.classList.remove("bottom__0");
    };

    // Xử lý khi click vào nút Logout
    logoutBtn.onclick = function () {
      window.location.assign("../index.html");
    };
  },

  start: function () {
    this.render();
    this.handleEvents();
  },
};

app.start();
