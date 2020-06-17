/*
Copyright 2020 DigitalOcean

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

import minimatch from 'minimatch';
import externalLinkIcon from './icons/external-link';

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
        for (const attr of element.attributes) {
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
        heading.textContent = `Glob string: ${this.glob}`;
        heading.style.fontSize = '15px';
        heading.style.margin = '0 0 20px';
        this.element.appendChild(heading);

        // Render the content
        // TODO
        this.element.appendChild(this.button());
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
        a.href = `https://www.digitalocean.com/community/tools/glob?domain=${encodeURIComponent(this.glob)}&${this.tests.map(t => `tests=${encodeURIComponent(t)}`).join('&')}`;
        a.target = '_blank';
        a.textContent = `Explore this glob string in our full glob testing tool`;
        a.style.background = '#0069ff';
        a.style.border = 'none';
        a.style.borderRadius = '3px';
        a.style.color = '#fff';
        a.style.display = 'inline-block';
        a.style.fontSize = '14px';
        a.style.margin = '15px 0 0';
        a.style.padding = '4px 12px 6px';
        a.style.textDecoration = 'none';

        // Add the external link
        const icon = document.createElement('div');
        icon.innerHTML = externalLinkIcon;
        icon.firstElementChild.className = '';
        icon.firstElementChild.removeAttribute('width');
        icon.firstElementChild.setAttribute('height', '12px');
        icon.firstElementChild.style.display = 'inline-block';
        icon.firstElementChild.style.margin = '0 0 -1px 5px';
        icon.firstElementChild.style.verticalAlign = 'baseline';
        a.appendChild(icon.firstElementChild);

        return a;
    }
}

