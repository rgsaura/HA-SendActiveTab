const SETTINGS_KEY = "HATABS_SETTINGS";

function loadSettings(callback) {
  chrome.storage.local.get([SETTINGS_KEY], (result) => {
    const settings = result[SETTINGS_KEY] ? JSON.parse(result[SETTINGS_KEY]) : {};
    callback(settings);
  });
}

function saveSettings() {
  const settings = getSettingsFromDOM();
  chrome.storage.local.set({[SETTINGS_KEY]: JSON.stringify(settings)}, () => {
    console.log("Settings saved");
  });
}

function getSettingsFromDOM() {
  const settings = {};
  for (let k of ["host", "apikey", "device"]) {
    settings[k] = document.getElementById(k)?.value;
  }
  return settings;
}

function setSettingsToDOM(settings) {
  for (let k of Object.keys(settings)) {
    if (document.getElementById(k)) {
      document.getElementById(k).value = settings[k];
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadSettings((settings) => {
    setSettingsToDOM(settings);
  });

  var link = document.getElementById("save");
  link.addEventListener("click", function () {
    saveSettings();
  });
});
