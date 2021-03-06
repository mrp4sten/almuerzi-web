const API_URI = "https://serverless-mrp4sten.vercel.app";
let mealsState = [];
let route = "login"; // login, register, orders
let user = {}

const stringToHTML = (s) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(s, "text/html");

  return doc.body.firstChild;
};

const renderItem = (item) => {
  const element = stringToHTML(`<li id="${item._id}">${item.name}</li>`);

  element.addEventListener("click", () => {
    const mealsList = document.getElementById("meals-list");
    Array.from(mealsList.children).forEach((x) =>
      x.classList.remove("selected"),
    );
    element.classList.add("selected");

    const mealsIdInput = document.getElementById("meals-id");
    mealsIdInput.value = item._id;
  });

  return element;
};

const renderOrder = (order, meals) => {
  const meal = meals.find((meal) => meal._id === order.meal_id);
  const element = stringToHTML(
    `<li id="${order._id}">${meal.name} ${order.user_id}</li>`,
  );
  return element;
};

const initForm = () => {
  const orderForm = document.getElementById("order");
  orderForm.onsubmit = (e) => {
    e.preventDefault();
    const btnSubmit = document.getElementById("btnSubmit");
    btnSubmit.setAttribute("disabled", true);
    const mealId = document.getElementById("meals-id");
    const mealIDValue = mealId.value;

    if (!mealIDValue) {
      alert("You should select a meal");
      btnSubmit.removeAttribute("disabled");
      return;
    }

    const order = {
      meal_id: mealIDValue,
      email_id: user.email,
    };

    const token2 = localStorage.getItem("token");

    fetch(API_URI + "/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token2
      },
      body: JSON.stringify(order),
    })
      .then((x) => x.json())
      .then((res) => {
        const renderedOrder = renderOrder(res, mealsState);
        const ordersList = document.getElementById("orders-list");

        ordersList.appendChild(renderedOrder);
        btnSubmit.removeAttribute("disabled");
      });
  };
};

const initData = () => {
  fetch(API_URI + "/api/meals")
    .then((res) => res.json())
    .then((data) => {
      mealsState = data;
      const mealsList = document.getElementById("meals-list");
      const btnSubmit = document.getElementById("btnSubmit");

      const listItems = data.map(renderItem);

      mealsList.removeChild(mealsList.firstElementChild);
      listItems.forEach((element) => mealsList.appendChild(element));

      btnSubmit.removeAttribute("disabled");
      fetch(API_URI + "/api/orders")
        .then((res) => res.json())
        .then((ordersData) => {
          const ordersList = document.getElementById("orders-list");
          const listOrders = ordersData.map((orderData) =>
            renderOrder(orderData, data),
          );

          ordersList.removeChild(ordersList.firstElementChild);
          listOrders.forEach((element) => ordersList.appendChild(element));
        });
    });
};

const renderApp = () => {
  const token = localStorage.getItem("token");
  if (token) {
    user = JSON.parse(localStorage.getItem("user"));
    return renderOrders();
  }
  renderLogin();
};

const renderOrders = () => {
  const ordersView = document.getElementById("orders-view");
  document.getElementById("app").innerHTML = ordersView.innerHTML;

  initForm();
  initData();
};

const renderLogin = () => {
  const loginView = document.getElementById("login-view");
  document.getElementById("app").innerHTML = loginView.innerHTML;

  const formLogin = document.getElementById("login-form");
  formLogin.onsubmit = (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(API_URI + "/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((x) => x.json())
      .then((res) => {
        localStorage.setItem("token", res.token);
        route = "orders";
        return res.token;
      })
      .then((token) => {
        return fetch(API_URI + "/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        })
      })
      .then((x) => x.json())
      .then(fetchedUser => {
        localStorage.setItem("user", JSON.stringify(fetchedUser));
        user = fetchedUser;
        renderOrders();
      });
  };
};

window.onload = () => {
  renderApp();
};
