if ('serviceWorker' in navigator) {
    console.log('Service Worker: Supported in this browser.');

    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker: Registered successfully with scope:', registration.scope);

            // Optional: Listen for updates
            registration.onupdatefound = () => {
                console.log('Service Worker: Update found.');
                const installingWorker = registration.installing;
                installingWorker.onstatechange = () => {
                    console.log('Service Worker: State changed to:', installingWorker.state);
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            console.log('Service Worker: New content available, please refresh.');
                        } else {
                            console.log('Service Worker: Content cached for offline use.');
                        }
                    }
                };
            };
        })
        .catch(error => {
            console.error('Service Worker: Registration failed with error:', error);
        });

    // Optional: Log the active service worker status
    navigator.serviceWorker.ready
        .then(() => {
            console.log('Service Worker: Ready and controlling this page.');
        })
        .catch(error => {
            console.error('Service Worker: Failed to become ready:', error);
        });
} else {
    console.warn('Service Worker: Not supported in this browser.');
}
