import '../../playground/import-first.js';
import React, { useState, useEffect, forwardRef, Ref, RefObject } from 'react';
import styles from './examples.css';
import homeStyles from '../home/home.css';
import Box from '../../components/box/box.jsx';
import Modal from '../../components/modal/modal.jsx';

import examples from '../../lib/examples';
import Localise, { localise } from '../components/localise/localise.jsx';

import { APP_NAME } from '@ampmod/branding';

type ExampleID = keyof typeof examples; // e.g., "griffpatch" | "battery"
type DownloadLink = { url: string; filename: string } | null;

interface ExampleModalProps {
  id: ExampleID;
  onCancel?: () => void;
  isSupported: boolean;
  by?: string;
}

interface ExampleProps {
  img?: string;
  id: ExampleID;
  by?: string;
  onClick?: () => void;
}

const ExampleModal: React.FC<ExampleModalProps> = (props: ExampleModalProps) => {
    return (
        <Modal
            className={styles.modalContent}
            contentLabel={localise(`examples.apz.${props.id}`)}
            onRequestClose={props.onCancel}
        >
            <Box className={styles.modalBody}>
                <Localise id={`examples.apz.${props.id}.description`} values={{APP_NAME}} />
                {!props.isSupported && (
                    <div className={styles.unsupported}>
                        <Localise id={'examples.unsupported'} />
                    </div>
                )}
                <iframe
                    src={`embed.html?example=${props.id}&use-user-theme`}
                    width="386"
                    height="330"
                    allowTransparency
                    allowFullScreen
                    style={{colorScheme: 'auto', borderRadius: '8px', border: "none"}}
                />
                <div>{`Project created by ${props.by || 'AmpMod developers'}.`}</div>
                <div className={homeStyles.buttonRow}>
                    <a className={homeStyles.button} href={`editor.html?example=${props.id}`}>
                        <Localise id="examples.open" />
                    </a>
                    <a className={homeStyles.button} href={props.url} download={localise(`examples.apz.${props.id}`) + '.apz'}>
                        <Localise id="examples.download" />
                    </a>
                </div>
            </Box>
        </Modal>
    );
};

const Example: React.FC<ExampleProps> = forwardRef<HTMLDivElement, ExampleProps>((props: ExampleProps, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={styles.example} onClick={() => {props.onClick?.(); setIsOpen(true)}} ref={ref}>
                <img className={styles.exampleThumbnail} src={props.img} draggable={false} />
                <div className={styles.exampleContent}>
                    <div className={styles.exampleTitle}>
                        <Localise id={`examples.apz.${props.id}`} />
                    </div>
                    {props.by && (
                        <div className={styles.exampleAuthor}>
                            <Localise id="examples.by" values={{creator: props.by}} />
                        </div>
                    )}
                </div>
            </div>

            {isOpen && <ExampleModal {...props} onCancel={() => setIsOpen(false)} isSupported={true} />}
        </>
    );
});

export default Example;
