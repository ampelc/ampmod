/**
 * @summary Branding and links for the app. Forks should update these with their own branding.
 *
 * @required APP_NAME - The name of your mod (e.g. "LampMod"). Used throughout the UI and stored in projects.
 *
 * APP_WEBSITE - Your app's website on the internet.
 *
 * APP_SLOGAN - A slogan or short description of your mod. Appears in tab titles and homepage. This also needs
 * to be changed in gui/src/website/site-translations/en.json.
 *
 * @required APP_SOURCE - URL to your source code repository. Used for links and licence compliance checks.
 *
 * APP_CONTACT - URL to your contact or issue tracker page.
 *
 * APP_WIKI and APP_FORUMS - URLs to your wiki and forum, or set to null if unavailable. URLs should be absolute.
 * Also add APP_FORUMS_BUGS for links where you want to report a bug on the forums.
 *
 * APP_BLOG - Link to your blog or announcement page, if you have one.
 *
 * APP_DESCRIPTION - SEO-friendly description used on main and editor pages. This also needs to be changed in
 * gui/src/website/site-translations/en.json.
 */

module.exports.APP_NAME = 'AmpMod'; // "canary build" will be appended; you shouldn't manually check for it.
module.exports.APP_SLOGAN = 'Block-based programming, amplified';
module.exports.APP_WEBSITE = 'https://codeberg.org/ampmod/ampmod';
module.exports.APP_SOURCE = 'https://codeberg.org/ampmod/ampmod';
module.exports.APP_DESCRIPTION = `${module.exports.APP_NAME} is a block-based programming language built off TurboWarp that adds many small but meaningful features to Scratch to make it even better.`;

module.exports.APP_CONTACT = 'https://codeberg.org/ampmod/ampmod/issues';
module.exports.APP_WIKI = 'https://ampmod.miraheze.org';
// module.exports.APP_FORUMS = 'https://ampmod.flarum.cloud';
// module.exports.APP_BLOG = 'https://ampmod.flarum.cloud/blog';
// module.exports.APP_FORUMS_BUGS = 'https://ampmod.flarum.cloud/t/bugs-and-glitches';
