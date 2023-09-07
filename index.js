const container = document.querySelector('.container');
const search = document.querySelector('.search');
const cart = document.querySelector('.cart');
const cartContent = document.querySelector('.cart-content')
const cartParent = document.querySelector('.cart-parent')
const cartLength = document.querySelector('.cart span')
let shoppingCart = [];


function fetchProducts(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      populateCategory(data.products)
      paginate(data.products,0)
    })
    .catch((err) => console.log(err));
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('loaded');
  fetchProducts('https://dummyjson.com/products');
});

search.addEventListener('input', (e) => {
  const query = e.target.value;
  fetch(`https://dummyjson.com/products/search?q=${query}`)
    .then((res) => res.json())
    .then((data) => {
      // Clear previous search results before displaying new ones
      container.innerHTML = '';
      paginate(data.products,0);
    })
    .catch((err) => console.log(err));
});

function populateDom(data) {
  data.forEach((item) => {
    const product = document.createElement('div');
    product.classList.add('product');
    product.setAttribute('id', `${item.id}`);
    product.innerHTML = `
      <img src='${item.thumbnail}'/>
      <div class="info">
        <h2>${item.title.slice(0,18)}</h2>
        <p>
          ${item.description.slice(0, 40)}  <span class='read-more'>...read more</span>
        </p>
        <h5>$${item.price}</h5>
      </div>
      <div class="buttons">
        <button>Add to cart</button>
      </div>`;
    container.appendChild(product);

    // Attach the event listener for adding items to the cart
    product.querySelector('button').addEventListener('click', (e) => {
      if(e.target.textContent  === 'Add to cart'){
        shoppingCart.push(item);
        updateCartUI(); // Update the UI to reflect the change
        e.target.textContent = 'Remove from cart'
        e.target.style.backgroundColor = 'red'

      }else if(e.target.textContent === 'Remove from cart'){
        shoppingCart = shoppingCart.filter(item => item.id !== Number(product.id))
        updateCartUI(); // Update the UI to reflect the change
        e.target.textContent = 'Add to cart'
        e.target.style.backgroundColor = '#2874F0'
     }
    });
  });
}

cart.addEventListener('click',() => {
 const closeCard = document.querySelector('.close-cart svg');
 const clearCard = document.querySelector('.clear-cart');
 cartParent.style.display = 'flex'
 closeCard.addEventListener('click', () => cartParent.style.display = 'none')
 clearCard.addEventListener('click', () =>  {
  shoppingCart = [];
  updateCartUI()
 })

  
})

function updateCartUI() {
  // You can update the shopping cart UI here if needed
  console.log('Shopping cart:', shoppingCart);
  cartLength.textContent = shoppingCart.length

  populateCard()
  calculateTotal()
}
function calculateTotal(){
  const result = shoppingCart.reduce((acc, item) => {
    acc.totalQty += 1; // Increment the total quantity
    acc.totalPrice += item?.price; // Add the item's price to the total price
    return acc; // Return the updated accumulator
  }, { totalQty: 0, totalPrice: 0 });

  const totalItems = document.querySelector('.total-items')
  const totalPrice = document.querySelector('.total-price');
  totalItems.textContent = `Total Quantity: ${result.totalQty}`;
  totalPrice.textContent = `Total Price : $${result.totalPrice}`;

}

function populateCard(){
  cartContent.innerHTML = ''
  shoppingCart.forEach((item) => {
      const singleC = document.createElement('div');
      singleC.setAttribute('id', item.id)
      singleC.classList.add('singleC')
      singleC.innerHTML = `
      <img src='${item.thumbnail}'/>
        <h2>${item.title}</h2>
        <h5>$${item.price}</h5>
        <span class='trash'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
      </span>
        `
      cartContent.appendChild(singleC)
      // remove from cart
      const allCard = document.querySelectorAll('.singleC');
      allCard.forEach((cart) => {
        cart.querySelector('.trash').addEventListener('click', (e) => {
        shoppingCart =  shoppingCart.filter(item => item.id !== Number(cart.id))
        updateCartUI()
        })
      })

    })
    
  // Add logic to display the cart contents or calculate the total price
}

function populateCategory(data){
  const categories = document.querySelector('.categories');
  const allCategories = data.map(item => item.category)
  let uniqueCategories = ['All'];
  for(let i =0; i< allCategories.length; i++){
    if(!uniqueCategories.includes(allCategories[i])){
      uniqueCategories.push(allCategories[i])
    }
  }
  uniqueCategories.forEach((item) => {
    const category = document.createElement('div');
    category.classList.add('category');
    category.textContent = item;
    categories.appendChild(category)
  })

  const allCategory = document.querySelectorAll('.category');
  allCategory.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      allCategory.forEach(cate => {
        cate.classList.remove('active')
      })
      e.target.classList.add('active')
      const query = e.target.textContent
      if(query === 'All'){
        fetch(`https://dummyjson.com/products/`)
      .then((res) => res.json())
      .then((data) => {
        // Clear previous search results before displaying new ones
        container.innerHTML = '';
        paginate(data.products, 0);
      })
      }
      fetch(`https://dummyjson.com/products/category/${query}`)
      .then((res) => res.json())
      .then((data) => {
        // Clear previous search results before displaying new ones
        container.innerHTML = '';
        populateDom(data.products);
      })
      .catch((err) => console.log(err));
    })
  })
  
}

function paginate(data, currentPage){
  const pagination = document.querySelector('.pagination');
  const itemsPerPage = 6;
  let startIndex = itemsPerPage * currentPage 
  const endIndex = startIndex + itemsPerPage;
  const totalPages = data.length / itemsPerPage ;
  console.log(startIndex,endIndex, totalPages)
  const sliceData = data.slice(startIndex,endIndex);

  container.innerHTML = '';
  populateDom(sliceData)
  pagination.innerHTML = ''
  for(let i = 1 ;i<totalPages + 1; i++){
    const button = document.createElement('button');
    button.innerText = i;
    pagination.appendChild(button);
  }
   // Add 'active' class to the current page button
  const allButtons = document.querySelectorAll('.pagination button');
  allButtons[currentPage].classList.add('active');

  allButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      currentPage = Number(e.target.textContent - 1)
      paginate(data,currentPage)
    })
  })
}