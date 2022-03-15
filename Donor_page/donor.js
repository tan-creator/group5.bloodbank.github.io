const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const avtBtn = $(".header__avt");
const options = $(".header__avt--options");

// Xử lý khi nhấn vào avt, sẽ hiện options của tài khoản đó
avtBtn.onclick = function () {
  options.classList.toggle("active");
};
