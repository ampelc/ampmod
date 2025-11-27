import context from './tw-extension-worker-context.js';
import jQuery from './tw-jquery-shim.js';
import './extension-worker.js';
global.$ = jQuery;
global.jQuery = jQuery;
const id = window.__WRAPPED_IFRAME_ID__;
context.isWorker = false;
context.centralDispatchService = {
    postMessage (message, transfer) {
        const data = {
            vmIframeId: id,
            message
        };
        if (transfer) {
            window.parent.postMessage(data, '*', transfer);
        } else {
            window.parent.postMessage(data, '*');
        }
    }
};
window.parent.postMessage({
    vmIframeId: id,
    ready: true
}, '*');
