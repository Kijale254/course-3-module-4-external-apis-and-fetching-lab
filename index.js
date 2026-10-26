// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
// Find the input field from the HTML
const stateInput = document.getElementById("state-input");

// Find the button using its actual HTML ID
const getAlertsButton = document.getElementById("fetch-alerts");

// Find the alerts display area
const weatherAlerts = document.getElementById("alerts-display");

// Find the error message area
const errorMessage = document.getElementById("error-message");

// Hide the error message when the page loads
errorMessage.classList.add("hidden");

// Create a function to display weather alerts
function displayAlerts(data) {
  // Clear the old alerts
  weatherAlerts.innerHTML = "";

  // Count the alerts
  const numberOfAlerts = data.features.length;

  // Create a heading for the summary
  const summary = document.createElement("h2");

  // Display the API title and alert count
  summary.textContent = `${data.title}: ${numberOfAlerts}`;

  // Add the heading to the page
  weatherAlerts.appendChild(summary);

  // Create a list for the alert headlines
  const alertList = document.createElement("ul");

  // Loop through the alerts
  data.features.forEach(function(alert) {
    // Create a list item
    const alertItem = document.createElement("li");

    // Add the alert headline
    alertItem.textContent =
      alert.properties.headline || "No headline available";

    // Add the item to the list
    alertList.appendChild(alertItem);
  });

  // Add the list to the alerts display area
  weatherAlerts.appendChild(alertList);
}

// Create an asynchronous function to fetch alerts
async function fetchWeatherAlerts(state) {
  // Clear previous alerts
  weatherAlerts.innerHTML = "";

  // Clear previous errors
  errorMessage.textContent = "";

  // Hide the error message using the existing CSS class
  errorMessage.classList.add("hidden");

  // Clean the input and convert it to uppercase
  state = state.trim().toUpperCase();

  // Check that the user entered two letters
  if (!/^[A-Z]{2}$/.test(state)) {
    // Display an error for invalid input
    errorMessage.textContent =
      "Please enter a valid two-letter state abbreviation.";

    // Show the error
    errorMessage.classList.remove("hidden");

    // Stop the function
    return;
  }

  // Store valid US state abbreviations
  const validStates = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE",
    "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
    "KY", "LA", "ME", "MD", "MA", "MI", "MS", "MO",
    "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC",
    "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD",
    "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI",
    "WY"
  ];

  // Check whether the state code is a real US state abbreviation
  if (!validStates.includes(state)) {
    // Display an error for an unknown state
    errorMessage.textContent =
      "Please enter a valid U.S. state abbreviation.";

    // Show the error
    errorMessage.classList.remove("hidden");

    // Stop the function
    return;
  }

  // Try to request the weather alerts
  try {
    // Fetch the alerts for the selected state
    const response = await fetch(weatherApi + state);

    // Check whether the request was successful
    if (!response.ok) {
      throw new Error("Unable to fetch weather alerts. Please try again.");
    }

    // Convert the response to JSON
    const data = await response.json();

    // Display the alerts
    displayAlerts(data);

    // Clear any old error message
    errorMessage.textContent = "";

    // Hide the error after success
    errorMessage.classList.add("hidden");
  } catch (error) {
    // Display a helpful error message
    errorMessage.textContent =
      "Unable to fetch weather alerts. Please try again.";

    // Show the error message
    errorMessage.classList.remove("hidden");

    // Log the actual error for debugging
    console.error(error);
  }
}

// Listen for clicks on the button
getAlertsButton.addEventListener("click", function() {
  // Get the state abbreviation
  const state = stateInput.value;

  // Clear the input field
  stateInput.value = "";

  // Fetch the weather alerts
  fetchWeatherAlerts(state);
});

