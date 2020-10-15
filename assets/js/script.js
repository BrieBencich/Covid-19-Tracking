// initial
let input = "";

// click the button to submit a country input & fetch data
$("#search-button").on("click", function () {
  console.log("this search button is clicked");
  input = $(this).siblings("#input").val();
  console.log(input);

  getCountryData();
  $(this).siblings("#input").val("");
});

// Get all the available countries & receiving the covid-19 updates
function getCountryData() {
  fetch("https://api.covid19api.com/countries")
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (responseJson) {
      // Returns all the available countries and provinces, as well as the country slug for per country requests.
      console.log(responseJson);
      for (let i = 0; i < responseJson.length; i++) {
        // Returns the input country
        if (
          responseJson[i].Country.includes(input) ||
          responseJson[i].Slug.includes(input)
        ) {
          console.log(responseJson[i]);
          let confirm = document.querySelector("#confirm");
          // conform that the input country/region has the covid-19 updates

          function getDataByCountry() {
            fetch(
              "https://api.covid19api.com/total/dayone/country/" +
                responseJson[i].Slug
            )
              .then(function (response) {
                return response.json();
              })
              .then(function (responseJson2) {
                console.log(responseJson2);
                let mostRecentIndex = responseJson2.length - 1;
                console.log(mostRecentIndex);
                console.log(responseJson2[mostRecentIndex].Active);
                let mostRecentData = responseJson2[mostRecentIndex].Date.split(
                  "T"
                )[0];
                // print the most recent date & data
                confirm.textContent =
                  mostRecentData +
                  ": " +
                  responseJson[i].Country +
                  "'s " +
                  "current active COVID-19 number is: " +
                  responseJson2[mostRecentIndex].Active;
              });
          }
          // call the data function
          getDataByCountry();
        }
        // if the response doesn't include the user's input country/area, display a message but not an alert
        else {
        }
      }
    }); // continue use .then to fetch map api
  // once the further info received, create divs, forms, cards to display the info
}
