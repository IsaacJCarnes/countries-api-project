import { type Country } from "./models/Country.js";
import {
  getLocallyStoredData,
  setLocallyStoredData,
} from "./services/localStorage.js";
import { getCountryData } from "./services/apiService.js";
//Light Mode
const lightModeIcon = document.getElementById("light-mode-icon");
const lightModeButton = document.getElementById("light-mode-button");
//Filter
const filterSearchInput = document.getElementById("filter-search");
const filterRegionInput = document.getElementById("filter-region");
//List
const countryList = document.getElementById("country-list");
//Details
const detailsModal = document.querySelector<HTMLDetailsElement>("details");
const detailsBackButton = document.getElementById("details-back");
const detailsImage = document.querySelector<HTMLImageElement>("#details-image");
const detailsName = document.getElementById("details-name");
const detailsNative = document.getElementById("details-native");
const detailsPopulation = document.getElementById("details-population");
const detailsRegion = document.getElementById("details-region");
const detailsSubregion = document.getElementById("details-subregion");
const detailsCapital = document.getElementById("details-capital");
const detailsTlds = document.getElementById("details-tlds");
const detailsCurrencies = document.getElementById("details-currencies");
const detailsLanguages = document.getElementById("details-languages");
const detailsBorders = document.getElementById("details-borders");

let countryArray: Country[] = [];

//Toggle light/dark mode on button click
validateListener(lightModeButton, "click", () => {
  lightModeIcon?.classList.toggle("fa-regular");
  document.body.classList.toggle("dark-mode");
});
//Toggle details page on back button click
validateListener(detailsBackButton, "click", () => {
  if (detailsModal) {
    detailsModal.open = !detailsModal.open;
  }
});
//Populate details page with details from index of targetted button
validateListener(detailsBorders, "click", (e) => {
  if (e.target instanceof HTMLElement) {
    if (e.target.tagName !== "BUTTON") return;
    populateDetailsPage(Number(e.target.dataset.index));
  }
});

async function onStartup() {
  lightModeIcon?.classList.toggle("fa-regular");
  document.body.classList.toggle("dark-mode");

  let localData = getLocallyStoredData();
  if (!localData) {
    countryArray = await getCountryData();
    setLocallyStoredData(countryArray);
  } else {
    console.log("Defaulting to local recent storage");
    countryArray = localData;
  }
  //Add index to country array for later lookups
  countryArray.forEach((country, index) => (country.index = index));

  populateDetailsPage(1);
  if (detailsModal) {
    detailsModal.open = true;
  }
}

onStartup();

function populateDetailsPage(index: number) {
  const country = countryArray[index];
  if (!country) {
    throw new Error("Requested index outside array bounds");
  }

  if (detailsImage) detailsImage.src = country.flagUrl;
  if (detailsName) detailsName.textContent = country.name;
  if (detailsNative) detailsNative.textContent = country.nativeName;
  if (detailsPopulation)
    detailsPopulation.textContent = country.population.toLocaleString("en-US");
  if (detailsRegion) detailsRegion.textContent = country.region;
  if (detailsSubregion) detailsSubregion.textContent = country.subregion;
  if (detailsCapital) detailsCapital.textContent = country.capital;
  if (detailsTlds) detailsTlds.textContent = country.tlds;
  if (detailsCurrencies)
    detailsCurrencies.textContent = prettifyArray(country.currencies);
  if (detailsLanguages)
    detailsLanguages.textContent = prettifyArray(country.languages);
  const borderCountries = countryArray.filter((borderCountry) =>
    country.borders.includes(borderCountry.code),
  );
  if (detailsBorders) {
    detailsBorders.textContent = "";
    borderCountries.forEach((borderCountry) => {
      let borderButton = document.createElement("button");
      borderButton.classList.add("basicButton");
      borderButton.dataset.index = "" + borderCountry.index;
      borderButton.textContent = borderCountry.name;
      detailsBorders.appendChild(borderButton);
    });
  }
}

//validateListener ensures the target HTMLElement exists before adding the event listener
type eventTrigger = "click"; //| "input"
function validateListener(
  target: HTMLElement | null,
  eventType: eventTrigger,
  callback: (e: Event) => void,
) {
  if (target) {
    target.addEventListener(eventType, callback);
  }
}

//Turns an array into a comma and space seperated string
function prettifyArray(array: Array<any>): string {
  return array.reduce((prevVal, curVal, currentIndex) =>
    currentIndex == 0 ? curVal : prevVal + ", " + curVal,
  );
}
