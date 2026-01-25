import log from "../lib/log";

const loadServiceWorker = () => {
    if (process.env.ampmod_mode === 'standalone') return;
    navigator.serviceWorker.register(`${process.env.ROOT}service-worker.js`).then(registration => {
        log.info('SW registered: ', registration);
    }).catch(registrationError => {
        log.error('SW registration failed: ', registrationError);
    });
};

export {loadServiceWorker};
