// Add your own API key between the ""
var APIKey = "46712b3330b632c9045a61a4c26533fd";
// the API is working when I add a string
// var city = "london";
// Here we are building the URL we need to query the database

function weatherDisplay(city) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    if (storedHistory.indexOf(city) === -1) {
  
      storedHistory.push(city);
      localStorage.setItem("storedHistory", JSON.stringify(storedHistory));
      displayHistory(city);

    }

    $("#today").empty();

    // var currentDate = moment().format("MMMM Do YYYY");
    var title = $("<h3>").addClass("card-title").text(response.name + " (" + moment().format("Do MMMM YYYY") + ")" );
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
    console.log(response);

    title.append(img);
    cardBody.append(title, temp, humid, wind);
    card.append(cardBody);
    $("#today").append(card);
    console.log(response);
  });
}

//Function Forecast 5 days
function forecastDisplay(city) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    APIKey;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
    var h2El = $("<h2>").text("5-Day Forecast:");
    var forecastRow = $("<div>").addClass("row col-md-12 title-forecast");
    $("#forecast").empty();

    $("#forecast").append(h2El);

    $("#forecast").append(forecastRow);

    for (var i = 0; i < response.list.length; i++) {
      if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
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
        var tempFive = $("<p>")
          .addClass("card-text")
          .text("Temperature: " + response.list[i].main.temp + " °F");

        //merge together and put on page
        colFive.append(
          cardFive.append(
            cardBodyFive.append(titleFive, imgFive, tempFive, humidFive)
          )
        );
        //append card to column, body to card, and other elements to body
        $("#forecast .row").append(colFive);
      }
    }
  });
}

//Search button function
$("#search-button").on("click", function (event) {
  event.preventDefault();
  $("#today").empty();
  $("#forecast").empty();

  // Getting the value in
  var city = $("#search-input").val().trim();

  // Empty input field
  $("#search-input").val("");

  // forecast(city);
  weatherDisplay(city);
  forecastDisplay(city);
});


var storedHistory = JSON.parse(localStorage.getItem("storedHistory")) || [];

if (storedHistory.length > 0) {
  weatherDisplay(storedHistory[storedHistory.length - 1]);
}

for (var i = 0; i < storedHistory.length; i++) {
    
    // Appends the row to history div
    displayHistory(storedHistory[i]);
}

// Function for displaying history
function displayHistory(btn) {
   
  
    // Looping through the array of stored history
  
    var cityButton = $("<button>");
  
    cityButton.addClass("btn btn-block button-style");
    // cityBtn.attr("data-name", storedHistory[i]);
    cityButton.text(btn);
    $("#history").append(cityButton);
  }
  
    // Listener for button on click function
    $("#history").on("click", ".btn", function () {
      weatherDisplay($(this).text());
      forecastDisplay($(this).text());
    });
