 
import { APP_NAME } from "@ampmod/branding";
import styles from "./update-notice.css";
import { defineMessages } from "react-intl";
import Modal from '../modal/modal.jsx';
import Box from '../box/box.jsx';

const majorMinorVersion =
  process.env.ampmod_version.match(/^\d+\.\d+/)?.[0] ||
  process.env.ampmod_version;

const messages = defineMessages({
  updatedNoticeTitle: {
    defaultMessage: '{APP_NAME} {version} Patch Notes',
    description: 'Title for the modal that shows when AmpMod is updated',
    id: 'amp.updatedNotice.title',
  },
});

export default props => (
  <Modal
    className={styles.modalContent}
    contentLabel={props.intl.formatMessage(messages.updatedNoticeTitle, { APP_NAME, version: majorMinorVersion })}
    onRequestClose={props.onCancel}
    id="ampmodUpdated"
  >
    <Box className={styles.updateModalContent}>
      {/* ampUpdateNotes 
          (The above is a shortcut to this file) */}
      <h3>Privacy policy updated</h3>
      <p>
        We updated the privacy policy. Please read the new policy{' '}
        <a href="./privacy.html" target="_blank" rel="noopener noreferrer">here</a>. Remember - we have no interest in
        holding your personal information. ;)
      </p>

      <h3>Let's start off with a PSA about addons</h3>
      <p>
        We are aware 0.3 currently breaks several addons. This is mainly due to us
        updating our development stack to newer versions, even though the addons
        rely on weird patches to get into our editor's internals. A lot of addons
        will still work fine, but we will fix the broken ones in version 0.3.1.
      </p>
      <p>
        Also, we have moved the addons button to the settings dropdown to keep
        things clean.
      </p>

      <h3>New compiler!</h3>
      <p>
        As you may know, TurboWarp now includes a new compiler to make projects run faster.
      </p>
      <p>
        This compiler has been ported to AmpMod to make projects made in it run
        faster as well. If any errors occur with AmpMod-only functionality,
        report them{' '}
        <a href="https://codeberg.org/ampmod/ampmod/issues" target="_blank" rel="noopener noreferrer">here</a>. For
        functionality from TurboWarp or vanilla Scratch, report the issue{' '}
        <a href="https://scratch.mit.edu/users/GarboMuffin" target="_blank" rel="noopener noreferrer">here</a>.
      </p>
      <p>
        <a href="./new-compiler.html" target="_blank" rel="noopener noreferrer">We have a page with more info about the compiler.</a>
      </p>

      <h3>New blocks</h3>
      <p>The following new blocks have been added in AmpMod 0.3:</p>
      <ul>
        <li>new line</li>
        <li>last key pressed</li>
        <li>() mouse button down?</li>
        <li>for each (var) in ()</li>
        <li>switch backdrop to () and wait (this was available for the stage in
            previous versions, and is now available for sprites)</li>
        <li>change by x: () y: ()</li>
        <li>running as a clone?</li>
        <li>when stop sign clicked</li>
      </ul>

      <h3>Other new features</h3>
      <p>
        AmpMod 0.3 features a bunch of new features that might make you think
        AmpMod 0.2.2 is incomplete!
      </p>
      <ul>
        <li>
          In the danger zone section of Program Settings (formerly Advanced
          Settings), you can now optionally enable case sensitivity for the ()
          = () block.
        </li>
        <li>
          You can now save custom extensions to your browser! They'll appear in
          the library when you save them.
        </li>
        <li>
          You can now filter items by multiple tags in libraries using the
          sidebar.
        </li>
        <li>
          The Arrays+ extension includes blocks that expand the Arrays category
          with new features!
        </li>
        <li>Stage size presets have been added to the Project Settings menu.</li>
        <li>
          The "Editor customisable colours" addon has been added, allowing you
          to change the colours of the editor UI to what you prefer.
        </li>
        <li>Pen is now a category instead of a separate extension.</li>
        <li>
          Operators blocks that handle strings have been moved to a new
          "Strings" category.
        </li>
      </ul>

      <h3>Bug fixes</h3>
      <ul>
        <li>
          Legacy Lists is now available (it was previously unavailable due to a
          bug; in versions of AmpMod before 0.2 the broken version was
          accessible)
        </li>
        <li>Multiple arrays bugs have been fixed</li>
      </ul>

      <h3>Translate AmpMod!</h3>
      <p>
        If you speak English fluently and are a native speaker of another
        language, you can now translate AmpMod.
      </p>

      {/* TODO: add link when i18n is fully ready */}
      {/* TODO: Make a codeberg repo with ampmod 0.2.2 assets inside, and link it here via its a.c.p link.
          Just in case someone's project breaks with the new compiler. */}

      <Box className={styles.modalBody}>
        <button className={styles.button} onClick={props.onCancel}>
          Close
        </button>
      </Box>
    </Box>
  </Modal>
);
