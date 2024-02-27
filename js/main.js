import { LocalStorageHelper } from "./LocalStorageHelper.js";
import { IdGen } from "./IdGen.js";

// General elements
const modalElement = document.getElementById("addProductModal");
const actionAddProductButton = document.getElementById("actionAddProductButton");
const storeProductsList = document.getElementById("storeProductsList");
const cartProductsList = document.getElementById("cartProductsList");
const storeProductsTable = document.getElementById("storeProductsTable");
const cartProductsTable = document.getElementById("cartProductsTable");
const cartTotalPriceValue = document.getElementById("cartTotalPriceValue");

// Modal fields
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productCount = document.getElementById("productCount");

// Instances
const IDGEN = new IdGen();
const LS = new LocalStorageHelper();
const ItemAddModal = new bootstrap.Modal(modalElement, {
    keyboard: false
});

// Local storage init
if (!LS.hasItem("items")) {
    LS.setItem("items", []);
}

actionAddItemButton.addEventListener("click", () => {
    const name = itemName.value;
    const item = itemPrice.value;
    const count = itemCount.value;

    if (name && item && count) {
        LS.pushToItem("items", [IDGEN.gen(), name, item, count, 0, 0, 0]);
        ItemAddModal.hide();
    } else {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Fill all the fields"
        })
    }
});