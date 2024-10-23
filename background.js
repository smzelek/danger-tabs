chrome.webNavigation.onCompleted.addListener(info => {
    const url = info.url

    if (url.includes('chrome://') || url.includes('about:blank')) {
        return;
    }

    chrome.scripting.executeScript({
        target: {
            tabId: info.tabId,
            documentIds: [info.documentId]
        },
        func: tabWarning,
        args: [url]
    });
});

function tabWarning(url) {
    setTimeout(() => {
        chrome.storage.sync.get(
            "disabled",
            ({ disabled }) => {
                setTimeout(() => tabWarning(url), 3000);
                document.querySelectorAll('#danger-tabs-warning').forEach(el => el.remove());
                // document.body.style.boxShadow = '';

                if (disabled) {
                    return;
                }

                const isProdBuilder = url.includes("https://builder.io") || url.includes("https://www.builder.io");
                const isLocalBuilder = url.includes("local.builder.io") || url.includes("localhost:1234");
                const isLocalAiAssistant = url.includes("localhost:7242");
                const isProdAiAssistant = url.includes("https://assistant.builder.io");
                const isRootOrg = document.body.innerHTML.includes("d3e7739f05c5462bad48687394709cb2");
                const isAdminTestOrg = document.body.innerHTML.includes("d3932a87091340008e251024533e0207");
                const isPersonalOrg = document.body.innerHTML.includes("c49bd068972749829e2f2ccc01b930ea");

                if ([isProdBuilder, isLocalBuilder, isLocalAiAssistant, isProdAiAssistant, isRootOrg, isAdminTestOrg, isPersonalOrg].every(x => x === false)) {
                    return;
                }

                const label = [
                    isLocalBuilder && 'local',
                    isLocalAiAssistant && 'local',
                    isProdAiAssistant && 'PROD',
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
                    if (isLocalAiAssistant) {
                        return '#2d4695';
                    }
                    if (isProdAiAssistant) {
                        return 'red';
                    }
                })();

                // document.body.style.boxShadow = `0 0 0 5px ${color}`;
                let dangerTabsWarning = document.createElement('span');
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
                dangerTabsWarning.style.zIndex = '100';
                document.body.insertBefore(dangerTabsWarning, document.body.firstChild);
            }
        );
    }, 1500)
}
