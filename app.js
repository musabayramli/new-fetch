let DATA = [];
const div = document.querySelector("#photos");
const openBtn = document.querySelector("#open");
const cartItemsDiv = document.querySelector("#cart-items");
let cart = [];
let displayedItems = 0;
const ITEMS_PER_LOAD = 12;

cartItemsDiv.innerHTML = '';


// Bütün məhsul məlumatlarını fetch edən funksiya

function allData() {
  fetch("https://jsonplaceholder.typicode.com/photos")
    .then((response) => response.json())
    .then((data) => {
      DATA = data;
      renderData();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Məhsulları görüntüləyən funksiya

function renderData() {
  const itemsToDisplay = DATA.slice(
    displayedItems,
    displayedItems + ITEMS_PER_LOAD
  );

  itemsToDisplay.forEach((item) => {
    const isLongTitle = item.title.length > 50;
    const displayedTitle = isLongTitle ? item.title.slice(0, 50) + '...' : item.title;
    const showMore = isLongTitle ? `<span class="show-more" onclick="showFullTitle(this, '${item.title}')"> ︾</span>` : '';

    div.innerHTML += `
      <div class="product">
        <p class="cart_id">${item.id}</p>
        <h4>${displayedTitle} ${showMore}</h4>
        <img src="${item.url}" alt="${item.title}"/> 
        <button onclick="addToCart(${item.id}, '${item.title}', '${item.url}')">Add to Cart</button>
      </div>
    `;
  });

  displayedItems += itemsToDisplay.length;

  if (displayedItems >= DATA.length) {
    document.querySelector("#load-more").style.display = "none";
  }
}

// Başlığı tam görünəndə və ya gizlənəndə çağırılan funksiya

function showFullTitle(icon, fullTitle) {
    const h4Element = icon.closest('.product').querySelector('h4'); 
    if (h4Element) {
      h4Element.innerHTML = fullTitle;
      icon.style.display = 'none'; 
    }
  }
  
// Səbətə məhsul əlavə edən funksiya

function addToCart(id, title, url) {
  const itemInCart = cart.find((item) => item.id === id);
  if (itemInCart) {
    itemInCart.quantity += 1;
  } else {
    cart.push({ id, title, url, quantity: 1 });
  }

  if (openBtn.innerText === "Close") {
    renderCart();
  }
}

// Səbətdən məhsulu silən funksiya

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
}


// Səbətdəki məhsulun sayını artıran funksiya

function increaseQuantity(id) {
  const itemInCart = cart.find((item) => item.id === id);
  if (itemInCart) {
    itemInCart.quantity += 1;
  }
  renderCart();
}

// Səbətdəki məhsulun sayını azaldan funksiya

function decreaseQuantity(id) {
  const itemInCart = cart.find((item) => item.id === id);
  if (itemInCart) {
    if (itemInCart.quantity > 1) {
      itemInCart.quantity -= 1;
    } else {
      removeFromCart(id);
    }
  }
  renderCart();
}


// Səbət içindəki məhsulları görüntüləyən funksiya

function renderCart() {
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>No items in cart</p>";
    document.querySelector("#clear-cart").style.display = 'none'; 
    return;
  }

  let html = "";
  cart.forEach((item) => {
    html += `
      <div>
        <img src="${item.url}" alt="${item.title}" style="width: 50px;"/>
        <button onclick="increaseQuantity(${item.id})">+</button>
        <span>(x${item.quantity})</span>
        <button onclick="decreaseQuantity(${item.id})">-</button>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
  });

  cartItemsDiv.innerHTML = html;
  document.querySelector("#clear-cart").style.display = 'block'; 
}


// open/close düyməsinə tıkladıqda çağırılan funksiya
openBtn.addEventListener("click", () => {
  if (openBtn.innerText === "Open") {
    renderCart(); 
    openBtn.innerText = "Close";
  } else if (openBtn.innerText === "Close") {
    openBtn.innerText = "Open";
    cartItemsDiv.innerHTML = ''; 
    document.querySelector("#clear-cart").style.display = 'none'; 
  }
});


// "Clear Cart" düyməsinə tıkladıqda çağırılan funksiya

document.querySelector("#clear-cart").addEventListener("click", () => {
  cart = [];
  renderCart();
});

// "Load More" düyməsinə tıkladıqda çağırılan funksiya
document.querySelector("#load-more").addEventListener("click", renderData);


// Başlanğıcda məhsul məlumatlarını yükləyir
allData();
