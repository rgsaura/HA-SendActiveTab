const SETTINGS_KEY = "HATABS_SETTINGS";
function loadSettings() {
  return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
}

function saveSettings() {
  const settings = getSettingsFromDOM();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function getSettingsFromDOM() {
  const settings = {};
  for (let k of ["host", "apikey", "device", "sites"]) {
    settings[k] = document.getElementById(k)?.value;
  }
  return settings;
}

function setSettingsToDOM() {
  const settings = loadSettings();
  console.log(settings);
  for (let k of Object.keys(settings)) {
    document.getElementById(k).value = settings[k];
  }
}
setSettingsToDOM();

document.addEventListener("DOMContentLoaded", function () {
  var link = document.getElementById("save");
  link.addEventListener("click", function () {
    saveSettings();
  });
});
