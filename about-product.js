
    // Function to get URL query parameters
    function getUrlParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Usage example
    const productId = getUrlParam('productId');

    // Function to fetch product details by ID
    async function fetchProductById(productId) {

        try {
            const response = await fetch(`http://localhost:3000/api/products/${productId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const product = await response.json();
            updateProductDetails(product)
            // Now you have the product details, you can use them as needed
        } catch (error) {
            console.error('There was a problem fetching the product:', error);
        }
    }

    // Function to get URL query parameters
    function getUrlParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function updateProductDetails(product) {
    const productDescription = document.querySelector('.product-description');
    const productImage  = document.querySelector('.product-image');
    const productName = product.name;
    const productPrice = product.price.toFixed(2);
    const productDescriptionText = product.description;

    productImage.setAttribute("src", product.image)

    productDescription.innerHTML = `
        <span>${productName}</span>
        <h1>${productName}</h1>
        <p>${productDescriptionText}</p>
    `;

    const productPriceElement = document.querySelector('.product-price');
    productPriceElement.innerHTML = `
        <span>$${productPrice}</span>
        <button onclick=addToCartButton(${product._id.toString()}) class="btn btn-warning" value="">Add to Cart</button>

    `;






}


fetchProductById(productId)


function addToCartButton(productId){
    const userData =JSON.parse( localStorage.getItem("user"))

    // Check if user ID is present
    if (!userData) {
        alert("User ID not found in local storage.");
        return;
    }
alert(productId)
   const userId = userData._id


    // Prepare data to send
    var data = {
        userId: userId,
        productId: productId
    };

    // Send data to the API endpoint
    fetch('http://localhost:3000/api/products/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle success response
        var modal = document.getElementById("myModal");
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Product Added</h2>
                <p>Product has been added to your cart successfully.</p>
            </div>`;
        modal.style.display = "block";



        var modal = document.getElementById("myModal");
        var span = document.getElementsByClassName("close")[0];

        span.onclick = function () {
            modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    })
    
    .catch(error => {
        console.error('Error:', error);
        // Handle error
        alert('An error occurred while adding the product to cart.');
    });
}

