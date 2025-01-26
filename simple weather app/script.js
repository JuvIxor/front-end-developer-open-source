// Select DOM Elements
const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchBtn');
const city = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-result-icon'); // Updated variable name
const temp = document.getElementById('weather-value');
const desc = document.getElementById('weather-description');
const humidity = document.getElementById('Humidity');
const tempFaranheit = document.getElementById('tempFaranheit');


// API Configuration
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'c9cd1b85decd88478a839a2b82575b88';

//object create for search history
let history = JSON.parse(localStorage.getItem("history")) || [];
const historyList = document.getElementById('search-history');

function renderHistory(){
    history.forEach(location => {
        const li = document.createElement('li');
        li.textContent = location;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    history = []; // Reset the history array
    localStorage.removeItem("history"); // Clear from localStorage
    historyList.innerHTML = ''; // Clear the list element   
    console.log("History cleared");
    console.log(history);
  }


// Event Listener
searchButton.addEventListener('click', () => {
    const location = locationInput.value.trim(); // Trim whitespace
    if (location) {
        fetchWeather(location);

        historyList.innerHTML = ''; // Clear the list element
        history.unshift(location); // Add to the beginning of the array
        localStorage.setItem("history", JSON.stringify(history));
        renderHistory();
        locationInput.value = "";
        
    } else {
        alert('Please enter a valid location.');
    }
});

// Fetch Weather Function
function fetchWeather(location) {
    const url = `${API_URL}?q=${location}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Location not found');
            }
            return response.json();
        })
        .then(data => {
            // Update UI with weather data
            const countryCode = data.sys.country;
            city.innerText = `${data.name}, ${countryCode}`;
            temp.innerText = `${Math.round(data.main.temp)}°C`;
            desc.innerText = data.weather[0].description;

            // Update Humidity and Fahrenheit
            humidity.innerText = `${data.main.humidity}%`;
            const tempF = (data.main.temp * 9) / 5 + 32; // Convert Celsius to Fahrenheit
            tempFaranheit.innerText = `${Math.round(tempF)}°F`;

            // Update Weather Icon
            const iconCode = data.weather[0].icon; // Get icon code from API response
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`; // Construct icon URL
            const imgTag = weatherIcon.querySelector('img'); // Select the <img> inside #weather-result-icon
            imgTag.src = iconUrl; // Set the src of the image
            imgTag.alt = data.weather[0].description; // Set the alt attribute for accessibility
        })
        .catch(error => {
            // Display error message
            alert(`Error: ${error.message}`);
        });
}

fetchWeather('Colombo');
renderHistory();
