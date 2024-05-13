function submitFormLogin() {
    // Collect input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Prepare data to send
    const data = {
        email: email,
        password: password
    };


    // Send data to backend
    fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        // Redirect user if login is successful
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));

            window.location.href = '/index.html';
        }
    })
    .catch(error => {
        var modal = document.getElementById("myModal");
            modal.innerHTML = `
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Invalid Credentials</h2>
        <p>invalid Username or Password</p>
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
    });
}





function submitFormSingUp() {
    // Collect form data
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;

    // Check if all fields are filled
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        alert("Password and Confirm Password do not match.");
        return;
    }

    // Check if terms are accepted
    if (!terms) {
        alert("Please accept the Terms of Use & Privacy Policy.");
        return;
    }

    // Prepare data to send
    const data = {
        username: firstName + " " + lastName,
        email: email,
        password: password
    };

    // Send data to backend
    fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            // Check if data contains the user object
            if (data.newUser) {
                // Save user data to local storage
                localStorage.setItem('user', JSON.stringify(data.newUser));
                window.location.href = '/index.html';
            } else {
                var modal = document.getElementById("myModal");
                modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>User Name Take</h2>
            <p>A user with username or email already exists</p>
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
            }
        })
        .catch(error => {
            var modal = document.getElementById("myModal");
            modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Error</h2>
            <p>An Error Ocuured Please try again later.</p>
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
        });
}