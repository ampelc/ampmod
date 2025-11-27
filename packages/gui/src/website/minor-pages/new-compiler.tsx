import React from 'react';
import styles from '../design.css';
import newCompilerStyles from './minor-pages.css';

import {APP_NAME} from '@ampmod/branding';

export default () => (
    <>
        <header className={styles.headerContainer}>
            <h1 className={styles.headerText}>New compiler</h1>
            <p className={styles.wrap}>
                {APP_NAME} 0.3 includes a completely brand-new compiler to make projects run up to 2 times faster than
                they did in {APP_NAME} 0.2.2, by analysing project scripts even more thoroughly.
            </p>
            <div className={styles.spacing}></div>
        </header>
        <main className={styles.main}>
            <section>
                <em>
                    <p>
                        Parts of this page are based off{' '}
                        <a href="https://docs.turbowarp.org/new-compiler">TurboWarp's page</a> about the new compiler.
                        We suggest you read that to get into more detail. This page is under a CC-BY 4.0 licence.
                    </p>
                </em>
            </section>
            <section>
                <h2>Is the compiler really that fast?</h2>
                <p>
                    Indeed. Here is a table showing how long both compilers take to complete certain tasks in complex
                    projects.
                </p>
                <table className={newCompilerStyles.styledTable}>
                    <thead>
                        <tr>
                            <th>Test</th>
                            <th>Old Compiler</th>
                            <th>New Compiler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div>
                                    <a href="https://ampmod.codeberg.page/player/#1201938491">Linux in Scratch</a>
                                </div>
                                <div>Time until shell</div>
                                <div>Lower is better</div>
                            </td>
                            <td>21 seconds</td>
                            <td>12 seconds</td>
                        </tr>
                        <tr>
                            <td>
                                <div>
                                    <a href="https://ampmod.codeberg.page/player/#1201938491">Faster SHA-256 Hash</a>
                                </div>
                                <div>Hashes per second</div>
                                <div>Higher is better</div>
                            </td>
                            <td>2711 per second</td>
                            <td>3010 per second</td>
                        </tr>
                        <tr>
                            <td>
                                <div>
                                    <a href="https://ampmod.codeberg.page/player/#1201938491">Quicksort</a>
                                </div>
                                <div>Sort 200000 random items</div>
                                <div>Lower is better</div>
                            </td>
                            <td>0.0515 seconds</td>
                            <td>0.0451 seconds</td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <section>
                <h2>My project broke!</h2>
                <p>
                    Don't worry. You can report bugs with the new compiler on{' '}
                    <a href="https://codeberg.org/ampmod/ampmod/issues">Codeberg</a>. We'll fix it as soon as
                    possible.
                </p>
            </section>
            <section>
                <h2>Credits</h2>
                <p>
                    <a href="https://scratch.mit.edu/users/Tacodiva7729/">Tacodiva</a> on the TurboWarp team did almost
                    all of the underlying work on the new TurboWarp compiler, which our compiler is forked from.
                </p>
                <p>
                    <a href="https://scratch.mit.edu/users/8to16/">8to16 (aka AmpElectrecuted)</a> did the {APP_NAME}
                    -specific work.
                </p>
            </section>
        </main>
    </>
);
