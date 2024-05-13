// Parse user data from local storage
const userData = JSON.parse(localStorage.getItem("user"));

// Extract user ID and initialize total price
const userId = userData._id;
let totalPrice = 0;

// Extract product IDs from user's cart items
const productIds = userData.cart.items.map(item => item.productId);


function getDataPlease(){
// Create request body
const requestBody = JSON.stringify({
    userId: userId,
    productIds: productIds
});

// Fetch data from server
fetch('http://localhost:3000/api/products/cart-items', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: requestBody
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response body as JSON
    })
    .then(data => {


      const prices = data.map(item => item.price);
      const sum = prices.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      const tax = (sum * 0.16);
      const total = sum + tax;

      // Format and display cart summary
      const formattedTotal = total.toFixed(2);
      document.getElementById("col-md-4").innerHTML = `
    <div class="border p-3 mb-3">
      <h3 class="mb-3">Cart Summary</h3>
      <div class="d-flex justify-content-between">
        <span>Subtotal</span>
        <span>$ ${sum}.00</span>
      </div>
      <div class="d-flex justify-content-between">
        <span>Tax</span>
        <span>$ ${tax.toFixed(2)}</span>
      </div>
      <div class="d-flex justify-content-between">
        <span>Total</span>
        <span>$ ${formattedTotal}</span>
      </div>
      <button class="btn btn-warning w-100 mt-3">Proceed to Checkout</button>
    </div>
  `;
      let cartItemsHTML = "";
      data.forEach(item => {
        cartItemsHTML += `
          <div class="row">
            <div class="col-md-3">
              <img src="${item.image}" class="img-fluid" alt="Product">
            </div>
            <div class="col-md-5">
              <h4>${item.name}</h4>
              <p>$${item.price.toFixed(2)}</p>
            </div>
            <div class="col-md-2">
              <button class="btn btn-danger" onclick="removeFromCart('${item._id}')">Remove</button>
            </div>
            <div style="height:3vh"></div>
          </div>
        `;
        // Update total price
        totalPrice += item.price;
      })
      document.getElementById("cart-item").innerHTML = cartItemsHTML;
    
    
    })
      
    .catch(error => {
        console.error('Error making request:', error);
        // Handle error if needed
    });
}



    getDataPlease()




    function removeFromCart(productId) {
      // Construct the URL
      const url = `http://localhost:3000/api/products/remove-from-cart/${userId}/${productId}`;
  
      // Make a DELETE request to the server
      fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              // Add any other headers if needed
          },
      })
      .then(response => {
        getDataPlease()
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          // Optionally, you can handle the success response here
      })
      .catch(error => {
          console.error('Error removing product from cart:', error);
          // Handle error cases here, for example, show an error message to the user
      });
  }
  
