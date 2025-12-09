// Forks should change this.
// This can be accessed externally on `vm.runtime.platform`
const {APP_NAME, APP_WEBSITE, APP_CONTACT} = require('@ampmod/branding');

module.exports = {
    name: APP_NAME,
    url: APP_WEBSITE,
    version: process.env.ampmod_version,
    contact: APP_CONTACT
};
