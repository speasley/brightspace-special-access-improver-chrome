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
    const prefix = "Brightspace Special Access Improver:";
    // Get the iframe inside the modal
    const iframe = modal.querySelector('iframe');

    if (iframe) {
        // Ensure the iframe content is fully loaded
        iframe.addEventListener('load', () => {
            console.log(`${prefix} iframe loaded, modifying content...`);
            
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            
            const specialAccessTable = iframeDocument.querySelector('#z_e');
            
            if (specialAccessTable) {
                injectCustomStyles(iframeDocument);
            } else {
                console.log(`${prefix} Table not found inside iframe.`);
            }
        });
    } else {
        console.log(`${prefix} iframe not found inside modal.`);
    }
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
