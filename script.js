let countryData = [];


fetch('https://restcountries.com/v3.1/all')
  .then(response => response.json())
  .then(data => {
    countryData = data;
  })
  .catch(error => console.error(error));

//  Render country data in the grid/flex container
function renderCountryData(data) {
  const countryDataContainer = document.getElementById('countryDataContainer');
  countryDataContainer.innerHTML = '';

  if (data.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'No results found.';
    countryDataContainer.appendChild(noResultsMessage);
  } else {
    data.forEach(country => {
      const countryCard = document.createElement('div');
      countryCard.classList.add('country-card');

      const countryFlag = document.createElement('img');
      countryFlag.src = country.flags.png;
      countryFlag.alt = `${country.name.common} Flag`;

      const countryName = document.createElement('h3');
      countryName.textContent = country.name.common;

      const moreDetailsButton = document.createElement('button');
      moreDetailsButton.textContent = 'More Details';
      moreDetailsButton.addEventListener('click', () => showCountryDetails(country));

      countryCard.appendChild(countryFlag);
      countryCard.appendChild(countryName);
      countryCard.appendChild(moreDetailsButton);
      countryDataContainer.appendChild(countryCard);
    });
  }
}


const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', filterCountryData);

function filterCountryData() {
  const searchQuery = searchInput.value.toLowerCase();
  const filteredCountryData = countryData.filter(country =>
    country.name.common.toLowerCase().includes(searchQuery)
  );
  renderCountryData(filteredCountryData);
}


const detailsModal = document.getElementById('detailsModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementsByClassName('close')[0];

function showCountryDetails(country) {
  const latitude = country.latlng[0];
  const longitude = country.latlng[1];

  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`)
    .then(response => response.json())
    .then(data => {
      const currentWeather = data.current_weather;
      const hourlyWeather = data.hourly;

      modalContent.innerHTML = `
        <h2>${country.name.common}</h2>
        <img src="${country.flags.png}" alt="${country.name.common} Flag" width="200">
        <p><strong>Population:</strong> ${country.population}</p>
        <p><strong>Capital:</strong> ${country.capital}</p>
        <h3>Current Weather</h3>
        <p><strong>Temperature:</strong> ${currentWeather.temperature} &deg;C</p>
        <p><strong>Wind Speed:</strong> ${currentWeather.windspeed} m/s</p>
        <h3>Hourly Forecast</h3>
        <ul>
          ${hourlyWeather.time.map((time, index) => `
            <li>
              <strong>${time}:</strong>
              Temperature: ${hourlyWeather.temperature_2m[index]} &deg;C,
              Humidity: ${hourlyWeather.relativehumidity_2m[index]}%,
              Wind Speed: ${hourlyWeather.windspeed_10m[index]} m/s
            </li>
          `).join('')}
        </ul>
      `;
    })
    .catch(error => {
      console.error(error);
      modalContent.innerHTML = '<p>Error fetching weather data.</p>';
    });

  detailsModal.style.display = 'block';
}

closeModal.addEventListener('click', () => {
  detailsModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === detailsModal) {
    detailsModal.style.display = 'none';
  }
});