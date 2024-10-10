const continentSelect = document.getElementById('continentSelect');
const citySelect = document.getElementById('citySelect');
const getTimeButton = document.getElementById('getTimeButton');
const resultDiv = document.getElementById('result');

// Fetch timezone data from WorldTimeAPI
async function fetchTimezones() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/timezone');
        if (!response.ok) {
            throw new Error("Could not fetch timezones");
        }
        const timezones = await response.json();
        populateDropdowns(timezones);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// Populate the dropdowns
function populateDropdowns(timezones) {
    const continents = {};

    timezones.forEach(timezone => {
        const [continent, city] = timezone.split('/');
        if (city && !continents[continent]) {
            continents[continent] = [];
        }
        if (city) {
            continents[continent].push(city);
        }
    });

    // Populate the continent dropdown
    for (const continent in continents) {
        const option = document.createElement('option');
        option.value = continent;
        option.textContent = continent.replace('_', ' ');
        continentSelect.appendChild(option);
    }

    //Event listener for
    continentSelect.addEventListener('change', () => {
        const selectedContinent = continentSelect.value;
        citySelect.innerHTML = '<option value="">Select City</option>';

        if (selectedContinent) {
            continents[selectedContinent].forEach(city => {
                const option = document.createElement('option');
                option.value = `${selectedContinent}/${city}`;
                option.textContent = city.replace('_', ' ');
                citySelect.appendChild(option);
            });
            citySelect.disabled = false;
        } else {
            citySelect.disabled = true;
        }
    });
}

// Get current time for the selected city
getTimeButton.addEventListener('click', async () => {
    const selectedCity = citySelect.value;
    if (!selectedCity) {
        alert("Please select a city.");
        return;
    }

    try {
        const response = await fetch(`https://worldtimeapi.org/api/timezone/${selectedCity}`);
        if (!response.ok) {
            throw new Error("Could not fetch the time");
        }
        const data = await response.json();
        const datetime = new Date(data.datetime);
        resultDiv.innerHTML = `
            <p>
                <strong>
                    Current Date and Time:
                </strong>
                 ${datetime.toLocaleString()}
            </p>`;
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

fetchTimezones();
