const SETTINGS_KEY = "HATABS_SETTINGS";

// Define the api variable for compatibility
const api = typeof browser === "undefined" ? chrome : browser;

function checkTabs() {
  // Use chrome.storage API to access the settings
  chrome.storage.local.get([SETTINGS_KEY], (result) => {
    const settings = result[SETTINGS_KEY] ? JSON.parse(result[SETTINGS_KEY]) : {};
    const { host, apikey, device } = settings;

    if (!host || !apikey || !device) {
      console.log("Invalid settings for HA-Tabs");
      return; // Exit if settings are invalid
    }

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab) {
        // Use fetch API for the network request
        const url = `${host}/api/states/${device}`;
        const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apikey}`
        });

        const body = JSON.stringify({ state: activeTab.title });

        fetch(url, {
          method: 'POST',
          headers: headers,
          body: body
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then(data => {
          console.log('Success:', data);
          chrome.action.setBadgeText({ text: "✓" });
          chrome.action.setBadgeBackgroundColor({ color: "green" });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }
    });
  });
}

// Listen for tab events with the appropriate API
api.tabs.onRemoved.addListener(checkTabs);
api.tabs.onCreated.addListener(checkTabs);
api.tabs.onUpdated.addListener(checkTabs);
api.tabs.onActivated.addListener(checkTabs);
api.windows.onCreated.addListener(checkTabs);
api.windows.onFocusChanged.addListener(checkTabs);

// Initial check
checkTabs();
