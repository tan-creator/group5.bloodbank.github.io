const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const avtBtn = $(".header__avt");
const options = $(".header__avt--options");
const footerElement = $(".footer");
const menuListItem = $(".main__menu");
const appElement = $(".app");
const headerElement = $(".header");
console.log(menuListItem.offsetHeight);

const app = {
  handleEvents: function () {
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
  },

  start: function () {
    this.handleEvents();
  },
};

app.start();
