# Contributing guidelines

If you don't want to use this repository but still found a bug or want to add a feature, we recommend
making an issue about it.

We used to have a style guide, but it is no longer enforced since it conflicts with
Scratch's eslint configuration.

If you really want to contribute, you will want to know JavaScript. If you don't know the difference
between `[1]`, `1`, and `"1"`, or don't know any way of creating a function, sorry, you don't know
JavaScript. We cannot spend all of our time helping you learn it, but there are some useful tutorials
online.

In addition, we highly recommend you learn how to use Git, as it is helpful for tracking your code so
you can revert bugs. If you can't use Git, you are creating a hard fork of AmpMod, which means you cannot
contribute your changes to upstream and also cannot pull from upstream without manual intervention.

## Development environment

To set up the development environment, run `pnpm i`. You need Node.js installed (v22 and later are
preferred but v18 and later should work fine.)

Note you need Python and Java installed if you want to modify `blocks`, as it relies on Google's
(outdated) Closure Compiler.

## On joke functionality and loading messages

Joke functionality will **not** be added **except from 1-31 March**.
This includes Clippy, new joke-related loading messages, and in general, any code with April Fools logic.

This rule is in place because several PRs we received in the early days of AmpMod simply
added messages for Clippy and the loading screen even after April Fools had already passed. We
do not find this funny as it puts more burden on maintaining the editor, especially considering
almost all of the PRs were also made by people who didn't know JavaScript, put quotes inside another pair
of quotes, and caused syntax errors.

Any joke PRs made outside April Fools may be closed or marked as WIP.

## Scope

### Extensions

New extensions will **not** be added to the core editor. This is against AmpMod's
simplicity-first philosophy. If you want to add an extension, please submit it to
the [extensions repo](https://codeberg.org/ampmod/extensions). Extensions there will
be shown in AmpMod's extension library.

The separate extensions repository allows us to make development of extensions simpler
and allow a separate review process for them.

### Blocks

New blocks are allowed, but only if they fit the following criteria:

-   They do not interact with websites outside of AmpMod, TurboWarp, or Scratch
-   They fit within one of the existing categories (Motion, Looks, etc.) If not, please
    create an extension for your blocks.
-   They are expected to be used by at least 1% of users
-   They are not a duplicate of a block from an extension (excluding blocks from TurboWarp
    extensions)

Note that when a new AmpMod version is released, blocks added in it can not be removed,
but they _can_ be hidden from the toolbox. Removing blocks will break projects that
use them.

### Addons

Addons are allowed, but only if they fit the following criteria:

-   They do not interact with websites outside of AmpMod
-   They are expected to be used by at least 1% of users
-   They do not add new blocks (this should be done with extensions). Debugger is an
    exception to this rule.
-   They do not corrupt projects

However, you should add them in [ampmod/addons](https://codeberg.org/ampmod/addons) instead
of here.

## Cheat sheet

-   `pnpm i` - Install dependencies
-   `pnpm --filter=!turbowarp-desktop i` - Install dependencies, except those only needed for
    the desktop app (e.g. Electron or a snapshot of the extension gallery). This saves a few
    megabytes in case you aren't going to develop the desktop app.
-   `pnpm start` - Start a development server
-   `pnpm run build` - Build the project for production
-   `prettier --write .` - modify your files to follow our style guide

## Update the credits

If you contribute to AmpMod, you may want to add your username to the credits page.
This is found in `packages/gui/src/website/credits/users.js`.

If you have a Scratch account, go to your profile and prepend `api.` before `scratch.mit.edu`.
Then, copy the ID next to `"id":` in the JSON, and set it as `userID` in the credits file.
This will add your profile picture and a link to your profile. `username` will also need
to be the same as your Scratch username.

If you do not have a Scratch account, you can set `userID` to `0` and `username` to a nickname
you go by. You can optionally set `img` if you want to use another image instead of the default
Apple Cat; note that the image should be a perfect square else it will be squashed. You can also
optionally set `href` to a personal website, forge profile, etc. that complies with the
[Scratch Community Guidelines](https://scratch.mit.edu/community_guidelines).

Example:

```js
{
    userID: 149550011,
    username: "AmpElectrecuted",
}
```

## Othre repositories associated with the AmpMod project

All repositories below are on Codeberg unless otherwise noted.

-   [ampmod/addons](https://codeberg.org/ampmod/addons) - addons available in the Addon Settings page
-   [ampmod/manual](https://codeberg.org/ampmod/manual) - AmpMod documentation
-   [ampmod/extensions](https://codeberg.org/ampmod/extensions) - AmpMod extension gallery, forked from
    TurboWarp
-   [ampmod/ampmod-deployer](https://codeberg.org/ampmod/ampmod-deployer) - deploys AmpMod to a server
-   [ampmod/pmp2apz](https://codeberg.org/ampmod/pmp2apz) - convert incompatible projects to work with
    AmpMod
