// initial var
let input = "";

// get the input search stored in the array
let arrayInput = JSON.parse(localStorage.getItem("arrayInput")) || [];

// title case function, to title case the input
function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
function titleCase(string) {
  return string
    .split(" ")
    .map((x) => capitalizeFirstLetter(x))
    .join(" ");
}

// save input as history -- function
function saveInputLocal() {
  // if the input saved before, don't need to save again
  if (arrayInput.includes(titleCase(input))) {
    return;
  }
  // local storage - save inputs to the array & create history on the left panel
  arrayInput.push(titleCase(input));
  localStorage.setItem("arrayInput", JSON.stringify(arrayInput));
  let inputList = $("#list-group");
  let inputBtn = document.createElement("button");
  inputBtn.classList = "button is-fullwidth list-group-item";
  inputBtn.textContent = titleCase(input);
  inputList.append(inputBtn);

  // enable the button right after the creation
  inputBtn.onclick = function () {
    input = inputBtn.textContent;
    // invoke the search function
    for (let i = 0; i < 1; i++) {
      document.querySelector("img")?.remove();
      getCountryData();
      getProvinceData();
      getCityData();
      document.querySelector("img")?.remove();
    }
  };
}

// initial print the local storage
for (let i = 0; i < arrayInput.length; i++) {
  let inputList = $("#list-group");
  let inputBtn = document.createElement("button");
  inputBtn.classList = "button is-fullwidth list-group-item";
  inputBtn.textContent = arrayInput[i];
  inputList.append(inputBtn);
}

// stored search, click & use it to fetch
$(".list-group-item").on("click", function () {
  input = $(this).text();
  console.log(input);
  // invoke the search function
  for (let i = 0; i < 1; i++) {
    document.querySelector("img")?.remove();
    getCountryData();
    getProvinceData();
    getCityData();
    document.querySelector("img")?.remove();
  }
});

// remove the history & clear the local storage
function createClearButton() {
  let = clearButtonDiv = $(".clear-button-div");
  let = clearButton = document.createElement("button");
  clearButton.classList = "button clear-button is-rounded is-danger mt-3";
  clearButton.textContent = "Clear History";
  clearButtonDiv.append(clearButton);
  $(clearButton).on("click", function () {
    $(".city-display").children(".list-group-item").remove();
    localStorage.clear();
    // clearButton.remove();
  });
}
createClearButton();

// Input & Search 1:
// Click the button to submit a country input & fetch data
$("#search-buttonC").on("click", function () {
  document.querySelector("img")?.remove();
  console.log("country search button is clicked");
  input = $(this).siblings("#input-div").children("#input").val();

  if (
    input === "US" ||
    input === "us" ||
    input === "usa" ||
    input === "USA" ||
    input === "united states" ||
    input === "america"
  ) {
    input = "United States";
  }

  console.log(input);
  // call the fetch function
  getCountryData();
  saveInputLocal();
  // clear the input space after each search
  $(this).siblings("#input-div").children("#input").val("");
});

// Fetch 1:
// Get all the available countries & receiving the covid-19 updates
function getCountryData() {
  fetch("https://api.covid19api.com/countries")
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (responseJson) {
      // Returns all the available countries, as well as the country slug for per country requests.
      console.log(responseJson);
      for (let i = 0; i < responseJson.length; i++) {
        // Returns the input country
        if (
          responseJson[i].Country.startsWith(input) ||
          responseJson[i].Slug.includes(input)
        ) {
          console.log(responseJson[i]);

          let confirm = document.querySelector("#confirm");
          let country = document.querySelector("#country-province");

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
                // print the most recent covid-19 updates data
                country.textContent = responseJson[i].Country;
                if (responseJson[i].Country === "United States of America") {
                  country.textContent = "US";
                }
                // let recovered =
                //   responseJson2[mostRecentIndex].Confirmed -
                //   responseJson2[mostRecentIndex].Active -
                //   responseJson2[mostRecentIndex].Deaths;
                confirm.textContent =
                  mostRecentData +
                  ": " +
                  " Active: " +
                  responseJson2[mostRecentIndex].Active +
                  ", " +
                  " Deaths: " +
                  responseJson2[mostRecentIndex].Deaths +
                  ".";

                // create country flag
                document.querySelector("img")?.remove();
                let flagDiv = document.querySelector("#flag");
                let countryFlag = document.createElement("img");

                countryFlag.setAttribute(
                  "src",
                  "https://www.countryflags.io/" +
                    responseJson[i].ISO2 +
                    "/flat/64.png"
                );
                flagDiv.appendChild(countryFlag);
              });
          }
          // call the data function
          getDataByCountry();
        }
        // if the response doesn't include the user's input country/area, display a message but not an alert
        else {
        }
      }
    });
}

// Input & Search 2:
// Click the button to submit a province input & fetch data
$("#search-buttonP").on("click", function () {
  document.querySelector("img")?.remove();
  console.log("province search button is clicked");
  input = $(this).siblings("#input-div").children("#input").val();

  if (input === "china" || input === "China" || input === "CHINA") {
    return;
  }

  console.log(input);
  // call the fetch function
  getProvinceData();
  saveInputLocal();
  // clear the input space after each search
  $(this).siblings("#input-div").children("#input").val("");
});

// Fetch 2:
// Get all the available countries & receiving the covid-19 updates
function getProvinceData() {
  fetch("https://www.trackcorona.live/api/provinces")
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (responseJson) {
      // Returns all the available province.
      console.log(responseJson);
      for (let i = 0; i < responseJson.data.length; i++) {
        // Returns the input country
        if (responseJson.data[i].location.includes(titleCase(input))) {
          console.log(responseJson.data[i].location);
          console.log(responseJson.data[i]);

          let confirm = document.querySelector("#confirm");
          let province = document.querySelector("#country-province");
          let mostRecentData = responseJson.data[i].updated.split(" ")[0];

          province.textContent =
            responseJson.data[i].country_code.toUpperCase() +
            "/" +
            responseJson.data[i].location;

          confirm.textContent =
            mostRecentData +
            ": " +
            " Confirmed: " +
            responseJson.data[i].confirmed +
            ", " +
            " Deaths: " +
            responseJson.data[i].dead +
            ".";

          // create country flag
          document.querySelector("img")?.remove();
          let flagDiv = document.querySelector("#flag");
          let countryFlag = document.createElement("img");

          countryFlag.setAttribute(
            "src",
            "https://www.countryflags.io/" +
              responseJson.data[i].country_code +
              "/flat/64.png"
          );
          flagDiv.appendChild(countryFlag);
        } else {
        }
      }
    });
}

// Input & Search 3:
// Click the button to submit a province input & fetch data
$("#search-button-city").on("click", function () {
  document.querySelector("img")?.remove();
  console.log("city search button is clicked");
  input = $(this).siblings("#input-div").children("#input").val();

  console.log(input);
  // call the fetch function
  getCityData();
  saveInputLocal();
  // clear the input space after each search
  $(this).siblings("#input-div").children("#input").val("");
});

// Fetch 3:
// Get all the available countries & receiving the covid-19 updates
function getCityData() {
  fetch("https://www.trackcorona.live/api/cities")
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (responseJson) {
      // Returns all the available province.
      console.log(responseJson);
      for (let i = 0; i < responseJson.data.length; i++) {
        // Returns the input country
        if (responseJson.data[i].location.includes(titleCase(input))) {
          console.log(responseJson.data[i].location);
          console.log(responseJson.data[i]);

          let confirm = document.querySelector("#confirm");
          let city = document.querySelector("#country-province");
          let mostRecentData = responseJson.data[i].updated.split(" ")[0];

          if (responseJson.data[i].location === "Come to Beijing from abroad") {
            responseJson.data[i].location = "Beijing";
          }
          if (responseJson.data[i].location === "Foreign to Shanghai") {
            responseJson.data[i].location = "Shanghai";
          }

          city.textContent =
            responseJson.data[i].country_code.toUpperCase() +
            "/" +
            responseJson.data[i].location;

          confirm.textContent =
            mostRecentData +
            ": " +
            " Confirmed: " +
            responseJson.data[i].confirmed +
            ", " +
            " Deaths: " +
            responseJson.data[i].dead +
            ".";

          // create country flag
          document.querySelector("img")?.remove();
          let flagDiv = document.querySelector("#flag");
          let countryFlag = document.createElement("img");

          countryFlag.setAttribute(
            "src",
            "https://www.countryflags.io/" +
              responseJson.data[i].country_code +
              "/flat/64.png"
          );
          flagDiv.appendChild(countryFlag);
        } else {
        }
      }
    });
}

//////////////////////////////// MAP AREA ////////////////////////////////
am4core.ready(function () {
  //////////////////////////////// KEEP TOP /////////////////////////////
  // the world total data
  // console.log(covid_total_timeline);
  let lastDateWorld =
    covid_total_timeline[covid_total_timeline.length - 1].date;
  let totalConfirmed =
    covid_total_timeline[covid_total_timeline.length - 1].confirmed;
  // // print world last updated date and total conformed
  // console.log(lastDateWorld);
  // console.log(totalConfirmed);

  // the world country data //
  // console.log(covid_world_timeline);
  let mostRecentDate =
    covid_world_timeline[covid_world_timeline.length - 1].date;
  console.log("The last update date for all country: " + mostRecentDate);
  let mostRecentDataCountryAll =
    covid_world_timeline[covid_world_timeline.length - 1].list;
  console.log(mostRecentDataCountryAll);
  //////////////////////////////// KEEP TOP /////////////////////////////

  //////////////////////////////// DATA AREA ////////////////////////////
  // make a map of country indexes for later use
  let countryIndexMap = {};
  // var list = covid_world_timeline[covid_world_timeline.length - 1].list;
  for (let i = 0; i < mostRecentDataCountryAll.length; i++) {
    let country = mostRecentDataCountryAll[i];
    countryIndexMap[country.id] = i;
  }

  // // calculated active cases in world data (active = confirmed - recovered)
  // for (let i = 0; i < covid_total_timeline.length; i++) {
  //   let di = covid_total_timeline[i];
  //   di.active = di.confirmed - di.recovered;
  // }

  // function that returns current slide
  // if index is not set, get last slide
  function getSlideData(index) {
    if (index == undefined) {
      index = covid_world_timeline.length - 1;
    }

    let data = covid_world_timeline[index];

    return data;
  }

  // get slide data
  let slideData = getSlideData();

  // as we will be modifying raw data, make a copy
  let mapData = JSON.parse(JSON.stringify(slideData.list));

  let max = { confirmed: 0, recovered: 0, deaths: 0 };

  // the last day will have most
  for (let i = 0; i < mapData.length; i++) {
    let di = mapData[i];
    if (di.confirmed > max.confirmed) {
      max.confirmed = di.confirmed;
    }
    if (di.recovered > max.recovered) {
      max.recovered = di.recovered;
    }
    if (di.deaths > max.deaths) {
      max.deaths = di.deaths;
    }
    max.active = max.confirmed;
  }

  // END OF DATA
  //////////////////////////////// DATA AREA /////////////////////////////

  //////////////////////////////// MAP SETUP /////////////////////////////
  // Create map instance
  let chart = am4core.create("chartdiv", am4maps.MapChart);

  // Set map definition
  chart.geodata = am4geodata_worldLow;

  // Set projection
  chart.projection = new am4maps.projections.Miller();

  // Create map polygon series
  let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

  // Make map load polygon (like country names) data from GeoJSON
  polygonSeries.useGeodata = true;
  polygonSeries.dataFields.id = "id";
  polygonSeries.dataFields.value = "confirmed";
  polygonSeries.data = mapData;

  // Configure series
  let polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipText =
    "[bold]{name}:[/]" + "\n" + "[font-size:12px]Total Confirmed: {confirmed}";

  polygonTemplate.fill = am4core.color("#727272");

  // Create hover state and set alternative fill color
  let hs = polygonTemplate.states.create("hover");
  hs.properties.fill = am4core.color("#dc3545");

  // Remove Antarctica
  polygonSeries.exclude = ["AQ"];
  //////////////////////////////// MAP SETUP /////////////////////////////
});
//////////////////////////////// END OF MAP AREA ////////////////////////////////

// for everyday total number display: "https://covid-api.com/api/reports/total"
