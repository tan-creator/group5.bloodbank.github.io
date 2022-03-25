// Đối tượng Validator
function Validator(options) {
  const formElement = document.querySelector(options.form);
  const selectorRules = {};

  // Hàm lấy ra thẻ cha
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  // Hàm ẩn và hiện validate
  validate = function (rule, inputElement) {
    // Lấy ra thẻ chứa thông báo Valid
    const hintElement = getParent(
      inputElement,
      options.formGroupSelector
    ).querySelector(options.errorSelector);
    // Biến chứa phần Message thông báo
    var errorMessage;

    // Lấy ra tất cả các Rules của selector
    const rules = selectorRules[rule.selector];
    for (var i = 0; i < rules.length; ++i) {
      switch (inputElement.type) {
        case "checkbox":
        case "radio":
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ":checked")
          );
          break;

        default:
          errorMessage = rules[i](inputElement.value);
          break;
      }
      // Nếu có lỗi, thì break khỏi vòng lặp, để chạy cái rule trước,
      // khi cái rule trước pass, thì sẽ kiểm tra rule tiếp theo
      if (errorMessage) break;
    }

    if (errorMessage) {
      hintElement.innerHTML = errorMessage;
      if (inputElement.parentElement.matches(".main__input-item")) {
        getParent(inputElement, options.inputItem).classList.add("invalid");
      } else {
        inputElement.classList.add("invalid");
      }
    } else {
      hintElement.innerHTML = "";
      if (inputElement.parentElement.matches(".main__input-item")) {
        getParent(inputElement, options.inputItem).classList.remove("invalid");
      } else {
        inputElement.classList.remove("invalid");
      }
    }

    return !errorMessage;
  };

  // Truyền các dữ liệu sẵn có của User đang đăng nhập và form Donations
  if (options.form === ".donate__form") {
    const accountId = localStorage.getItem("accountId");
    const submitBtn = $(".donate__form-submit");

    let isRegistered = false;

    // Kiểm tra xem người dùng đã gửi phiếu đăng ký hiến máu chưa
    // Nếu người dùng chưa đăng ký hiến máu, sẽ chạy luôn hàm renderDonationFormValue
    async function getDonationForm() {
      await db
        .collection("donationForm")
        .get()
        .then((queryDonationForm) => {
          queryDonationForm.forEach((doc) => {
            const donationForm = doc.data();

            if (donationForm.userId === accountId) {
              isRegistered = true;
            }
          });
        });
      if (isRegistered) {
        submitBtn.classList.add("active");
        submitBtn.innerText = "You have registered to donate blood";
        submitBtn.disabled = true;
        return;
      }
    }
    getDonationForm();

    // Render dữ liệu người dùng vào các ô input của Form hiến máu
    async function renderDonationFormValue() {
      await db
        .collection("userAccounts")
        .get()
        .then((queryAccounts) => {
          queryAccounts.forEach((doc) => {
            const user = doc.data();
            if (user.id === accountId) {
              options.rules.forEach((rule) => {
                const inputElement = formElement.querySelector(rule.selector);

                Object.keys(user).forEach((key) => {
                  if (
                    key === inputElement.name &&
                    inputElement.type !== "radio"
                  ) {
                    inputElement.value =
                      user[key] === "undefine" ? "" : user[key];
                  }
                });
              });
            }
          });
        });
    }

    renderDonationFormValue();
  }

  if (formElement) {
    // Lắng nghe sự kiện khi nhấn vào nút Submit form
    formElement.querySelector(options.submitBtn).onclick = function () {
      var isFormValid = true;
      // Lặp qua tất cả các rule
      options.rules.forEach((rule) => {
        const inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(rule, inputElement);

        // Kiểm tra xem còn chổ nào invalid hay không
        if (!isValid) {
          isFormValid = false;
        }
      });

      // Nếu form được nhập dữ liệu chính xác, sẽ thực hiện hàm Submit bên trong
      if (isFormValid) {
        if (typeof options.onSubmit === "function") {
          // Lấy ra tất cả các thẻ input ở trong Form
          const formInputs = formElement.querySelectorAll("[name]");
          const formValues = Array.from(formInputs).reduce(function (
            values,
            input
          ) {
            switch (input.type) {
              case "radio":
              case "checkbox":
                values[input.name] = formElement.querySelector(
                  'input[name="' + input.name + '"]:checked'
                ).value;
                break;
              default:
                values[input.name] = input.value;
            }

            return values;
          },
          {});

          // Hàm submit Default
          async function submitDefault() {
            // Lấy ra email của userAccount trong Database, để kiểm tra xem người dùng có sử dụng email đã sử dụng hay không
            const { email } = formValues;
            let isValid = true;

            // Lấy ra data user account ở DB
            await db
              .collection("userAccounts")
              .get()
              .then((queryAccounts) => {
                queryAccounts.forEach((doc) => {
                  const account = doc.data();

                  // Kiểm tra xem email đã tồn tại hay chưa
                  if (account.email === email) {
                    isValid = false;
                  }
                });
              });

            // Trong trường hợp email chưa tồn tại
            if (isValid) {
              await db
                .collection("userAccounts")
                .add({
                  ...formValues,
                })
                .then((docRef) => {
                  db.collection("userAccounts").doc(docRef.id).update({
                    id: docRef.id,
                  });
                  localStorage.setItem("accountId", docRef.id);
                })
                .catch((error) => {
                  console.error("Error adding document: ", error);
                });

              return window.location.assign("../Donor_page/donor.html");
            } else {
              const wrongMessage = formElement.querySelector(options.formWrong);
              wrongMessage.innerText = "Email already exists!";
            }
          }

          // Hàm Submit Form Donations Blood
          async function submitDonationsForm() {
            const accountId = localStorage.getItem("accountId");
            const { email, ...rest } = formValues;
            const submitBtn = $(".donate__form-submit");

            // Đưa dữ liệu vừa nhập ở Form cập nhật vào dữ liệu của User hiện tại
            await db
              .collection("userAccounts")
              .get()
              .then((queryAccounts) => {
                queryAccounts.forEach((doc) => {
                  const user = doc.data();

                  if (user.id === accountId) {
                    const accountRef = db
                      .collection("userAccounts")
                      .doc(user.id);
                    return accountRef.update({
                      ...rest,
                    });
                  }
                });
              });

            // Đưa dữ liệu người dùng đăng ký form hiến máu vào DB
            await db
              .collection("donationForm")
              .add({
                ...formValues,
                approve: false,
                userId: accountId,
              })
              .catch((error) => {
                console.error("Error adding document: ", error);
              });

            submitBtn.classList.add("active");
            submitBtn.innerText = "You have registered to donate blood";
          }

          // Hàm Submit Login
          async function submitLogin() {
            // Lấy ra value của người dùng nhập vào
            const { email, password } = formValues;
            let isSuccess = false;

            // Lấy ra data user account ở DB
            await db
              .collection("userAccounts")
              .get()
              .then((queryAccounts) => {
                queryAccounts.forEach((doc) => {
                  const account = doc.data();

                  // Kiểm tra xem người dùng đã nhập đúng tài khoản mật khẩu hay chưa
                  if (
                    account.email === email &&
                    account.password === password
                  ) {
                    localStorage.setItem("accountId", account.id);
                    isSuccess = true;
                  }
                });
              });

            if (isSuccess) {
              window.location.assign("../Donor_page/donor.html");
            } else {
              const wrongMessage = formElement.querySelector(options.formWrong);
              wrongMessage.innerText = "Wrong account or password !";
            }
          }

          // Xử lý khi nhấn nút Submit, tùy trường hợp là Form đăng ký hoặc đăng nhập
          switch (options.form) {
            case "#form-login":
              submitLogin();
              break;

            case ".donate__form":
              submitDonationsForm();
              break;

            default:
              options.onSubmit(submitDefault());
          }
        }
      }
    };

    // Lặp qua mỗi rule và xử lý các sự kiện (Blur, input....)
    options.rules.forEach((rule) => {
      const inputElements = formElement.querySelectorAll(rule.selector);

      // Hàm lấy tất cả các rules, và đảm bảo tất cả các rule đều hoạt động
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      Array.from(inputElements).forEach(function (inputElement) {
        // Xử lý khi Blur ra khỏi thẻ input
        inputElement.onblur = function () {
          validate(rule, inputElement);
        };

        // Xử lý khi nhập dữ liệu vào ô input, sẽ mất cảnh báo
        inputElement.oninput = function () {
          const hintElement = getParent(
            inputElement,
            options.formGroupSelector
          ).querySelector(options.errorSelector);
          hintElement.innerHTML = "";
          if (inputElement.parentElement.matches(".main__input-item")) {
            getParent(inputElement, options.inputItem).classList.remove(
              "invalid"
            );
          } else {
            inputElement.classList.remove("invalid");
          }
        };
      });
    });
  }
}

// Hàm kiểm tra xem người dùng đã nhập hay chưa
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value ? undefined : message || "Please enter this field";
    },
  };
};

// Hàm kiểm tra có phải email hay không
Validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regexEmail.test(value) ? undefined : "Invalid email";
    },
  };
};

// Hàm kiểm tra xem đã nhập đủ ký tự hay chưa
Validator.minLength = function (selector, min) {
  return {
    selector: selector,
    min: min,
    test: function (value) {
      return value.length >= min
        ? undefined
        : `This field needs at least ${min} characters`;
    },
  };
};

// Hàm kiểm tra xem người dùng nhập lại dữ liệu (mật khẩu) có trùng khớp hay chưa
Validator.isConfirmed = function (selector, confirmValue, message) {
  return {
    selector,
    test: function (value) {
      return value === confirmValue()
        ? undefined
        : message || "Please enter this field";
    },
  };
};
