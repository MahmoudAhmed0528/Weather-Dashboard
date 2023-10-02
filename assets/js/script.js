const apiKey = "55f6e1f2f9f2cb534a31a2c7d741efae";
const searchFormSec = document.getElementById("search-form-sec");
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const cityNameElement = document.getElementById("city-name");
const searchHistorySection = document.getElementById("search-history");
const searchHistoryList = document.getElementById("search-history-list");

const currentWeatherSection = document.getElementById("current-weather");
const dateElement = document.getElementById("date");
const weatherElement = document.getElementById("weather");
const temperatureElement = document.getElementById("temperature");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");

const forecastSection = document.getElementById("forecast");

let searchHistory = [];

//fetch and display current weather
function getCurrentWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=Imperial`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      // console.log(data.dt);
      cityNameElement.textContent = data.name;
      dateElement.textContent = new Date(data.dt * 1000).toLocaleDateString();
      weatherElement.textContent = data.weather[0].description;
      temperatureElement.textContent = `${data.main.temp} °F`;
      humidityElement.textContent = `${data.main.humidity} %`;
      windSpeedElement.textContent = `${data.wind.speed} mph`;
    })
    .catch((error) => {
      console.error("Error fetching current weather data:", error);
    });
  manageSearchHistory(city);
}

// fetch and display 5-day forecast
function get5DayForecast(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=Imperial`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const forecastData = data.list;
      // console.log(data.list);
      // console.log(forecastData);
      forecastSection.innerHTML = "";

      // Create an h2 element for the forecast heading
      const forecastHeading = document.createElement("h2");
      forecastHeading.classList.add("my-4");
      forecastHeading.textContent = "5-Day Weather Forecast";
      forecastSection.appendChild(forecastHeading);

      // Create a div element for the forecast dayes
      const forecastDayElement = document.createElement("div");
      forecastDayElement.classList.add("row", "forecast-day");
      forecastSection.appendChild(forecastDayElement);

      // Loop through each forecast item (every 8th entry, which is once per day)
      for (let i = 0; i < forecastData.length; i += 8) {
        const forecastDay = forecastData[i];
        const forecastDayCard = document.createElement("div");
        forecastDayCard.classList.add("col-md", "m-1");

        const date = new Date(forecastDay.dt * 1000).toLocaleDateString();
        const weatherDescription = forecastDay.weather[0].description;
        const temperature = forecastDay.main.temp;
        const humidity = forecastDay.main.humidity;
        const windSpeed = forecastDay.wind.speed;
        forecastDayCard.innerHTML = `
              <div class="card text-white bg-success h-100">
              <div class="card-body">
                <h5 class="card-title">Date: ${date}</h5>
                <p class="card-text">Weather: ${weatherDescription}</p>
                <p class="card-text">Temperature: ${temperature} °F</p>
                <p class="card-text">Humidity: ${humidity} %</p>
                <p class="card-text">Wind Speed: ${windSpeed} mph</p>
              </div>
            </div>
        `;
        forecastDayElement.appendChild(forecastDayCard);
      }
    })
    .catch((error) => {
      console.error("Error fetching 5-day forecast data:", error);
    });
  manageSearchHistory(city);
}

// Function to manage and display the search history
function manageSearchHistory(city) {
  if (city && !searchHistory.includes(city)) {
    searchHistory.unshift(city);
  }

  // Update the HTML to display the updated search history
  searchHistoryList.innerHTML = "";
  for (const city of searchHistory) {
    const cityButton = document.createElement("button");
    cityButton.type = "button";
    cityButton.classList.add(
      "btn",
      "btn-outline-success",
      "btn-lg",
      "m-3",
      "col-sm"
    );
    cityButton.textContent = city;

    // Add a click event listener to each city button
    cityButton.addEventListener("click", (e) => {
      e.preventDefault();
      const clickedCity = e.target.textContent;
      getCurrentWeather(clickedCity);
      get5DayForecast(clickedCity);
    });

    searchHistoryList.appendChild(cityButton);
  }

  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// Initialize the search history from localStorage if it exists
if (localStorage.getItem("searchHistory")) {
  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  manageSearchHistory();
}

// Event listener for form submission
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (city) {
    getCurrentWeather(city);
    get5DayForecast(city);
    manageSearchHistory(city);
    cityInput.value = "";
  }
});
