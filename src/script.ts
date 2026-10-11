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

type country = {
  name: string;
  nativeName: string;
  population: number;
  region: string;
  subregion: string;
  capitals: string[];
  tlds: string;
  currencies: string[];
  languages: string[];
  borders: string[];
  code: string;
  flagUrl: string;
};
let countryArray: country[] = [];

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

async function onStartup() {
  lightModeIcon?.classList.toggle("fa-regular");
  document.body.classList.toggle("dark-mode");
  
  const countryData = await getCountryData();
  countryArray = reduceCountryArray(countryData.data.objects)

  populateDetailsPage(1);
  if (detailsModal) {
    detailsModal.open = true;
  }
}

onStartup();

function populateDetailsPage(index: number) {
  const country = countryArray[index];
  console.log(country);
  if (!country) {
    throw new Error("Requested index outside array bounds");
  }

  if (detailsImage) detailsImage.src = country.flagUrl;
  if (detailsName) detailsName.textContent = country.name;
  if (detailsNative) detailsNative.textContent = country.nativeName;
  if (detailsPopulation)
    detailsPopulation.textContent = "" + country.population;
  if (detailsRegion) detailsRegion.textContent = country.region;
  if (detailsSubregion) detailsSubregion.textContent = country.subregion;
  if (detailsCapital) detailsCapital.textContent = country.capitals;
  if (detailsTlds) detailsTlds.textContent = country.tlds;
  if (detailsCurrencies) detailsCurrencies.textContent = country.currencies;
  if (detailsLanguages) detailsLanguages.textContent = country.languages;
  if (detailsBorders) detailsBorders.textContent = country.borders;
}

function reduceCountryArray(inputArray: Array<any>): country[] {
  return inputArray.map((country: any) => {
    //Native Name
    const nativeNames = country["names"]?.["native"] ?? {};
    const firstNativeKey = Object.keys(nativeNames)[0];
    const nativeNameType = firstNativeKey ? (nativeNames[firstNativeKey] as Record<string, string> | undefined) : undefined;
    const firstTypeKey = nativeNameType ? Object.keys(nativeNameType)[0] : "";
    const nativeName = nativeNameType && firstTypeKey ? (nativeNameType[firstTypeKey] ?? "") : "";

    return {
      name: country["names"]["common"],
      nativeName: nativeName,
      population: country["population"],
      region: country["region"],
      subregion: country["subregion"],
      capitals: country["capitals"],
      tlds: country["tlds"],
      currencies: country["currencies"],
      languages: country["languages"],
      borders: country["borders"],
      code: country["codes"]["alpha_3"],
      flagUrl: country["flag"]["url_svg"],
    };
  });
}

async function getCountryData() {
  const response = await fetch(
    "https://countries-api-project.isaacjdeveloper.workers.dev/countries/v5?limit=100&offset=200",
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    throw new Error("Could not get API data");
  }
  const jsonResponse = await response.json();
  console.log(jsonResponse.data.objects)
  return jsonResponse;
}

//validateListener ensures the target HTMLElement exists before adding the event listener
type eventTrigger = "click"; //| "input"
function validateListener(
  target: HTMLElement | null,
  eventType: eventTrigger,
  callback: () => void,
) {
  if (target) {
    target.addEventListener(eventType, callback);
  }
}
