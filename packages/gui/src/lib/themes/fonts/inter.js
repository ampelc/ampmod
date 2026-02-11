if (process.env.ampmod_mode === 'standalone') {
    import(/* webpackMode: "eager" */ '!!style-loader!css-loader!./standalone-style.css');
} else {
    import(/* webpackMode: "eager" */ "!!style-loader!css-loader!@fontsource-variable/inter/index.css");
    import(/* webpackMode: "eager" */ '!!style-loader!css-loader!@fontsource/inter/400.css');
    import(/* webpackMode: "eager" */ '!!style-loader!css-loader!@fontsource/inter/700.css');
    import(/* webpackMode: "eager" */ '!!style-loader!css-loader!@fontsource/inter/400-italic.css');
    import(/* webpackMode: "eager" */ '!!style-loader!css-loader!@fontsource/inter/700-italic.css');
}
