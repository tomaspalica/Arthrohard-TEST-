import { getProducts } from "./api/productFetch";

const productList = document.querySelector(".product__list");
const productSelect = document.querySelector(".product__standard-select");
const infoWrapper = document.querySelector(".about__info-wrapper");
const navigationList = document.querySelector(".navigation__list");
const aboutList = document.getElementById("about__list");
const ingredients = document.getElementById("ingredients");
const products = document.getElementById("products");
const navLinks = document.querySelectorAll(".navigation__list-element a");
const mainWrapper = document.querySelector(".about__description-wrapper");
const modalWrapper = document.querySelector(".modal__wrapper");
const modalCloseButton = document.querySelector(".modal__close-button");
let pageNumber = 1;
let pageSize = 20;

const createList = async (pageSize = 20, page = 1) => {
  const products = await getProducts(page, pageSize);
  products.data.forEach((element) => {
    const item = document.createElement("li");
    item.classList.add("product__list-element");
    item.innerHTML = `ID: ${element.id}`;
    item.id = element.id;
    item.setAttribute("name", element.name);
    item.value = element.value;
    productList.appendChild(item);
  });
};
productSelect.addEventListener("change", (e) => {
  productList.innerHTML = "";
  pageNumber = 1;
  pageSize = e.target.value;

  createList(pageSize, pageNumber);
});

let throttleTimer;
const throttle = (callback, time) => {
  if (throttleTimer) return;
  throttleTimer = true;
  setTimeout(() => {
    callback();
    throttleTimer = false;
  }, time);
};
window.addEventListener("scroll", () => {
  throttle(() => {
    if (
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight
    ) {
      console.log(pageSize);
      console.log(pageNumber);
      pageNumber += 1;
      createList(pageSize, pageNumber);
    }
  }, 1000);
});

const sections = [aboutList, ingredients, products];
console.log(sections);
function checkSection() {
  let currentIndex = -1;

  sections.forEach((section, index) => {
    if (window.scrollY + 200 >= section.offsetTop) {
      currentIndex = index;
    }
  });

  navLinks.forEach((link, index) => {
    if (index === currentIndex) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}
window.addEventListener("scroll", checkSection);

function closeModal() {
  modalWrapper.classList.add("hidden");
}
modalCloseButton.addEventListener("click", closeModal);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});
function openModal(e) {
  if (e.target.tagName !== "LI") {
    return;
  }
  document.querySelector(".modal__id").innerHTML = `ID ${e.target.id}`;
  document.querySelector(
    ".modal__name"
  ).innerHTML = `Nazwa: ${e.target.getAttribute("name")}`;
  document.querySelector(
    ".modal__value"
  ).innerHTML = `Wartość: ${e.target.value}`;
  modalWrapper.classList.remove("hidden");
}
productList.addEventListener("click", openModal);
createList();
