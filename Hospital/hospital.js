const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// API
const bloodDonationFormApi = "http://localhost:3000/bloodDonationForm";
const userAccountsApi = "http://localhost:3000/userAccounts";
const hospitalCalendarApi = "http://localhost:3000/hospitalCalendar";

// Get DOM element
const waitConfirmBlock = $(".hospital__waitConfirm");

// Lấy ra dữ liệu form đăng ký từ API Json Server
async function getDonationForms() {
  try {
    const donationFormDatas = await axios.get(bloodDonationFormApi);
    return donationFormDatas;
  } catch (err) {
    console.log(err);
  }
}

async function getAccountDatas() {
  try {
    const userDatas = await axios.get(userAccountsApi);
    return userDatas;
  } catch (err) {
    console.log(err);
  }
}

// Render dữ liệu ra Page Hospital Oder
function renderOrderPage() {
  getDonationForms()
    .then((donationFormDatas) => {
      return donationFormDatas.data.map((donationFormDatas) => {
        return `
      <li class="hospital__waitConfirm-item row" data-set="${donationFormDatas.id}">
        <div class="info waitConfirm__info row col-12">
            <div class="waitConfirm__info-item col-4">
                <label class="info__item-title">Fullname</label>
                <div name="fullname" class="info__item-desc">${donationFormDatas.fullname}</div>
            </div>
            <div class="waitConfirm__info-item col-2">
                <label class="info__item-title">Gender</label>
                <div name="gender" class="info__item-desc">${donationFormDatas.gender}</div>
            </div>
            <div class="waitConfirm__info-item col-2">
                <label class="info__item-title">Date of Birth</label>
                <div name="dateOfBirth" class="info__item-desc">${donationFormDatas.dateOfBirth}</div>
            </div>
            <div class="waitConfirm__info-item col-2">
                <label class="info__item-title">Phone Number</label>
                <div name="phonenumber" class="info__item-desc">${donationFormDatas.phonenumber}</div>
            </div>
            <div class="waitConfirm__info-item col-2">
                <label class="info__item-title">Bloodgroup</label>
                <div name="bloodgroup" class="info__item-desc">${donationFormDatas.bloodgroup}</div>
            </div>
        </div>
        <div class="waitConfirm__more col-12">
            <div class="waitConfirm__more-left">
                <div class="waitConfirm__more-item">
                    <div class="more__item-name">Citizen ID:</div>
                    <div name="citizenId" class="more__item-desc">${donationFormDatas.citizenId}</div>
                </div>
                <div class="waitConfirm__more-item">
                    <div class="more__item-name">Email:</div>
                    <div name="email" class="more__item-desc">${donationFormDatas.email}</div>
                </div>
                <div class="waitConfirm__more-item">
                    <div class="more__item-name">Address:</div>
                    <div name="address" class="more__item-desc">${donationFormDatas.address}</div>
                </div>
                <div class="waitConfirm__more-item">
                    <div class="more__item-name">Occupation:</div>
                    <div name="occupation" class="more__item-desc">${donationFormDatas.occupation}</div>
                </div>
                <div class="waitConfirm__more-item">
                    <div class="more__item-name">Donated:</div>
                    <div name="donated" class="more__item-desc">${donationFormDatas.donated}</div>
                </div>
                <div class="waitConfirm__more-item">
                    <div class="more__item-name">Disease:</div>
                    <div name="disease" class="more__item-desc">${donationFormDatas.disease}</div>
                </div>
                <div class="waitConfirm__more-item">
                    <div class="more__item-name">Allergies:</div>
                    <div name="allergies" class="more__item-desc">${donationFormDatas.allergies}</div>
                </div>
            </div>
            <div class="waitConfirm__more-right">
                <div class="waitConfirm__options">
                    <div class="options-btn btn-approve">Approve</div>
                    <div class="options-btn btn-refuse">Refuse</div>
                </div>
            </div>
        </div>
    </li>
      `;
      });
    })
    .then((htmls) => {
      waitConfirmBlock.innerHTML = htmls.join("");
      app.handleEvents();
    });
}

const app = {
  // Render tất cả các dữ liệu ra màn hình
  render: function () {
    renderOrderPage();
  },

  // Hàm xử lý tất cả các thao tác ở DOM
  handleEvents: function () {
    const infoWaitsArray = Array.from($$(".hospital__waitConfirm-item"));
    const approveBtns = $$(".btn-approve");
    const refuseBtns = $$(".btn-refuse");

    // Xử lý onscroll sẽ đẩy thanh Menu lên
    document.onscroll = function () {
      const footerElement = $(".footer");
      const menuListItem = $(".main__menu");
      const mainSettings = $(".main__setting");

      // Lấy ra tọa độ chiều cao của Footer
      const footerTop = footerElement.getBoundingClientRect().top;
      if (!mainSettings) {
        footerTop < 460
          ? menuListItem.classList.add("bottom__0")
          : menuListItem.classList.remove("bottom__0");
      }
    };

    // Xử lý khi click vào từng info đang chờ phê duyệt
    infoWaitsArray.forEach((infoWait) => {
      infoWait.onclick = function () {
        if ($(".hospital__waitConfirm-item.active")) {
          $(".hospital__waitConfirm-item.active").classList.remove("active");
        }
        infoWait.classList.add("active");
      };
    });

    // Khi click vào nút Approve
    approveBtns.forEach((approveBtn, index) => {
      approveBtn.onclick = function () {
        async function approveForm() {
          // Lấy ra ID của form được click
          const idForm = infoWaitsArray[index].dataset.set;
          try {
            // Lấy ra dữ liệu của form được click
            const donationForm = await getDonationForms().then(
              (donationFormDatas) => {
                return donationFormDatas.data.find(
                  (donationForm) => donationForm.id === Number(idForm)
                );
              }
            );
            // Đưa dữ liệu của form được click vào JSON Server hospitalCalendarApi
            await axios.post(hospitalCalendarApi, {
              ...donationForm,
              approve: true,
            });
            // Sau khi đưa dữ liệu vào hospitalCalendarApi, xóa Form Donation ở file cũ
            await axios.delete(bloodDonationFormApi + "/" + idForm);
          } catch (err) {
            console.log(err);
          }
        }
        approveForm();
      };
    });

    // Khi click vào nút Refuse
    refuseBtns.forEach((refuseBtn, index) => {
      refuseBtn.onclick = () => {
        async function refuseForm() {
          // Lấy ra ID của form được click
          const idForm = infoWaitsArray[index].dataset.set;
          try {
            await axios.delete(bloodDonationFormApi + "/" + idForm);
          } catch (err) {
            console.log(err);
          }
        }
        refuseForm();
      };
    });
  },

  start: function () {
    this.render();
    // this.handleEvents();
  },
};

app.start();
