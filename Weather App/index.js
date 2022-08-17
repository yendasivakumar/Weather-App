const apikey = "eec5dbfa71143678425241b7d1176985";

document.getElementById("search").addEventListener("click", getData);

async function getData() {
  let city = document.getElementById("city").value;
  city = city.charAt(0).toUpperCase() + city.slice(1);

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&cnt=5&appid=${apikey}`;

  let res = await fetch(url);
  let data = await res.json();
  //   displayData(data);
  let lat = data.coord.lat;
  let lon = data.coord.lon;
  //   console.log(lat, lon);
  //   coord: {lon: 83.9, lat: 18.3}

  getFinalData(lat, lon, city);
}

async function getCity(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;
  let res = await fetch(url);
  let data = await res.json();
  console.log(data.name);
  getFinalData(lat, lon, data.name);
}

async function getFinalData(lat, lon, city) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metrics&appid=${apikey}`;

  let res = await fetch(url);
  let finalData = await res.json();
  displayData(finalData, city);
}

function displayData(finalData, city) {
  document.querySelector("#data").innerHTML = null;
  let div = document.getElementById("data");
  div.style.backgroundColor = "rgb(78, 78, 152)";

  let h3 = document.createElement("h3");
  h3.textContent = city;

  let h2 = document.createElement("h2");
  var val = finalData.current.temp;
  val = Number(val) - 273.15;
  val = Math.floor(val);
  h2.textContent = val + "°C";
  console.log(val);

  let divIn = document.createElement("div");
  divIn.setAttribute("class", "wind");

  let img = document.createElement("img");
  img.setAttribute(
    "src",
    "https://media2.giphy.com/media/7jc58VMVMrvjy66ikL/giphy.gif?cid=ecf05e473hyslxc3ic7ram8t3smj6id4kqpthv5t2bgktgn5&rid=giphy.gif&ct=s"
  );

  let wind = document.createElement("h3");
  let windval = finalData.current.wind_speed;
  windval = windval + " m/sec";
  wind.textContent = windval;
  divIn.append(img, wind);

  div.append(h3, h2, divIn);

  let iframe = document.getElementById("gmap_canvas");
  iframe.setAttribute(
    "src",
    `https://maps.google.com/maps?q=${city}&t=&z=13&ie=UTF8&iwloc=&output=embed`
  );

  displayForecast(finalData);
}
// https://maps.google.com/maps?q=${city}&t=&z=13&ie=UTF8&iwloc=&output=embed
function displayForecast(finalData) {
  let forecast = document.querySelector("#forecast");
  forecast.innerHTML = null;
  var someDate = new Date();
  finalData.daily.forEach(function (element) {
    someDate.setDate(someDate.getDate() + 1);

    let div = document.createElement("div");
    div.style.backgroundColor = "rgb(78, 78, 152)";

    let date = document.createElement("p");
    date.textContent = someDate.toLocaleDateString("en-us", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    let tem = document.createElement("h3");
    var val = element.temp.day;

    val = Number(val) - 273.15;
    val = Math.floor(val);
    tem.textContent = val + "°C";

    let divIn = document.createElement("div");
    divIn.setAttribute("class", "windfore");

    let img = document.createElement("img");
    img.setAttribute(
      "src",
      "https://media2.giphy.com/media/7jc58VMVMrvjy66ikL/giphy.gif?cid=ecf05e473hyslxc3ic7ram8t3smj6id4kqpthv5t2bgktgn5&rid=giphy.gif&ct=s"
    );

    let wind = document.createElement("h3");
    let windval = element.wind_speed;
    windval = windval + " m/s";
    wind.textContent = windval;
    divIn.append(img, wind);

    div.append(date, tem, divIn);

    forecast.append(div);
  });
}

let live = document.getElementById("live");
live.addEventListener("click", getLocationWeather);

function getLocationWeather() {
  navigator.geolocation.getCurrentPosition(success);
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude);
    console.log(longitude);
    getCity(latitude, longitude);
  }
}
