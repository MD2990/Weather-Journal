/* Global Variables */

const units = "imperial";
const apiKey = `bdbd673eca32ffdfc4607192143df538`;
const baseURL = `http://api.openweathermap.org/data/2.5/weather?zip=`;

// Create a new date instance dynamically with JS
const d = new Date();
const newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();

const generate = document.getElementById("generate");
const zip = document.getElementById("zip");
const feelings = document.getElementById("feelings");
const date = document.getElementById("date");
const temp = document.getElementById("temp");
const content = document.getElementById("content");
const miniIcon = document.getElementById("icn");

// on DOM load
document.addEventListener("DOMContentLoaded", function () {
  generate.classList.add("disabled");
  generate.addEventListener("click", performAction);

  // set cursor disabled generate button

  // disable the generate button if zip is empty
  zip.addEventListener("keyup", function () {
    //document.getElementById("generate").disabled = !this.value;
    if (this.value.length < 3) {
      generate.classList.add("disabled");
    } else {
      generate.classList.remove("disabled");
    }
  });
});

function performAction(e) {
  e.preventDefault();

  generate.textContent = "Loading ...";
  const zipCode = zip.value;
  const feeling = feelings.value;

  if (!zipCode) {
    alert("Please enter a zip code");
    return;
  }
  getWeather()
    .then(function (data) {
      if (!data) {
        return;
        // if no data found, we will not post anything to the server , the cleanFields() function will be called
        // from the getWeather function
      }
      postData("/add", {
        temp: data?.main?.temp,
        date: newDate,
        feelings: feeling.length ? feeling : "No Feelings",
        icon: data?.weather[0]?.icon,
      });
    })
    .then(() => updateUI())
    .catch(function (error) {
      cleanFields();
      console.log(error);
    })
    .finally(function () {
      generate.textContent = "Generate";
    });
}

const getWeather = async () => {
  const res = await fetch(
    `${baseURL}${zip.value}&appid=${apiKey}&units=${units}`
  );

  try {
    if (!res.ok) {
      alert("Please enter a valid zip code");
      cleanFields();
      return;
    }
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    cleanFields();
    console.log("error", error);
  }
};

// update UI
const updateUI = async () => {
  const request = await fetch("/getData");
  try {
    const allData = await request.json(); // if no data found, set empty object
    if (!allData || !Object.keys(allData).length) {
      alert("No Data Found ...");
      cleanFields();
      return;
    }

    setValues(allData);
  } catch (error) {
    cleanFields();
    console.log("error", error);
  }
};

// postData
const postData = async (url, data) => {
  if (!data || !Object.keys(data).length || !url) {
    alert("No Data Found ...");
    cleanFields();
    return;
  }

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    if (!response.ok) {
      alert("Please enter a valid zip code");
      zip.value = "";
      cleanFields();
      return;
    }

    const newData = await response.json();
    return newData;
  } catch (error) {
    cleanFields();
    console.log("error", error);
  }
};

function setValues(allData) {
  const { temp: temps, date: dates, feelings, icon } = allData;
  date.textContent = dates;
  temp.textContent = Math.round(temps) + "°";
  content.textContent = feelings;
  miniIcon.src = `http://openweathermap.org/img/w/${icon}.png`;
}

// clean fields on error
function cleanFields() {
  date.textContent = "";
  temp.textContent = "";
  content.textContent = "";
  zip.value = "";
  feelings.value = "";
}
