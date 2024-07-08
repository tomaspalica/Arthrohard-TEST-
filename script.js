import { getProducts } from "./api/productFetch.js";

const productList = document.querySelector(".product__list");
const productSelect = document.querySelector(".product__standard-select");
const aboutList = document.getElementById("about__list");
const ingredients = document.getElementById("ingredients");
const products = document.getElementById("products");
const navLinks = document.querySelectorAll(".navigation__list-element a");
const modalWrapper = document.querySelector(".modal__wrapper");
const modalCloseButton = document.querySelector(".modal__close-button");
let pageNumber = 1;
let pageSize = 20;
let loading = false;
let throttleTimer;
const throttle = (callback, time) => {
  if (throttleTimer) return;
  throttleTimer = true;
  setTimeout(() => {
    callback();
    throttleTimer = false;
  }, time);
};

// function that creates and adds to dom products to the list
const createList = async (pageSize = 20, page = 1) => {
  if (loading) return;
  loading = true;
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
  loading = false;
  observer.disconnect();
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !loading) {
        createList();
      }
    });
  },
  {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  }
);
// changes products amount that is requested from api
productSelect.addEventListener("change", (e) => {
  productList.innerHTML = "";
  pageNumber = 1;
  pageSize = e.target.value;

  createList(pageSize, pageNumber);
});

// infinit scroll
window.addEventListener("scroll", () => {
  throttle(() => {
    if (
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight
    ) {
      pageNumber += 1;
      createList(pageSize, pageNumber);
    }
  }, 1000);
});

const sections = [aboutList, ingredients, products];

// highlights headers navLinks when user sees the coresponding section

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
// closes modal
function closeModal() {
  modalWrapper.classList.add("hidden");
}
modalCloseButton.addEventListener("click", closeModal);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});
// opens modal
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
// lazy loading
observer.observe(productList);
