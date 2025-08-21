/** 
 * @typedef {object} Options
 * @property {Config} config
 * @property {boolean} enabled
*/

/**
 * @typedef {SiteConfig[]} Config
 */

/**
 * @typedef {object} SiteConfig
 * @property {string[]}   urls
 * @property {string}     color
 * @property {string}     label
 */

const saveOptions = () => {
  const enabled = (/** @type {HTMLInputElement} */ (document.getElementById('enabled'))).checked;
  const config = (/** @type {HTMLTextAreaElement} */  (document.getElementById('config'))).value;

  chrome.storage.sync.set(
    {
      options: {
        enabled,
        config: JSON.parse(config)
      }
    },
    () => {
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    }
  );
};

const restoreOptions = () => {
  chrome.storage.sync.get(
    "options",
    /**
     * @param {{ options: Options }} args
     */
    ({ options }) => {
      (/** @type {HTMLInputElement} */ (document.getElementById('enabled'))).checked = options.enabled;
      (/** @type {HTMLTextAreaElement} */ (document.getElementById('config'))).value = JSON.stringify(options.config, null, 2);
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);