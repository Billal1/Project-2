
    var images = ['img/banner.jpg', 'img/product-1.jpg', 'img/product-2.jpg'];
    var currentIndex = 0;
    var bannerImage = document.querySelector('.banner-image');

    function changeImage() {
        // Change the background image
        bannerImage.style.backgroundImage = 'url(' + images[currentIndex] + ')';

        // Increment the index to show the next image
        currentIndex = (currentIndex + 1) % images.length;
    }

    // Call the changeImage function initially
    changeImage();

    // Set interval to change the image every 3 seconds (3000 milliseconds)
    setInterval(changeImage, 3000);




if(localStorage.getItem("user")){

    document.getElementById("authlinks").innerHTML = `
    
    <li class="nav-item"><button onclick="logout()" class="nav-link auth" href="signup.html">Logout</button></li>
    `
}else{
    document.getElementById("authlinks").innerHTML = `
    <li class="nav-item"><a class="nav-link auth" href="signup.html">Register</a></li>

    <li class="nav-item"><a class="nav-link auth" href="login.html">Login</a></li>

    `
}

function logout(){
    localStorage.removeItem("user")
    window.location = "index.html"
}

async function fetchProductData() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const productsContainer = document.querySelector('.row.row-cols-1.row-cols-md-2.row-cols-lg-4.g-4');
        data.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('col');
            productCard.innerHTML = `
                <a href="#" class="product-link" data-product-id="${product._id}">
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">$${product.price.toFixed(2)}</p>
                            </div>
                            </a>
                            <div>
                            <button onclick=addToCartButton('${product._id}') class="btn btn-warning" value="">Add to Cart</button>
                        </div>
                    </div>
            
            `;
            productsContainer.appendChild(productCard);
        });

        // Add event listener to dynamically created product links
        document.querySelectorAll('.product-link').forEach(function (link) {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                var productId = this.getAttribute('data-product-id');
                var url = 'about-product.html?productId=' + productId;
                window.location.href = url;
            });
        });

        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

fetchProductData();


function addToCartButton(id) {
    const userData = JSON.parse(localStorage.getItem("user"))

    if (!userData) {
        
            // Handle success response
            var modal = document.getElementById("myModal");

            modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Login</h2>
                <p>You need to login first to add items to cart</p>
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
        return;
    }

    const userId = userData._id

    // Prepare data to send
    var data = {
        userId: userId,
        productId: id
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
            localStorage.setItem("user", JSON.stringify(data.user))

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


async function fetchProductById(productId) {
    const url = `http://localhost:3000/api/products/${productId}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
//   fetchProductById()

async function addToCart(productId) {
    const url = `http://localhost:3000/api/products/addToCart/${productId}`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
//   addToCart()




function submitForm(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const contactName = document.getElementById('contactName').value;
    const contactEmail = document.getElementById('contactEmail').value;
    const contactMessage = document.getElementById('contactMessage').value;

    const formData = {
        name: contactName,
        email: contactEmail,
        message: contactMessage
    };

    fetch('http://localhost:3000/api/email/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
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

            // Display the modal
            modal.style.display = "block";
            // Optionally, you can display a success message or redirect the user
        })
        .catch(error => {
            console.error('There was a problem submitting the form:', error);
            // Optionally, you can display an error message to the user
        });
}

document.querySelector('form').addEventListener('submit', submitForm);







async function newestOffer() {
    try {
        const response = await fetch('http://localhost:3000/api/products/new');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();


        const newProductContainer = document.querySelector('.our-newest');
        const newProductRow = document.createElement('div');
        const userId = data[0]._id


        newProductRow.classList.add('row', 'g-4');
        newProductRow.innerHTML = `
                <div class="col-md-6">
                    <img src="${data[0].image}" class="img-fluid" alt="${data[0].name}">
                </div>
                <div class="col-md-6 d-flex align-items-center">
                    <div>
                        <p>Our Newest Product Offer</p>
                        <h1>${data[0].name}</h1>
                        <small>${data[0].description}</small>
                        <br>
                    <button onclick="addToCartButton('${userId}')" class="btn btn-warning" value="">Add to Cart</button>

                    </div>
                </div>
            `;
        newProductContainer.appendChild(newProductRow);
    } catch (error) {
        console.error('There was a problem fetching the newest offer:', error);
    }
}

// Call newestOffer function
newestOffer();
