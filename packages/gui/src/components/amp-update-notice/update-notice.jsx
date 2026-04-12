 
import { APP_NAME } from "@ampmod/branding";
import styles from "./update-notice.css";
import { defineMessages } from "react-intl";
import Modal from '../modal/modal.jsx';
import Box from '../box/box.jsx';
import React from 'react';

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
/* ampUpdateNotes (a shortcut to this file) */

export default props => <Modal
  className={styles.modalContent}
  contentLabel={props.intl.formatMessage(messages.updatedNoticeTitle, { APP_NAME, version: majorMinorVersion })}
  onRequestClose={props.onCancel}
  id="ampmodUpdated"
>
  <Box className={styles.updateModalContent}>
    <p>Welcome to the fifth update to AmpMod! This will probably be one of the last updates before the release of the project sharing site.</p>
    <h2>New: Expandable blocks!</h2>
    <p>The "empty array" block has been replaced with a new block you can expand to add your own items. This makes it easier to create arrays without the delimiter block (which is only good at storing strings).</p>
    <p>Try using the new + and - buttons on the empty array block.</p>

    <h2>New: Dark theme!</h2>
    <p>The dark theme has been redesigned to be more modern (but unfortunately less fun). We don't want to eradicate relics from the old era though, so the old one has been renamed to "Dark Colourful".</p>
    <Box className={styles.modalBody}>
      <button className={styles.button} onClick={props.onCancel}>
        Close
      </button>
    </Box>
  </Box>
</Modal>