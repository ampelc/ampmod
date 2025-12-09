 
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
    <p>Not yet done</p>

    <Box className={styles.modalBody}>
      <button className={styles.button} onClick={props.onCancel}>
        Close
      </button>
    </Box>
  </Box>
</Modal>