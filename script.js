// Add API Key
var APIKey = "46712b3330b632c9045a61a4c26533fd";

// function to display current weather
function weatherDisplay(city) {
  // Create queryURL by combining API endpoint, city and APIKey
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;
  // make ajax request to retrieve weather data
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // Log the response to check if data is received
    console.log(response);
    // If city is not in storedHistory, add it
    if (storedHistory.indexOf(city) === -1) {
      storedHistory.push(city);
      localStorage.setItem("storedHistory", JSON.stringify(storedHistory));
      displayHistory(city);
    }
    // Clear any existing data in #today
    $("#today").empty();

    // Create variables for displaying weather data
    var title = $("<h3>")
      .addClass("card-title")
      .text(response.name + " (" + moment().format("Do MMMM YYYY") + ")");
    var img = $("<img>").attr(
      "src",
      "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
    );
    var card = $("<div>").addClass("card weather-box");
    var cardBody = $("<div>").addClass("card-body");
    var wind = $("<p>")
      .addClass("card-text")
      .text("Wind Speed: " + response.wind.speed + " MPH");
    var humid = $("<p>")
      .addClass("card-text")
      .text("Humidity: " + response.main.humidity + " %");
    var temp = $("<p>")
      .addClass("card-text")
      .text("Temperature: " + response.main.temp + " K");

    // Merge variables and append to #today
    title.append(img);
    cardBody.append(title, temp, humid, wind);
    card.append(cardBody);
    $("#today").append(card);    
  });
}

// function to display 5-day forecast
function forecastDisplay(city) {
  // Create queryURL by combining API endpoint, city and APIKey
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    APIKey;

  // make ajax request to retrieve weather data
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {

    // Create header for 5-day forecast
    var h2El = $("<h2>").text("5-Day Forecast:");
    var forecastRow = $("<div>").addClass("row col-md-12 title-forecast");
    
    // Clear any existing data in #forecast
    $("#forecast").empty();

    // Append header to #forecast
    $("#forecast").append(h2El);
    $("#forecast").append(forecastRow);

    // Loop through the response data and display 5-day forecast
    for (var i = 0; i < response.list.length; i++) {
      // Check if the time is 3:00 PM
      if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
        // Create elements for each day of the 5-day forecast
        var titleFive = $("<h4>")
          .addClass("card-title")
          .text(new Date(response.list[i].dt_txt).toLocaleDateString());
        var imgFive = $("<img>").attr(
          "src",
          "https://openweathermap.org/img/w/" +
            response.list[i].weather[0].icon +
            ".png"
        );
        var colFive = $("<div>").addClass("col-md-2.5 card-box");
        var cardFive = $("<div>").addClass("card text-white forecast-box");
        var cardBodyFive = $("<div>").addClass("card-body p-2");
        var humidFive = $("<p>")
          .addClass("card-text")
          .text("Humidity: " + response.list[i].main.humidity + "%");
        var windFive = $("<p>")
          .addClass("card-text")
          .text("Wind: " + response.list[i].wind.speed + " °F");
        var tempFive = $("<p>")
          .addClass("card-text")
          .text("Temperature: " + response.list[i].main.temp + " °F");

        // Merge variables and append to #forecast
        colFive.append(
          cardFive.append(
            cardBodyFive.append(
              titleFive,
              imgFive,
              tempFive,
              windFive,
              humidFive
            )
          )
        );
       
        $("#forecast .row").append(colFive);
      }
    }
  });
}

//Search button function
$("#search-button").on("click", function (event) {
  // Prevent default form submission behavior
  event.preventDefault();
  // Clear the existing data in #today and #forecast
  $("#today").empty();
  $("#forecast").empty();

  // Get the value of the city entered in the search input
  var city = $("#search-input").val().trim();

  // Empty the search input field
  $("#search-input").val("");

  // Call the weatherDisplay and forecastDisplay functions with the city as argument
  weatherDisplay(city);
  forecastDisplay(city);
});

// Get stored history from local storage, or set it to an empty array
var storedHistory = JSON.parse(localStorage.getItem("storedHistory")) || [];

// If there is stored history, call the weatherDisplay function with the last item in the array
if (storedHistory.length > 0) {
  weatherDisplay(storedHistory[storedHistory.length - 1]);
}
// Loop through the stored history and call the displayHistory function with each item in the array
for (var i = 0; i < storedHistory.length; i++) {
  // Appends the row to history div
  displayHistory(storedHistory[i]);
}

// Function to display the stored history
function displayHistory(btn) {

  // Create a button element with class and text
  var cityButton = $("<button>").addClass("btn btn-block button-style").text(btn);  

  // Append the button to the history div
  $("#history").append(cityButton);
}


// Add click listener to the history div for dynamically created buttons
$("#history").on("click", ".btn", function () {
  // Call the weatherDisplay and forecastDisplay functions with the text of the clicked button as argument
  weatherDisplay($(this).text());
  forecastDisplay($(this).text());
});
