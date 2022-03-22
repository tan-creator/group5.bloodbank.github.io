const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// API
const bloodTypesReserve = "http://localhost:3000/bloodTypesReserve";

// KHAI BÁO BIẾN
const bloodInventory = $$(".bloodInventory__list-item");
const footerElement = $(".footer");
const bloodAmount = $$(".bloodInventory__item-amount");

// Hàm lấy ra giữ liệu tài khoản ở JSON Server
async function getBloodReserved() {
  try {
    const amount = await axios.get(bloodTypesReserve);
    return amount;
  } catch (err) {
    console.log(err);
  }
}

// Hàm render file dự trữ máu
function renderBloodReserved() {
  getBloodReserved().then((bloodReserves) => {
    return bloodReserves.data.forEach((bloodReverse, index) => {
      bloodAmount[index].innerHTML = `${bloodReverse.amount}ml`;
    });
  });
}

const app = {
  // Hàm Render ra giao diện
  render: function () {
    renderBloodReserved();
  },

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
    this.render();
    this.handleEvents();
  },
};

app.start();
