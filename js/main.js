const API_URI = "https://serverless-aq7pou9ax-mrp4sten.vercel.app";

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
    `<li id="${order._id}">${meal.name} ${meal.user_id}</li>`,
  );
  return element;
};

window.onload = () => {
  const orderForm = document.getElementById("order");
  orderForm.onsubmit = (e) => {
    e.preventDefault();
    const mealId = document.getElementById("meals-id");
    const mealIDValue = mealId.value;

    if (!mealIDValue) {
      alert("You should select a meal");
      return;
    }

    const order = {
      meal_id: mealIDValue,
      user_id: "user",
    };

    fetch(API_URI + "/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    }).then((x) => console.log(x));
  };

  fetch(API_URI + "/api/meals")
    .then((res) => res.json())
    .then((data) => {
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
