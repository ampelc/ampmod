import Base64Util from './base64-util.js';
/**
 * @param {string} url
 * @returns {Response|null}
 */
const staticFetch = url => {
    try {
        const simpleDataUrlMatch = url.match(/^data:([/-\w\d]*);base64,/i);
        if (simpleDataUrlMatch) {
            const contentType = simpleDataUrlMatch[1].toLowerCase();
            const base64 = url.substring(simpleDataUrlMatch[0].length);
            const decoded = Base64Util.base64ToUint8Array(base64);
            return new Response(decoded, {
                headers: {
                    'content-type': contentType,
                    'content-length': decoded.byteLength
                }
            });
        }
    } catch (e) {
        // not robust enough yet to care about these errors
    }
    return null;
};
export default staticFetch;
