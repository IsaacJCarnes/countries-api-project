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
const filterSearchInput = document.getElementById(
  "filter-search",
) as HTMLInputElement;
const filterRegionInput = document.getElementById(
  "filter-region",
) as HTMLSelectElement;
//List
const countryList = document.getElementById("country-list");
const countryItemTemplate = countryList?.firstElementChild as HTMLElement;

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
let startCountryIndex = 0;
const countriesShownAmount = 8;
let filteredRegion = "";
let filteredName = "";

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

validateListener(filterSearchInput, "input", (e) => {
  e.preventDefault();
  if (e.target instanceof HTMLInputElement) {
    filteredName = e.target.value;
    renderCountryList();
  }
});

validateListener(filterRegionInput, "change", (e) => {
  e.preventDefault();
  if (e.target instanceof HTMLSelectElement) {
    filteredRegion = e.target.value;
    renderCountryList();
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
  renderCountryList();
}

onStartup();

function renderCountryList() {
  //Clear country item template in html
  if (countryList) countryList.textContent = "";
  let filteredCountries: Country[] = filterCountryArray();
  for (
    let i = startCountryIndex;
    i < startCountryIndex + countriesShownAmount;
    i++
  ) {
    const country = filteredCountries[i];
    if (country) addCountryitem(country);
  }
}

function addCountryitem(countryData: Country) {
  if (countryList && countryItemTemplate) {
    const newCountryItem = countryItemTemplate.cloneNode(true) as HTMLElement;

    const countryImg = newCountryItem.querySelector(
      ".country-image",
    ) as HTMLImageElement;
    if (countryImg) countryImg.src = countryData.flagUrl;

    const countryName = newCountryItem.querySelector(".country-name");
    if (countryName) countryName.textContent = countryData.name;

    const countryPopulation = newCountryItem.querySelector(
      ".country-population",
    );
    if (countryPopulation)
      countryPopulation.textContent =
        countryData.population.toLocaleString("en-US");

    const countryRegion = newCountryItem.querySelector(".country-region");
    if (countryRegion) countryRegion.textContent = countryData.region;

    const countryCapital = newCountryItem.querySelector(".country-capital");
    if (countryCapital) countryCapital.textContent = countryData.capital;

    countryList.appendChild(newCountryItem);
  }
}

function filterCountryArray() {
  return countryArray.filter(
    (country: Country) =>
      country.name.toLowerCase().includes(filteredName) &&
      country.region.includes(filteredRegion),
  );
}

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
      borderButton.classList.add("basicElement");
      borderButton.dataset.index = "" + borderCountry.index;
      borderButton.textContent = borderCountry.name;
      detailsBorders.appendChild(borderButton);
    });
  }
}

//validateListener ensures the target HTMLElement exists before adding the event listener
type eventTrigger = "click" | "change" | "select" | "input";
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
