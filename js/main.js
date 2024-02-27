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
const ProductAddModal = new bootstrap.Modal(modalElement, {
    keyboard: false
});

// Local storage init
if (!LS.hasItem("products")) {
    LS.setItem("products", []);
}

const options = {
    valueNames: ["name"]
};

let userList;

actionAddProductButton.addEventListener("click", () => {
    const name = productName.value;
    const price = productPrice.value;
    const count = productCount.value;

    if (name && price && count) {
        // LS.pushToItem("products", [IDGEN.gen(), name, product, count, 0, 0, 0]);
        LS.pushToItem("products", {
            id: IDGEN.gen(),
            name: name,
            price: price,
            productsInStoreCount: count,
            productsInCartCount: 0,
            discountPercentage: 0,
            priceWithDiscount: 0
        });
        updateState();
        ProductAddModal.hide();
    } else {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Fill all the fields"
        })
    }
});

updateState();

// Listeners
storeProductsList.addEventListener("click", (event) => { 
    console.log(event.target);
    console.log(event.currentTarget);

    // if (!event.currentTarget.dataset.productId) {
    if (event.target.classList.contains("product-delete-button")) {

        Swal.fire({
            title: "Attention!",
            text: "Do you really want to delete the product?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#dd3333",
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                let products = JSON.parse(localStorage.getItem("products"));
                for (let i = 0; i < products.length; ++i) { // Hello from C++
                    if (products[i].id === event.target.dataset.productId) {
                        products.splice(i, 1);
                        localStorage.setItem("products", JSON.stringify(products));
                        updateState();
                    }
                }
                Swal.fire({
                    title: "Success!",
                    text: "The product was successfully deleted",
                    icon: "success"
                })
            }
        })
    } else if (event.target.classList.contains("product-add-to-cart-button")) {
        let products = JSON.parse(localStorage.getItem("products"));
        console.log("sf", products);
        for (let i = 0; i < products.length; ++i) { // Hello from C++
            if (Number(products[i].productsInStoreCount) > 0 && products[i].id === event.target.dataset.productId) {
                console.log("tut");
                products[i].productsInStoreCount = products[i].productsInStoreCount - 1;
                products[i].productsInCartCount = products[i].productsInCartCount + 1;
                localStorage.setItem("products", JSON.stringify(products));
                updateState();
            }
        }
    }
});

cartProductsTable.addEventListener("click", (event) => {
    if (event.target.classList.contains("product-cancel-button")) {
        let products = JSON.parse(localStorage.getItem("products"));
        console.log("sf", products);
        for (let i = 0; i < products.length; ++i) { // Hello from C++
            if (Number(products[i].productsInCartCount) > 0 && products[i].id === event.target.dataset.productId) {
                console.log("tut");
                products[i].productsInStoreCount = products[i].productsInStoreCount + 1;
                products[i].productsInCartCount = products[i].productsInCartCount - 1;
                localStorage.setItem("products", JSON.stringify(products));
                updateState();
            }
        }
    }
});

// Function definitions
function updateState() {
    let resultPrice = 0;
    removeChildren(storeProductsList);
    removeChildren(cartProductsList);
    let products = LS.getItem("products");
    if (products.length) {
        storeProductsTable.hidden = false;
        cartProductsTable.hidden = false;
        for (let i = 0; i < products.length; ++i) { // Hello from C++
            const { id, name, price, productsInStoreCount, productsInCartCount, discountPercentage, priceWithDiscount } = products[i];

            // Update store table

            const tr = document.createElement("tr");
            tr.classList.add("align-middle");

            // Product index
            const tdProductNumber = document.createElement("td");
            tdProductNumber.innerHTML = i + 1;

            // Product name
            const tdProductName = document.createElement("td");
            tdProductName.classList.add("name"); // The class 'name' exists for List.js cases
            tdProductName.innerHTML = name;

            // Product price
            const tdProductPrice = document.createElement("td");
            tdProductPrice.innerHTML = price;

            // Products is store count
            const tdProductCount = document.createElement("td");
            tdProductCount.innerHTML = productsInStoreCount;

            // Button "Delete product"
            const tdProductDeleteButton = document.createElement("td");
            const buttonProductDelete = document.createElement("button");
            buttonProductDelete.classList.add("product-delete-button", "btn", "btn-danger");
            buttonProductDelete.dataset.productId = id;
            buttonProductDelete.innerHTML = "&#10006;";
            tdProductDeleteButton.append(buttonProductDelete);

            // Button "Add product to the cart"
            const tdProductAddToCartButton = document.createElement("td");
            const buttonProductAddToCart = document.createElement("button");
            buttonProductAddToCart.classList.add("product-add-to-cart-button", "btn", "btn-primary");
            buttonProductAddToCart.dataset.productId = id;
            buttonProductAddToCart.innerHTML = "&#10149;";
            tdProductAddToCartButton.append(buttonProductAddToCart);


            tr.append(
                tdProductNumber,
                tdProductName,
                tdProductPrice,
                tdProductCount,
                tdProductDeleteButton,
                tdProductAddToCartButton
            )
            storeProductsList.append(tr);

            // Update cart table
            if (productsInCartCount > 0) {
                products[i].priceWithDiscount = productsInCartCount * price * (1 - discountPercentage * 0.01);
                resultPrice += Number(products[i].priceWithDiscount);

                const tr = document.createElement("tr");
                tr.classList.add("align-middle");

                // Product index
                const tdProductNumber = document.createElement("td");
                tdProductNumber.innerHTML = i + 1;

                // Product name
                const tdProductName = document.createElement("td");
                // tdProductName.classList.add("price_name");
                tdProductName.innerHTML = name;

                // Product price
                const tdProductPrice = document.createElement("td");
                // tdProductPrice.classList.add("price_one");
                tdProductPrice.innerHTML = price;

                // Product in cart count
                const tdProductCount = document.createElement("td");
                // tdProductCount.classList.add("price_count");
                tdProductCount.innerHTML = productsInCartCount;

                // Product discount
                const tdProductDiscount = document.createElement("td");
                // tdProductDiscount.classList.add("price_count");
                const tdProductDiscountInput = document.createElement("input");
                tdProductDiscountInput.dataset.productId = id;
                tdProductDiscountInput.type = "text";
                tdProductDiscountInput.value = discountPercentage;
                tdProductDiscountInput.min = "0";
                tdProductDiscountInput.max = "100";
                tdProductDiscount.append(tdProductDiscountInput);

                // Product price with discount
                const tdProductPriceWithDiscount = document.createElement("td");
                // tdProductPriceWithDiscount.classList.add("price_count");
                tdProductPriceWithDiscount.innerHTML = products[i].priceWithDiscount;

                // Button "Delete product"
                const tdProductDeleteButton = document.createElement("td");
                const buttonProductDelete = document.createElement("button");
                buttonProductDelete.classList.add("product-cancel-button", "btn", "btn-danger");
                buttonProductDelete.dataset.productId = id;
                buttonProductDelete.innerHTML = "&#10006;";
                tdProductDeleteButton.append(buttonProductDelete);

                tr.append(
                    tdProductNumber,
                    tdProductName,
                    tdProductPrice,
                    tdProductCount,
                    tdProductDiscount,
                    tdProductPriceWithDiscount,
                    tdProductDeleteButton,
                    // tdProductAddToCartButton
                )
                cartProductsList.append(tr);
            }

        }
        userList = new List("store", options);
    } else {
        storeProductsTable.hidden = true;
        cartProductsTable.hidden = true;
    }
    cartTotalPriceValue.innerHTML = resultPrice;
}

function removeChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
