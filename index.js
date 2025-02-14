document.addEventListener("DOMContentLoaded", () => {
    // Declare the div for popular destinations
    const popularDestinations = document.querySelector(".popular-destinations");

    // Declare the endpoint URL
    const url = "http://localhost:3000/destinations";

    // Store fetched destinations globally
    let allDestinations = [];

    // Fetch destinations from server and store them globally
    fetch(url)
        .then(response => response.json())
        .then(data => {
            allDestinations = data; // Store the data globally
            displayDestinations(data); // Render all destinations
        })
        .catch(error => console.error("Error fetching data:", error));

    // Function to display destinations
    function displayDestinations(destinations) {
        popularDestinations.innerHTML = ""; // Clear previous content

        // Loop through destinations and create cards
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

        const favBtn = document.createElement("div");
        favBtn.classList.add("destination-card_btn", "fav");
        favBtn.innerHTML = `<button class="like"><i class="fa fa-heart" aria-hidden="true"></i></button>`;

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
            <div class="destination-card_name"><span>${name}</span></div>
            <div class="destination-card_location">${location}</div>
            <div class="destination-card_info">${info}</div>
            <div class="destination-card_days">${days}</div>
            <div class="destination-card_price">${price}</div>
            <div class="destination-card_day">${date}</div>
            <div class="destination-card_offer">${prebook}</div>
            <div><span id="ticket-num">${capacity - tickets_sold}</span> tickets</div>
        `;

        const extraContent = document.createElement("div");
        extraContent.classList.add("extra", "content");
        extraContent.innerHTML = `<button class="buy-ticket">BOOK NOW</button>`;

        card.appendChild(container);
        card.appendChild(description);
        card.appendChild(extraContent);

        return card;
    }

    // Search Function
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

    // Function to show an alert for booking
    function getAlert() {
        alert("PAY TO MPESA PAYBILL 740636117");
    }

    // Change the color of like button
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("like")) {
            event.target.classList.toggle("liked");
        } else if (event.target.classList.contains("buy-ticket")) {
            getAlert();
        }
    });

    // Change color of like button using event delegation
    // document.addEventListener("DOMContentLoaded", () => {
    //     document.addEventListener("click", function (event) {
    //         if (event.target.classList.contains("fa-heart")) {
    //             event.target.classList.toggle("liked");
    //         }
    //     });
    // });

    // document.addEventListener("DOMContentLoaded", function () {
    //     document.querySelectorAll(".like-btn").forEach(button => {
    //         button.addEventListener("click", function () {
    //             this.classList.toggle("liked");
    //             this.querySelector("i").classList.toggle("fa-solid"); // Makes heart solid when liked
    //         });
    //     });
    // });


    // Sign-up function
    const signUp = (e) => {
        e.preventDefault(); // Prevent form submission refresh

        let userName = document.getElementById("userName").value;
        let password = document.getElementById("password").value;

        if (userName && password) {
            const user = { userName, password };
            localStorage.setItem(userName, JSON.stringify(user));
            console.log("User added");
        } else {
            console.log("Please fill in all fields");
        }
    };

    // Attach event listener to login form only if it exists
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", signUp);
    }
});
