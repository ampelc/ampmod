import {APP_NAME, APP_WEBSITE, APP_CONTACT} from '@ampmod/branding';
export const version = process.env.ampmod_version;
export {APP_NAME as name};
export {APP_WEBSITE as url};
export {APP_CONTACT as contact};
export default {
    name: APP_NAME,
    url: APP_WEBSITE,
    version,
    contact: APP_CONTACT
};
