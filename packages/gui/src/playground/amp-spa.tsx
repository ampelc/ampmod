import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import render from "./app-target";
import styles from "./amp-spa.css";
import "./import-first";
import "../lib/themes/fonts/inter";
import { APP_NAME } from "@ampmod/branding";
import { applyGuiColors } from '../lib/themes/guiHelpers';
import { detectTheme } from '../lib/themes/themePersistance';
import ErrorBoundary from '../containers/error-boundary';
import Header from '../website/components/header/header';
import Footer from '../website/components/footer/footer';
import Spinner from '../components/tw-loading-spinner/spinner';
import {loadServiceWorker} from './load-service-worker';

const Interface = lazy(() => import(/* webpackChunkName: "interface" */ './render-interface'));
const Embed = lazy(() => import(/* webpackChunkName: "embed" */ './embed'));
const Home = lazy(() => import(/* webpackChunkName: "home" */ '../website/home/home'));
const Credits = lazy(() => import(/* webpackChunkName: "credits" */ '../website/credits/credits'));
const FAQ = lazy(() => import(/* webpackChunkName: "faq" */ '../website/faq/faq'));
const Examples = lazy(() => import(/* webpackChunkName: "examples-landing" */ '../website/examples/examples'));
const AddonSettings = lazy(() => import(/* webpackChunkName: "addon-settings" */ './addon-settings'));

const MinorPages = {
  privacy: lazy(() => import(/* webpackChunkName: "pages-privacy" */ '../website/minor-pages/privacy')),
  newcompiler: lazy(() => import(/* webpackChunkName: "pages-new-compiler" */ '../website/minor-pages/new-compiler')),
};

applyGuiColors(detectTheme());

const NotFound: React.FC = () => {
  React.useEffect(() => {
    document.title = `Not Found - ${APP_NAME}`;
  }, []);

  return (
    <div className={styles.launching}>
      <h1>That page doesn't exist. :(</h1>
      <br />
      <div>
        <Link to="/editor">Use {APP_NAME}</Link>,{' '}
        <Link to="/examples">check example projects</Link> or{' '}
        <Link to="/">go to the homepage</Link>.
      </div>
    </div>
  );
};

const RedirectWithParams: React.FC<{ to: string }> = ({ to }) => {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}${location.hash}`} replace />;
};

loadServiceWorker();

render(
  <ErrorBoundary>
    <Router basename={String(process.env.ROOT || '').replace(/\/+$/, "")} future={{ v7_startTransition: true }}>
      <Suspense fallback={
        <div className={styles.launching}><Spinner bare isWhite />{process.env.ampmod_mode === "canary" && "Canary: expect bugs. Most features here will eventually be on the main site."}</div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/editor" element={<Interface />} />
          <Route path="/player" element={<RedirectWithParams to="/editor" />} />
          <Route path="/fullscreen" element={<Interface isFullScreen />} />
          <Route path="/addons" element={<AddonSettings />} />
          <Route path="/embed" element={<Embed />} />
          <Route path="/new-compiler" element={<><Header /><MinorPages.newcompiler /><Footer /></>} />
          <Route path="/privacy" element={<><Header /><MinorPages.privacy /><Footer /></>} />
          <Route path="/index.html" element={<RedirectWithParams to="/" />} />
          <Route path="/examples.html" element={<RedirectWithParams to="/examples" />} />
          <Route path="/credits.html" element={<RedirectWithParams to="/credits" />} />
          <Route path="/faq.html" element={<RedirectWithParams to="/faq" />} />
          <Route path="/editor.html" element={<RedirectWithParams to="/editor" />} />
          <Route path="/player.html" element={<RedirectWithParams to="/editor" />} />
          <Route path="/fullscreen.html" element={<RedirectWithParams to="/fullscreen" />} />
          <Route path="/addons.html" element={<RedirectWithParams to="/addons" />} />
          <Route path="/embed.html" element={<RedirectWithParams to="/embed" />} />
          <Route path="/privacy.html" element={<RedirectWithParams to="/privacy" />} />
          <Route path="/new-compiler.html" element={<RedirectWithParams to="/new-compiler" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  </ErrorBoundary>
);