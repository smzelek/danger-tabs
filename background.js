/** @type {Options} */
const defaultOptions = {
  enabled: true,
  config: [
    {
      urls: ["https://www.google.com"],
      color: "red",
      label: "Production!"
    }
  ]
};

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === "install") {
    chrome.storage.sync.set(
      {
        options: defaultOptions
      },
      () => { }
    );
  }
});

chrome.webNavigation.onCompleted.addListener(info => {
  chrome.scripting.executeScript({
    target: {
      tabId: info.tabId,
      documentIds: [info.documentId]
    },
    func: (/** @type {any} */ (run)),
    args: [info.url]
  });
});

/**
 * @param {string} url
 * @returns
 */
function run(url) {
  if (url.match('chrome://') || url.match('about:blank')) {
    return;
  }

  const _run = () => chrome.storage.sync.get(
    "options",
    /**
     * @param {{options: Options}} _
     * @returns
     */
    ({ options }) => {
      const { enabled, config } = options ?? defaultOptions;
      document.querySelectorAll('#danger-tabs-warning').forEach(el => el.remove());

      if (!enabled) {
        return;
      }

      const matches = config.filter(sc => sc.urls.some(scu => url.match(scu)));

      if (matches.length === 0) {
        return;
      }

      const label = matches.map(m => m.label).join(',');
      const color = matches[0].color;

      const dangerTabsWarning = document.createElement('span');
      dangerTabsWarning.innerText = `<${label}>`;
      dangerTabsWarning.id = "danger-tabs-warning"
      dangerTabsWarning.style.backgroundColor = color;
      dangerTabsWarning.style.color = 'white';
      dangerTabsWarning.style.fontWeight = 'bold'
      dangerTabsWarning.style.fontSize = '10px';
      dangerTabsWarning.style.lineHeight = '10px';
      dangerTabsWarning.style.fontFamily = 'monospace';
      dangerTabsWarning.style.position = 'fixed';
      dangerTabsWarning.style.top = '0px';
      dangerTabsWarning.style.left = '0px';
      dangerTabsWarning.style.zIndex = '999999999999999';

      document.body.insertBefore(dangerTabsWarning, document.body.firstChild);
    }
  );

  chrome.storage.sync.onChanged.addListener(() => {
    _run();
  })

  _run();
}
