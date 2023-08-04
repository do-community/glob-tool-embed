/*
Copyright 2023 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { minimatch } from 'minimatch';
import externalLinkIcon from './icons/external-link.js';
import checkIcon from './icons/check.js';
import xIcon from './icons/x.js';

export default class GlobEmbed {
    /**
     * Create a new Glob Embed from a valid Glob Embed div element.
     *
     * @param {HTMLDivElement} element The source div element from which to run the Glob Embed.
     */
    constructor(element) {
        // Save the elm
        this.element = element;

        // Get the gob string and remove from elm
        this.glob = element.getAttribute('data-glob-string');
        element.removeAttribute('data-glob-tool-embed');
        element.removeAttribute('data-glob-string');

        // Get the test strings
        this.tests = [];
        for (const attr of Array.from(element.attributes)) {
            if (attr.name.match(/^data-glob-test-\d+$/)) {
                this.tests.push(attr.value);
                element.removeAttribute(attr.name);
            }
        }

        // Prep results store
        this.results = [];
    }

    /**
     * Test each given test string against the provided glob and render the results as HTML.
     */
    run() {
        // Test the strings against the glob
        this.results = this.tests.map(test => ({
            match: minimatch(test, this.glob),
            test,
        }));

        // Container
        this.element.innerHTML = '';
        this.element.style.border = '1px solid #e5e5e5';
        this.element.style.borderRadius = '3px';
        this.element.style.margin = '16px 0';
        this.element.style.padding = '10px';

        // Heading
        const heading = document.createElement('h4');
        heading.textContent = 'Glob string: ';
        heading.style.fontSize = '14px';
        heading.style.margin = '0 0 10px';
        const glob = document.createElement('code');
        glob.textContent = this.glob;
        glob.style.background = '#eee';
        glob.style.border = '1px solid #ccc';
        glob.style.padding = '0 8px 1px';
        glob.style.borderRadius = '3px';
        glob.style.fontSize = '15px';
        glob.style.fontWeight = 'normal';
        heading.appendChild(glob);
        this.element.appendChild(heading);

        // Render the content
        this.results.forEach(result => this.element.appendChild(this.result(result)));
        this.element.appendChild(this.button());
    }

    /**
     * Convert a test string result object into a HTML div containing the match string and an icon indicating a match.
     *
     * @private
     * @param {Boolean} match If this test string matched the provided glob string.
     * @param {String} test The test string that was tested against the glob string.
     * @returns {HTMLDivElement}
     */
    result({ match, test }) {
        // Create the parent
        const parent = document.createElement('div');
        parent.style.display = 'flex';
        parent.style.flexDirection = 'row';
        parent.style.flexWrap = 'nowrap';
        parent.style.color = match ? '#0069ff' : '#666';

        // Create the icon
        const icon = document.createElement('div');
        icon.style.display = 'flex';
        icon.style.alignItems = 'center';
        icon.style.justifyContent = 'center';
        icon.style.padding = '2px 6px';
        icon.innerHTML = match ? checkIcon : xIcon;
        icon.firstElementChild.removeAttribute('class');
        icon.firstElementChild.removeAttribute('height');
        icon.firstElementChild.setAttribute('width', '16px');
        parent.appendChild(icon);

        // Create the test string
        const string = document.createElement('p');
        string.style.flexGrow = '1';
        string.style.margin = '0';
        string.style.fontSize = '16px';
        string.textContent = test;
        parent.appendChild(string);

        return parent;
    }

    /**
     * Generate a button to go to the DO Community Glob tool and test the glob string further.
     *
     * @private
     * @returns {HTMLAnchorElement}
     */
    button() {
        // Create the button
        const a = document.createElement('a');
        a.href = `https://www.digitalocean.com/community/tools/glob?glob=${encodeURIComponent(this.glob)}&${this.tests.map(t => `tests=${encodeURIComponent(t)}`).join('&')}`;
        a.target = '_blank';
        a.textContent = 'Explore this glob string in our full glob testing tool';
        a.style.background = '#0069ff';
        a.style.border = 'none';
        a.style.borderRadius = '3px';
        a.style.color = '#fff';
        a.style.display = 'inline-block';
        a.style.fontSize = '14px';
        a.style.margin = '10px 0 0';
        a.style.padding = '4px 12px 6px';
        a.style.textDecoration = 'none';

        // Add the external link
        const icon = document.createElement('div');
        icon.innerHTML = externalLinkIcon;
        icon.firstElementChild.removeAttribute('class');
        icon.firstElementChild.removeAttribute('width');
        icon.firstElementChild.setAttribute('height', '12px');
        icon.firstElementChild.style.display = 'inline-block';
        icon.firstElementChild.style.margin = '0 0 -1px 5px';
        icon.firstElementChild.style.verticalAlign = 'baseline';
        a.appendChild(icon.firstElementChild);

        return a;
    }
}
