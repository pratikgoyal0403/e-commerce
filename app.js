const cartIcon = document.querySelector(".cart-icon i"); // this selects cart-icon
const shoppingCart = document.querySelector(".shopping-cart"); //shopping cart
const crossCartIcon = shoppingCart.querySelector(".close-icon");
const backdrop = document.querySelector(".backdrop");
const homepage = document.querySelector(".home-page");
const navBar = document.querySelector("header");
const cartContainer = shoppingCart.querySelector(".cart-items");
const productContainer = document.querySelector(".products-showcase");
const totalPriceTag = shoppingCart.querySelector(".price-tag");
const cartItems = [];
let addTocartBtn;
let totalPrice = 0;
//available products
const products = [
  {
    name: "redmi note 9 pro",
    imgsrc: "./phone-images/note 9 pro max.jpg",
    price: 14000,
    quantity: 1,
    purchaseState: "add to cart"
  },
  {
    name: "realme 6 pro",
    imgsrc: "./phone-images/realme 6 pro.jpg",
    price: 16000,
    quantity: 1,
    purchaseState: "add to cart"
  },
  {
    name: "pixel 3 Xl",
    imgsrc: "./phone-images/pixel 3 XL.jpg",
    price: 55000,
    quantity: 1,
    purchaseState: "add to cart"
  },
  {
    name: "oneplus 7 pro",
    imgsrc: "./phone-images/oneplus 7 pro.jpg",
    price: 51000,
    quantity: 1,
    purchaseState: "add to cart"
  },
  {
    name: "samsung s20 ultra",
    imgsrc: "./phone-images/s20.jpg",
    price: 104000,
    quantity: 1,
    purchaseState: "add to cart"
  },
  {
    name: "iphone 11 pro max",
    imgsrc: "./phone-images/iphone11.jpg",
    price: 125000,
    quantity: 1,
    purchaseState: "add to cart"
  }
];

//functions start here
//setting up intersection observer
const option = {
  threshold: 0.5
};

const obeserver = new IntersectionObserver(el => {
  if (!el[0].isIntersecting) {
    navBar.classList.add("header-fixed");
  } else {
    navBar.classList.remove("header-fixed");
  }
}, option);

obeserver.observe(homepage);
/////////////////////////////SHOP CODING STARTS HERE////////////////////////////////////
//render products to the shop
const renderProductsToShop = () => {
  let html;
  productContainer.innerHTML = "";
  products.map((product, index) => {
    html = `<div class="product-1">
        <div class="phone-1">
            <img src="${product.imgsrc}" alt="phone" class="product-img">
            <div class="product-backdrop"></div>
            <div class="phone-in-cart" data-id=${index}>${product.purchaseState}</div>
        </div>
        <div class="product-info">
            <p class="product-name">${product.name}</p>
            <p class="product-price"><span>₹</span>${product.price}</p>
        </div>
    </div>`;
    productContainer.insertAdjacentHTML("beforeend", html);
  });
  addListnersToGeneratedProducts();
};

const addListnersToGeneratedProducts = () => {
  addTocartBtn = Array.from(document.querySelectorAll(".phone-in-cart"));
  addTocartBtn.map(btn => {
    btn.addEventListener("click", addProductToCart);
  });
};

//show cart
const showCartHandler = () => {
  shoppingCart.style.transform = "translateX(0%)";
  backdrop.style.display = "block";
};
//intesection observer ends here

//hide cart
const hideCartHandler = () => {
  shoppingCart.style.transform = "translateX(100%)";
  backdrop.style.display = "none";
};

//add product to cart
const addProductToCart = event => {
  if (cartItems.length === 0) {
    cartContainer.innerHTML = "<h1>cart is empty</h1>";
  }
  const targetElement =
    event.target.parentElement.nextElementSibling.children[0];
  const selectedphoneName = targetElement.innerText;
  const selectedPhoneIndex = products.findIndex(product => {
    return product.name == selectedphoneName;
  });
  if (productIsInCart(selectedPhoneIndex)) {
    const selectedProduct = products[selectedPhoneIndex];
    const updateProduct = {
      ...selectedProduct,
      id: event.target.dataset.id
    };
    cartItems.push(updateProduct);
    selectedProduct.purchaseState = "in cart";
    showCartHandler();
    renderCartProducts();
    totalPriceHandler();
  }
};
//check whether product is in cart or not
const productIsInCart = index => {
  const badge = document.querySelector(`[data-id="${index}"]`);
  if (products[index].purchaseState === "add to cart") {
    badge.innerText = "in cart";
    return true;
  } else {
    return false;
  }
};

//render the products selected
const renderCartProducts = () => {
  let html;
  cartContainer.innerHTML = "";
  cartItems.map(product => {
    html = `  <div class="cart-product">
            <div class="cart-item">
                <img src="${product.imgsrc}" alt="phone" class="cart-img" />
                <div class="cart-info">
                   <p class="cart-product-name">${product.name}</p>
                   <p class="price">${product.price}</p> 
                   <p class="remove" data-cartid=${product.id}>remove</p>
                </div>
            </div>
            <div class="quantity">
                <div class="increase"><i class="fa fa-angle-up"></i></div>
                <div class="show-quantity">${product.quantity}</div>
                <div class="decrease"><i class="fa fa-angle-down"></i></div>
            </div>
            </div>`;
    cartContainer.insertAdjacentHTML("beforeend", html);
  });
  addListnersToGeneratedElements();
};
//add event listners to the item generated when rendering products
const addListnersToGeneratedElements = () => {
  const removeProductBtn = Array.from(
    cartContainer.querySelectorAll(".remove")
  );

  removeProductBtn.map(btn => {
    btn.addEventListener("click", removeItemFromCart.bind(event));
  });
  const increaseBtn = Array.from(
    cartContainer.querySelectorAll(".fa-angle-up")
  );
  increaseBtn.map(btn => {
    btn.addEventListener("click", increaseQuantity);
  });
  const decreaseBtn = Array.from(
    cartContainer.querySelectorAll(".fa-angle-down")
  );
  decreaseBtn.map(btn => {
    btn.addEventListener("click", decreaseQuantity);
  });
};
//remove items from cart
const removeItemFromCart = event => {
  const targetElement = event.target.parentElement.children[0];
  const targetElementIndex = cartItems.findIndex(item => {
    return targetElement.innerText === item.name;
  });
  cartItems.splice(targetElementIndex, 1);

  if (cartItems.length === 0) {
    cartContainer.innerHTML = '<h1 class="empty-cart">cart is empty</h1>';
  } else {
    renderCartProducts();
  }
  totalPriceHandler();
  modifyProductsPurchaseState(event.target.dataset.cartid);
};
//modify products pruchase state of products
const modifyProductsPurchaseState = productId => {
  products[productId].purchaseState = "add to cart";
  document.querySelector(`[data-id="${productId}"]`).innerText = "add to cart";
};
//outputting total price
const totalPriceHandler = () => {
  const grandTotal = cartItems
    .map(product => {
      return product.price * product.quantity;
    })
    .reduce((prevValue, currValue) => {
      return prevValue + currValue;
    }, 0);
  totalPriceTag.innerText = grandTotal;
};
//increase product quantity
const increaseQuantity = event => {
  const targetId =
    event.target.parentElement.parentElement.previousElementSibling.children[1]
      .children[2].dataset.cartid;
  const cartIndex = cartItems.findIndex(item => {
    return products[targetId].name === item.name;
  });
  if (products[targetId].quantity < 5) {
    products[targetId].quantity++;
    cartItems[cartIndex].quantity = products[targetId].quantity;
    event.target.parentElement.nextElementSibling.innerText =
      products[targetId].quantity;
  }
  totalPriceHandler();
};
//decrease Product quantity
const decreaseQuantity = event => {
  const targetId =
    event.target.parentElement.parentElement.previousElementSibling.children[1]
      .children[2].dataset.cartid;
  const cartIndex = cartItems.findIndex(item => {
    return products[targetId].name === item.name;
  });
  if (products[targetId].quantity > 1) {
    products[targetId].quantity--;
    cartItems[cartIndex].quantity = products[targetId].quantity;
    event.target.parentElement.previousElementSibling.innerText =
      products[targetId].quantity;
  }
  totalPriceHandler();
};
renderProductsToShop();
///event listners

cartIcon.addEventListener("click", showCartHandler); //this adds event listner to the cart icon
crossCartIcon.addEventListener("click", hideCartHandler); //this handles cart hide
backdrop.addEventListener("click", hideCartHandler);
