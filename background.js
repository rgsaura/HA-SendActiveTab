const SETTINGS_KEY = "HATABS_SETTINGS";

function checkTabs(tabId, isOnRemoved) {
  const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");

  const { host, apikey, device, sites } = settings;

  if (!host || !apikey || !device || !sites) {
    console.log("invalid settings for HA-Tabs");
  }

  const siteary = (sites || "").split(";");

  browser.tabs.query({}).then((tabs) => {
    let on = false;
    let mytabs = [...tabs];

    // onRemoved fires too early and the count is one too many.
    // see https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
    if (isOnRemoved) {
      mytabs = mytabs.filter((t) => t.id !== tabId);
    }

    for (let tab of mytabs) {
      for (let site of siteary) {
        if (tab.active && tab.url.includes(site)) on = true;
      }
    }
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
checkTabs();
