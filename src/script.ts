const lightModeIcon = document.getElementById("light-mode-icon");
const lightModeContainer = document.getElementById("light-mode-container");
//Filter
const filterSearchInput  = document.getElementById("filter-search");
const filterRegionInput = document.getElementById("filter-region");
//List
const countryList = document.getElementById("country-list");
if (lightModeContainer) {
  lightModeContainer.addEventListener("click", () => {
    lightModeIcon?.classList.toggle("fa-regular")
    document.body.classList.toggle("dark-mode")
    console.log()
  });
}
