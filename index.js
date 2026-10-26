// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!

/* Select the input where the user enters a state abbreviation */
const stateInput = document.getElementById("state-input");

// Select the button used to request weather alerts
const getAlertsButton = document.getElementById("get-alerts");

// Select the element where weather alerts will appear
const weatherAlerts = document.getElementById("alerts-display");

// Select the element used to display error messages
const errorMessage = document.getElementById("error-message");


/* Create a function to display the weather alerts */
function displayAlerts(data) {

    // Remove the previous alerts from the page
    weatherAlerts.innerHTML = "";

    // Get the number of alerts returned by the API
    const numberOfAlerts = data.features.length;

    // Create a heading to show the summary
    const summary = document.createElement("h2");

    // Display the API title and the number of alerts
    summary.textContent = `${data.title}: ${numberOfAlerts}`;

    // Add the summary heading to the page
    weatherAlerts.append(summary);

    // Loop through every alert returned by the API
    data.features.forEach(function(alert) {

        // Create a list item for this alert
        const alertItem = document.createElement("li");

        // Get the headline from the alert's properties
        alertItem.textContent = alert.properties.headline
            || "No headline available";

        // Add this alert to the results list
        weatherAlerts.append(alertItem);

    });
}


/* Create an async function to fetch alerts for a state */
async function fetchWeatherAlerts(state) {

    // Remove any alerts from the previous request
    weatherAlerts.innerHTML = "";

    // Clear any old error message
    errorMessage.textContent = "";

    // Hide the error message
    errorMessage.classList.add("hidden");

    // Remove extra spaces and convert the state code to uppercase
    state = state.trim().toUpperCase();

    // Check that the user entered two letters
    if (!/^[A-Z]{2}$/.test(state)) {

        // Show an error if the input is empty or incorrectly formatted
        errorMessage.textContent =
            "Please enter a valid two-letter state abbreviation.";

        // Make the error visible
      errorMessage.classList.remove("hidden");

        // Stop the function before making an API request
        return;
    }

    // Store the valid state abbreviations
    const validStates = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE",
        "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
        "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
        "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY",
        "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
        "WI", "WY"
    ];

    // Check whether the state code is a U.S. state abbreviation
    if (!validStates.includes(state)) {

        // Display an error for an unrecognised state code
        errorMessage.textContent =
            "Please enter a valid U.S. state abbreviation.";

        // Make the error visible
        errorMessage.classList.remove("hidden");

        // Stop the function before making an API request
        return;
    }

    // Use try and catch to handle request errors
    try {

        // Fetch the active weather alerts for the chosen state
        const response = await fetch(
            `https://api.weather.gov/alerts/active?area=${state}`
        );

        // Check whether the API returned a successful response
        if (!response.ok) {
            throw new Error("Unable to fetch weather alerts. Please try again.");
        }

        // Convert the response into JavaScript data
        const data = await response.json();

        // Display the weather alerts on the webpage
        displayAlerts(data);

        // Clear the old error text after a successful request
        errorMessage.textContent = "";

        // Keep the error message hidden
       errorMessage.classList.add("hidden");

    } catch (error) {

        // Display the error message on the webpage
        errorMessage.textContent = error.message;

        // Make the error visible
        errorMessage.classList.remove("hidden");

        // Also log the error for debugging
        console.log(error.message);
    }
}


/* Listen for clicks on the Get Weather Alerts button */
getAlertsButton.addEventListener("click", function() {

    // Get the state abbreviation entered by the user
    const state = stateInput.value;

    // Clear the input field when the button is clicked
    stateInput.value = "";

    // Fetch and display the weather alerts
    fetchWeatherAlerts(state);
});
