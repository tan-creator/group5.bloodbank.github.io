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
      errorMessage = rules[i](inputElement.value);
      // Nếu có lỗi, thì break khỏi vòng lặp, để chạy cái rule trước,
      // khi cái rule trước pass, thì sẽ kiểm tra rule tiếp theo
      if (errorMessage) break;
    }

    if (errorMessage) {
      hintElement.innerHTML = errorMessage;
      getParent(inputElement, options.inputItem).classList.add("invalid");
    } else {
      hintElement.innerHTML = "";
      getParent(inputElement, options.inputItem).classList.remove("invalid");
    }

    return !errorMessage;
  };

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
            values[input.name] = input.value;
            return values;
          },
          {});
          options.onSubmit(formValues);
        }
      }
    };

    // Lặp qua mỗi rule và xử lý các sự kiện (Blur, input....)
    options.rules.forEach((rule) => {
      const inputElement = formElement.querySelector(rule.selector);

      // Hàm lấy tất cả các rules, và đảm bảo tất cả các rule đều hoạt động
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      if (inputElement) {
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
          getParent(inputElement, options.inputItem).classList.remove(
            "invalid"
          );
        };
      }
    });
  }
}

// Hàm kiểm tra xem người dùng đã nhập hay chưa
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Please enter this field";
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
