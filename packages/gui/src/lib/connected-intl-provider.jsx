import React from 'react';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';

const ConnectedIntlProvider = ({ children }) => {
    const { locale, messages } = useSelector(state => ({
        locale: state.locales.locale,
        messages: state.locales.messages
    }));

    return (
        <IntlProvider 
            key={locale}
            locale={locale} 
            messages={messages}
        >
            {children}
        </IntlProvider>
    );
};

export default ConnectedIntlProvider;