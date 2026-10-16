const msPerMinute = 1000 * 60;
const msPerHour = msPerMinute * 60;
const msPerDay = msPerHour * 24;
const dayRefreshLimit = 2;
//If recent local storage is available, use that instead or remaking an API call on every refresh
export function getLocallyStoredData() {
    const storedData = localStorage.getItem("LastCountryArray");
    if (!storedData)
        return null;
    const storedJsonData = JSON.parse(storedData);
    if (storedJsonData["date"] === "undefined" ||
        storedJsonData["countryArray"] === "undefined")
        return null;
    const msSinceStored = new Date().getTime() - new Date(storedJsonData["date"]).getTime();
    const daysSinceStored = Math.floor(msSinceStored / msPerDay);
    if (daysSinceStored > dayRefreshLimit)
        return null;
    return storedJsonData["countryArray"];
}
export function setLocallyStoredData(countryArray) {
    localStorage.setItem("LastCountryArray", JSON.stringify({
        date: new Date().toISOString(),
        countryArray: countryArray,
    }));
}
