const productContainer = document.querySelector("#product-container");
const form = document.querySelector("#product-search");

const getProductsQuery = (keyword) => `{ products(where: {name_contains: "${keyword}"}) { name image { url(transformation: {document: {output: {format: webp}}}) } price } }`;

const renderProducts = ({ data }) => {
  const { products = [] } = data;

  // while (productContainer.firstChild) {
  //   productContainer.removeChild(productContainer.firstChild);
  // }
  const productCards = document.querySelectorAll(".product-card");
  Array.prototype.forEach.call( productCards, function( node ) {
    node.parentNode.removeChild( node );
  });


  const productFragment = document.createDocumentFragment();
  products.forEach((product) => {
    const productDiv = document.createElement('div');
    productDiv.className = "col-lg-4 col-sm-6 product-card"
    
    const featureItemDiv = document.createElement('div');
    featureItemDiv.className = "feature_item"
    const productLink = document.createElement('a');
    productLink.href = "index.html";
    productLink.textContent = "";
    featureItemDiv.textContent = `${product.name} $${product.price}`;
    featureItemDiv.appendChild(productLink);
    const productImgDiv = document.createElement('div');
    productImgDiv.className = "f_icon"
    const productImg = document.createElement('img');
    productImg.src = `${product.image[0].url}`;
    productImg.className = "col-lg-4 col-sm-6";
    productImgDiv.appendChild(productImg);
    featureItemDiv.appendChild(productImgDiv);
    productDiv.appendChild(featureItemDiv);
    productFragment.appendChild(productDiv);
  });

  productContainer.parentNode.appendChild(productFragment);
}

const loadProducts = (ev) => {
  ev.preventDefault();
  const keyword = form.elements["search"].value;

  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: getProductsQuery(keyword)
    })
  };

  fetch(`https://api-eu-central-1.graphcms.com/v2/ckms70okg4hzn01z6133ear3s/master`, options)
    .then(res => res.json())
    .then(renderProducts);

  form.reset();
}

form.addEventListener("submit", loadProducts)
