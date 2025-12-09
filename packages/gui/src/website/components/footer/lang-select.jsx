import React, { useState, useEffect, useRef } from "react";
import lsNamespace from "../../../lib/amp-localstorage-namespace";
import locales from "@turbowarp/scratch-l10n";
import styles from "./footer.css";
import classNames from "classnames";
import icon from "./language-icon.svg";
import { Select } from "radix-ui";

const LANGUAGE_KEY = `${lsNamespace}language`;

const LanguageSelect = () => {
    const [currentLocale, setCurrentLocale] = useState('en');
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();
    const selectedItemRef = useRef();

    useEffect(() => {
        try {
            const stored = localStorage.getItem(LANGUAGE_KEY);
            if (stored && locales[stored]) setCurrentLocale(stored);
            else if (navigator) {
                const browserLocale = navigator.language.split('-')[0];
                setCurrentLocale(locales[browserLocale] ? browserLocale : 'en');
            }
        } catch {
            setCurrentLocale('en');
        }
    }, []);

    const handleSelect = locale => {
        setCurrentLocale(locale);
            try {
            localStorage.setItem(LANGUAGE_KEY, locale);
        } catch {}
        window.location.reload();
    };

    return (
        <Select.Root value={currentLocale} onValueChange={handleSelect}>
            <div className={styles.customDropdown} ref={dropdownRef}>
                <Select.Trigger
                    className={classNames(styles.dropdownToggle, open && styles.open)}
                    onClick={() => setOpen(prev => !prev)}
                    aria-label="Select language"
                >
                    <div style={{display: "flex", gap: "6px", alignItems: "center"}}>
                        <img src={icon} height={24} alt={"Language selection"} draggable={false} />
                        <Select.Value>{locales[currentLocale].name || currentLocale}</Select.Value>
                    </div>
                    <Select.Icon /> 
                </Select.Trigger>
                <Select.Portal>
                    <Select.Content className={styles.dropdownMenu} side="top" align="center" position="popper">
                        <Select.Viewport>
                        <Select.Group>
                            {Object.keys(locales).map(locale => (
                                <Select.Item
                                    key={locale}
                                    ref={locale === currentLocale ? selectedItemRef : null}
                                    value={locale}
                                    className={styles.dropdownItem}
                                >
                                    <Select.ItemIndicator>
                                        <div className={styles.checkmark} />
                                    </Select.ItemIndicator>
                                    {locales[locale].name || locale}
                                </Select.Item>
                            ))}
                        </Select.Group>
                        </Select.Viewport>
                    </Select.Content>
                </Select.Portal>
            </div>
        </Select.Root>
    );
};

export default LanguageSelect;
