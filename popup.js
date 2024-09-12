const saveOptions = () => {
    const disabled = document.getElementById('disabled').checked;

    chrome.storage.sync.set(
        { disabled },
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
        "disabled",
        ({ disabled }) => {
            document.getElementById('disabled').checked = disabled || false;
        }
    );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);