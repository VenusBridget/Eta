document.addEventListener("DOMContentLoaded", () => {
    const popularDestinations = document.querySelector(".popular-destinations");
    const authContainer = document.querySelector(".auth-container");
    const url = "http://localhost:3000/destinations";
    let allDestinations = [];
    let favorites = JSON.parse(localStorage.getItem("favorites")) || []; // Retrieve favorites from localStorage

    // Fetch destinations from server and store globally
    fetch("https://eta-json.onrender.com")
    .then(response => response.json())
    .then(data => {
      console.log(data); // Check if data is loading correctly
      // Update UI with fetched data
    })
    .catch(error => console.error("Error fetching data:", error));
  

    // Function to display destinations
    function displayDestinations(destinations) {
        popularDestinations.innerHTML = "";
        destinations.forEach(destination => {
            const card = createDestinationCard(destination);
            popularDestinations.appendChild(card);
        });
    }

    // Create a card for each destination
    function createDestinationCard(destination) {
        const { id, name, location, capacity, tickets_sold, price, days, date, prebook, info, image } = destination;

        const card = document.createElement("div");
        card.classList.add("destination-card");
        card.setAttribute("data-destination-id", id);

        const container = document.createElement("div");
        container.classList.add("destination-card_container");

        const favBtn = document.createElement("button");
        favBtn.classList.add("favorite-btn");
        favBtn.innerHTML = favorites.includes(id) ? "❤️ Favorited" : "🤍 Favorite";

        const imgContainer = document.createElement("div");
        imgContainer.classList.add("destination-card_img");
        const img = document.createElement("img");
        img.src = image;
        imgContainer.appendChild(img);

        container.appendChild(favBtn);
        container.appendChild(imgContainer);

        const description = document.createElement("div");
        description.classList.add("destination-card_description");
        description.innerHTML = `
            <div class="destination-card_name"><h2><span>${name}</span></h2></div>
            <div class="destination-card_location"><h3>${location}</h3></div>
            <div class="destination-card_info">${info}</div>
            <div class="destination-card_days">${days}</div>
            <div class="destination-card_price">${price}</div>
            <div class="destination-card_day">${date}</div>
            <div class="destination-card_offer">${prebook}</div>
            <div><strong>Tickets Left: <span class="ticket-count">${capacity - tickets_sold}</span></strong></div>
        `;

        const extraContent = document.createElement("div");
        extraContent.classList.add("extra", "content");

        // "Book Now" button
        const bookBtn = document.createElement("button");
        bookBtn.classList.add("buy-ticket");
        bookBtn.textContent = "Book Now";

        extraContent.appendChild(bookBtn);
        card.appendChild(container);
        card.appendChild(description);
        card.appendChild(extraContent);

        // "Book Now" button logic
        bookBtn.addEventListener("click", () => {
            const ticketCount = card.querySelector(".ticket-count");
            let tickets = parseInt(ticketCount.textContent);

            if (tickets > 0) {
                tickets -= 1;
                ticketCount.textContent = tickets;

                if (tickets === 0) {
                    bookBtn.textContent = "Sold Out";
                    bookBtn.disabled = true;
                }
            }
        });

        // "Favorite" button logic
        favBtn.addEventListener("click", () => {
            if (favorites.includes(id)) {
                favorites = favorites.filter(favId => favId !== id);
                favBtn.textContent = "🤍 Favorite";
            } else {
                favorites.push(id);
                favBtn.textContent = "❤️ Favorited";
            }
            localStorage.setItem("favorites", JSON.stringify(favorites));
        });

        return card;
    }

    // Search function
    const searchInput = document.getElementById("srch");
    const searchButton = document.getElementById("search-btn");

    searchButton.addEventListener("click", () => {
        const searchDest = searchInput.value.trim().toLowerCase();
        const filteredDestinations = allDestinations.filter(destination =>
            destination.name.toLowerCase().includes(searchDest)
        );

        if (filteredDestinations.length > 0) {
            displayDestinations(filteredDestinations);
        } else {
            popularDestinations.innerHTML = "<p>No results found</p>";
        }
    });

    // Authentication Logic
    if (authContainer) {
        authContainer.innerHTML = `
            <form id="sign-up-form">
                <h1>SIGN UP</h>
                <input type="text" id="signUpUserName" placeholder="Username" required>
                <input type="email" id="signUpEmail" placeholder="Email" required>
                <input type="password" id="signUpPassword" placeholder="Password" required>
                <button type="submit" class="btn">Sign Up</button>
                <p>Already have an account? <button type="button" class="btn" id="goToLogin">Login</button></p>
            </form>
        `;

        // Attach event to "Go to Login" button
        document.getElementById("goToLogin").addEventListener("click", () => {
            showLoginForm();
        });

        const signUpForm = document.getElementById("sign-up-form");

        signUpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let userName = document.getElementById("signUpUserName").value;
            let password = document.getElementById("signUpPassword").value;
            let email = document.getElementById("signUpEmail").value;

            if (userName && password && email) {
                const user = { userName, password, email };
                localStorage.setItem(userName, JSON.stringify(user));

                sendEmailConfirmation(email, userName);

                alert("Sign-up successful! You can now log in.");

                // Replace sign-up form with login form
                showLoginForm();
            } else {
                alert("Please fill in all fields");
            }
        });
    }

    function showLoginForm() {
        authContainer.innerHTML = `
            <form id="login-form">
                <h1>LOGIN</h1>
                <input type="text" id="loginUserName" name="userName" placeholder="Username" required>
                <input type="password" id="loginPassword" name="password" placeholder="Password" required>
                <button type="submit" class="btn" >Login</button>
            </form>
        `;

        attachLoginEvent(); // Ensure login functionality works
    }

    function attachLoginEvent() {
        const loginForm = document.querySelector("#login-form");
        if (loginForm) {
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();
                let userName = document.querySelector("#loginUserName").value;
                let password = document.querySelector("#loginPassword").value;

                let storedUser = localStorage.getItem(userName);
                if (storedUser) {
                    storedUser = JSON.parse(storedUser);
                    if (storedUser.password === password) {
                        alert("Login successful!");

                        authContainer.innerHTML = `
                        <div class="welcome-content">
                        <h1>Welcome to Eta, <span>${storedUser.userName}!</span></h1>
                        </div>
                        `;

                    } else {
                        alert("Incorrect password");
                    }
                } else {
                    alert("User not found");
                }
            });
        }
    }


    function sendEmailConfirmation(email, userName) {
        emailjs.init("Npt_MNRvTUxqk1wtu");
        emailjs.send("service_jynf81p", "template_zpabi18", {
            to_email: email,
            user_name: userName,
        })
            .then(() => alert("A confirmation email has been sent to " + email))
            .catch(error => console.error("Email send error:", error));
    }
});
