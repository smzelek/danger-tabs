chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    const url = tab.url

    if (url.includes('chrome://')) {
        return;
    }

    if (changeInfo.status === 'complete') {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: changeTabColor,
            args: [url]
        });
    }
});

function changeTabColor(url) {
    setTimeout(() => {
        chrome.storage.sync.get(
            "disabled",
            ({ disabled }) => {
                setTimeout(() => changeTabColor(url), 3000);
                document.querySelectorAll('#danger-tabs-warning').forEach(el => el.remove());
                document.body.style.border = 'none';

                if (disabled) {
                    return;
                }

                const isProdBuilder = url.includes("https://builder.io")
                const isLocalBuilder = url.includes("local.builder.io") || url.includes("localhost:1234");
                const isRootOrg = document.body.innerHTML.includes("d3e7739f05c5462bad48687394709cb2");
                const isAdminTestOrg = document.body.innerHTML.includes("d3932a87091340008e251024533e0207");
                const isPersonalOrg = document.body.innerHTML.includes("c49bd068972749829e2f2ccc01b930ea");

                if (!isProdBuilder && !isLocalBuilder && !isRootOrg && !isAdminTestOrg && !isPersonalOrg) {
                    return;
                }

                const label = [
                    isLocalBuilder && 'local',
                    isProdBuilder && 'PROD',
                    isRootOrg && 'BUILDER',
                    isAdminTestOrg && 'test',
                    isPersonalOrg && 'personal',
                ].filter(s => typeof (s) === 'string').join(',');

                const color = (() => {
                    if (isRootOrg) {
                        return 'red';
                    }
                    if (isProdBuilder) {
                        return 'red';
                    }
                    if (isAdminTestOrg) {
                        return 'green';
                    }
                    if (isPersonalOrg) {
                        return 'green';
                    }
                    if (isLocalBuilder) {
                        return '#2d4695';
                    }
                })();

                document.body.style.border = `1px solid ${color}`;
                let dangerTabsWarning = document.createElement('span');
                dangerTabsWarning.innerText = `<${label}>`;
                dangerTabsWarning.id = "danger-tabs-warning"
                dangerTabsWarning.style.backgroundColor = color;
                dangerTabsWarning.style.color = 'white';
                dangerTabsWarning.style.fontWeight = 'bold'
                dangerTabsWarning.style.fontSize = '10px';
                dangerTabsWarning.style.position = 'absolute';
                dangerTabsWarning.style.zIndex = '100';
                document.body.insertBefore(dangerTabsWarning, document.body.firstChild);
            }
        );
    }, 1500)
}
