window.addEventListener('load', () => {
    startObserver();
});

function startObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'D2L-DIALOG-FULLSCREEN') {
                        node.classList.add("brightspace-special-access-improver");
                        setTimeout(() => {
                            modifyIframeContent(node);
                        }, 1000);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function modifyIframeContent(modal) {
    const iframe = modal.querySelector('iframe');

    if (iframe) {
        iframe.addEventListener('load', () => {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            const specialAccessTable = iframeDocument.querySelector('#z_e');
            
            if (specialAccessTable) {
                injectCustomStyles(iframeDocument);
                addTriggerButtonToFirstTd(iframeDocument);
            }
        });
    }
}

function addTriggerButtonToFirstTd(iframeDocument) {
    const firstRowFirstTd = iframeDocument.querySelector('#z_e tbody tr td:first-child');
    
    if (firstRowFirstTd) {
        const triggerButton = iframeDocument.createElement('button');
        triggerButton.type = 'button';
        triggerButton.className = 'd2l-button';
        triggerButton.innerText = 'Remove All Users from Special Access';
        triggerButton.style.background = 'transparent';
        triggerButton.style.border = '1px solid red';
        triggerButton.style.color = ' red';
        triggerButton.style.marginLeft = '10px';

        firstRowFirstTd.appendChild(triggerButton);

        triggerButton.addEventListener('click', () => {
            clickAllRemoveAnchors(iframeDocument);
            triggerButton.blur();
        });
    }
}

function clickAllRemoveAnchors(iframeDocument) {
    const rows = iframeDocument.querySelectorAll('#z_e tbody tr');
    
    rows.forEach((row) => {
        const thirdCell = row.querySelectorAll('td.dcs_c')[2];  // Get the third .dcs_c cell
        
        if (thirdCell) {
            const anchor = thirdCell.querySelector('a');
            
            if (anchor) {
                anchor.click();
            }
        }
    });
}

function injectCustomStyles(iframeDocument) {
    const style = iframeDocument.createElement('style');
    style.textContent = `
        /* Brightspace Special Access Improver */
        #z_e td.dcs_c a img {
            padding-right: 1.25em;
        }
    `;
    
    iframeDocument.head.appendChild(style);
}
