/* Global Variables */
const baseURL =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&zip="; //use metric as it is the default for regional settings in egypt
  const apiKey = "&appid=0a9242e6223ad543b0dc5ec601b710fb"; //hold my registered api key for the service


const zipInput = document.getElementById("zip");//variable to hold zip code on the page
const feelingsTextArea = document.getElementById("feelings");//variable to hold the feelings textarea on the page
const generateButton = document.getElementById("generate");//variable to hold the button reference

const dateDiv = document.getElementById("date"); //the consturcted date
const tempDiv = document.getElementById("temp");//the temperature 
const contentDiv = document.getElementById("content");//the content that will be populated with feelings 
const cityNameDiv = document.getElementById('cityName');//used to hold city name
const countryDiv = document.getElementById('country');//used to hold country name by default US

// Create a new date instance dynamically with JS
let d = new Date();
// let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();
let newDate = `${d.getFullYear()} / ${d.getMonth()+1} / ${d.getDate()}`;

generateButton.addEventListener("click", chainMyFunctions);//add a function to the click event for the generate button

async function chainMyFunctions() {
  const zipCodeValue = zipInput.value; //getting the value of zip code from the input text
  if (zipCodeValue === "" ){
    alert("The zipcode is empty, Please enter zipcode correctly.");
    return;
  }

  const feelingsValue = feelingsTextArea.value;//getting the value of the text area which holds the feelings of the user
  const myUrl = baseURL + zipCodeValue + apiKey; //consutruct the full API URL 
  try {
    await sendGetForWeatherApi(myUrl)//calling the weather API to receive temperature data
      .then(function(data) {
        sendPostRequest({//chaining a function to the previous function by using then function
          date: newDate,//passing selected values to the post route on the server
          feelings: feelingsValue,
          temp: data.main.temp,
          cityName: data.name,
          country: data.sys.country,
        });
      })
      .then(function(){//added anonymous function to complete the chaining properly as mentioned in revision
        updateUIWithData()
      });//last chain another function to the weather function and after post fucntion to udpdate the UI dynamically
  } catch (error) {//handle errors
    console.log(error);
  }
}

//an async fucntion to get the weather data from the openweathermap
async function sendGetForWeatherApi(weatherUrl) {
  const fetchResponse = await fetch(weatherUrl);
  try {
    const jsonResponse = await fetchResponse.json();
    return jsonResponse;
  } catch (error) {//handle errors
    console.log(error);
  }
}

//an async function to send post request to the server with our data to save it inside the endpoint
async function sendPostRequest(data = {}) {
  const fetchResponse = await fetch("/PostRoute", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  try {
    const jsonResponse = await fetchResponse.json();
    return jsonResponse;
  } catch (error) {//handle errors
    console.log(error);
  }
}

//an async function to update the UI with data coming from the server
async function updateUIWithData() {
  const fetchResponse = await fetch("/GetRoute");
  try {
    const jsonResponse = await fetchResponse.json();
    dateDiv.innerHTML = `Date: ${jsonResponse.date}`;
    tempDiv.innerHTML = `Temperature: ${Math.round(jsonResponse.temp)} degrees`;
    contentDiv.innerHTML = `Feelings: ${jsonResponse.feelings}`;
    cityNameDiv.innerHTML = `City Name: ${jsonResponse.cityName}`;
    countryDiv.innerHTML = `Country: ${jsonResponse.country}`;
  } catch (error) {//handle errors
    console.log(error);
  }
}
