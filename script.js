const cityInput = document.getElementById("city")
const searchBtn = document.getElementById("search")
const weatherResult = document.getElementById("Result")

searchBtn.addEventListener("click", getWeather)

async function getWeather() {
  const city = cityInput.value.trim()
  if (city === "") {
    weatherResult.innerHTML = "please enter the city name"
    return
  }
  try {
    const locationInfo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`,
    )
    const locationData = await locationInfo.json()

    if (!locationData.results) {
      weatherResult.innerHTML = "City not found"
      return
    }
    const latitude = locationData.results[0].latitude
    const longitude = locationData.results[0].longitude
    const cityName = locationData.results[0].name

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`,
    )
    const weatherData = await weatherResponse.json()

    const temperature = weatherData.current.temperature_2m

    const humidity = weatherData.current.relative_humidity_2m

    const windSpeed = weatherData.current.wind_speed_10m

    Result.innerHTML = `
        <h2>${cityName}</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} km/h</p>
    `
    localStorage.setItem("lastCity", cityName)
  } catch (error) {
    weatherResult.innerHTML = "Something went wrong. Please try again."

    console.log(error)
  }
}

const savedCity = localStorage.getItem("lastCity")

if (savedCity) {
  cityInput.value = savedCity
}
