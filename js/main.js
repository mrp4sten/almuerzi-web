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
  });

  return element;
};

window.onload = () => {
  fetch("https://serverless-aq7pou9ax-mrp4sten.vercel.app/api/meals")
    .then((res) => res.json())
    .then((data) => {
      const mealsList = document.getElementById("meals-list");
      const btnSubmit = document.getElementById("btnSubmit");

      const listItems = data.map(renderItem);

      mealsList.removeChild(mealsList.firstElementChild);
      listItems.forEach((element) => mealsList.appendChild(element));

      btnSubmit.removeAttribute("disabled");
    });
};
