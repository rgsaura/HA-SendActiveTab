const SETTINGS_KEY = "HATABS_SETTINGS";
let last_on = null;

function checkTabs() {
  const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");

  const { host, apikey, device, sites } = settings;

  if (!host || !apikey || !device || !sites) {
    console.log("invalid settings for HA-Tabs");
  }

  const siteary = (sites || "")
    .split(";")
    .map((x) => x.trim())
    .filter((x) => x !== "");

  browser.tabs.query({}).then((tabs) => {
    let on = false;

    const activeTab = tabs.find((tab) => tab.active);

    if (activeTab) {
      on = siteary.some((site) => {
        return activeTab.url.includes(site);
      });
    }

    if (on !== last_on) {
      last_on = on;

      var req = new XMLHttpRequest();
      const url = `${host}/api/states/${device}`;

      req.open("POST", url, true);
      req.setRequestHeader("Content-type", "application/json");
      req.setRequestHeader("Authorization", `Bearer ${apikey}`);

      if (on) {
        browser.browserAction.setBadgeText({ text: "✓" });
        browser.browserAction.setBadgeBackgroundColor({ color: "green" });
        req.send('{"state":"on"}');
      } else {
        browser.browserAction.setBadgeText({ text: "" });
        req.send('{"state":"off"}');
      }
    }
  });
}

browser.tabs.onRemoved.addListener((tabId) => {
  checkTabs(tabId, true);
});

browser.tabs.onCreated.addListener((tabId) => {
  checkTabs(tabId, false);
});
browser.tabs.onUpdated.addListener((tabId) => {
  checkTabs(tabId, false);
});

browser.tabs.onActivated.addListener((tabId) => {
  checkTabs(tabId, false);
});

browser.windows.onCreated.addListener(() => {
  checkTabs();
});

browser.windows.onFocusChanged.addListener(() => {
  checkTabs();
});

checkTabs();
