const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// KHAI BÁO BIẾN
const bloodInventory = $$(".bloodInventory__list-item");
const footerElement = $(".footer");

const app = {
  // Hàm Render ra giao diện
  render: function () {},

  // Hàm xử lý các sự kiện/chức năng
  handleEvents: function () {
    const typeBloods = $$(".descriptionByTypeBlood__item");

    // Xử lý khi click vào các nhóm máu
    bloodInventory.forEach((inventoryItem, index) => {
      // Lấy ra trang Description tương ứng dựa vào index
      const pane = typeBloods[index];

      inventoryItem.onclick = () => {
        $(".bloodInventory__list-item.active").classList.remove("active");
        $(".descriptionByTypeBlood__item.active").classList.remove("active");

        inventoryItem.classList.add("active");
        pane.classList.add("active");
      };
    });
  },

  // Hàm khỏi động khi chạy ứng dụng
  start: function () {
    this.handleEvents();
  },
};

app.start();
