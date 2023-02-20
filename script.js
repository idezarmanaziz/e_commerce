let productCache = null;
let searchProduct = null;
window.BASE_URL = "https://fakestoreapi.com/products";
const baseUrl = window.BASE_URL;
const fetchProducts = async () => {
  const products = await fetch(baseUrl);
  return await products.json();
};

const getProduct = async () => {
  if (!productCache) {
    const products = await fetchProducts();
    productCache = products;
    searchProduct = products;
  }
  return renderProduct(productCache);
};

const productByCategory = (productCategory) => {
  const filteredProduct = productCache.filter((product) => product.category === productCategory.toLowerCase());
  renderProduct(filteredProduct);
};

const findProduct = (productID) => {
  const findProduct = productCache.find((product) => product.id === productID);
  renderProductDetail(findProduct);
};

const inputForm = document.querySelector(".input-form");
const searchInput = document.querySelector(".search-input");
inputForm.addEventListener("keyup", () => {
  const inputValue = searchInput.value;
  searchProduct = productCache.filter((product) => {
    return product.title.toLowerCase().includes(inputValue.toLowerCase());
  });
  renderProduct(searchProduct);
});

const format = (price) => {
  return price.toLocaleString('us-US', {style: 'currency', currency: 'USD'})
}

const renderProduct = (products) => {
  let content = "";
  products.length < 1
    ? (content = `<h6 class="mt-3">Sorry, no products matched your search</h6>`)
    : products.map((product) => {
        const { id, image, title, price } = product;
        content += `<div class="container">
                    <div class="card mt-5">
                        <img style="cursor: pointer" loading="lazy" src="${image}" class="img card-img-top ${id}" width="200" height="300" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <div class="card-body">
                            <h5 class="card-title fs-6">${title}</h5>
                            <h5 class="card-title">${format(price)}</h5>
                            <a href="#" class="btn btn-primary">Order Now</a>
                          </div>
                      </div>
                  </div>`;
      });
  productList.innerHTML = content;
};

const renderProductDetail = (product) => {
  const modalBody = document.querySelector(".modal-body");
  const { image, category, price, description } = product;
  let content = "";
  content += `<div class="container-fluid">
                <div class="row">
                    <div class="col-md-4">
                        <img src="${image}" class="img-fluid">
                    </div>
                    <div class="col-md-8">
                    <ul class="list-group">
                        <li class="list-group-item">
                        <h3></h3></li>
                        <li class="list-group-item">Category:
                        ${category}</li>
                        <li class="list-group-item">Price:<h5>
                        ${format(price)}</h5></li>
                        <li class="list-group-item">Description:<p>
                        ${description}</p></li>
                      </ul>
                  </div>
              </div>
            </div>`;
  modalBody.innerHTML = content;
};

const productList = document.querySelector("#product_list");
productList.addEventListener("click", (e) => {
  const { target } = e;
  const productID = parseInt(target.classList[2]);
  return target.classList.contains("img") ? findProduct(productID) : false;
});

const navCategory = document.querySelectorAll(".dropdown-item");
navCategory.forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = e.target.textContent;
    target === "All Product" ? getProduct() : productByCategory(target);
  });
});

getProduct();