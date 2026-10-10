const lightModeIcon = document.getElementById("light-mode-icon");
const lightModeContainer = document.getElementById("light-mode-container");
//Filter
const filterSearchInput = document.getElementById("filter-search");
const filterRegionInput = document.getElementById("filter-region");
//List
const countryList = document.getElementById("country-list");
if (lightModeContainer) {
  lightModeContainer.addEventListener("click", () => {
    lightModeIcon?.classList.toggle("fa-regular");
    document.body.classList.toggle("dark-mode");
  });
}

async function getCountryData() {
  const response = await fetch(
    "https://countries-api-project.isaacjdeveloper.workers.dev/countries/v5",
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    throw new Error("Could not get API data");
  }
  const jsonResponse = await response.json()
  return jsonResponse
}

getCountryData();
