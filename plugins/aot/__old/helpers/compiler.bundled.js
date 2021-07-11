(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.compiler = {}));
}(this, (function (exports) { 'use strict';

    function getChildNodes(node) {
        return Array.from(node.childNodes);
    }

    function noop() {
    }

    function freeze(value) {
        return Object.freeze(value);
    }

    function createMulticastSource() {
        let _emitFunctions = [];
        let _dispatchingEmitFunctions;
        let _dispatchingCount = 0;
        const emit = value => {
            if (_dispatchingCount === 0) {
                _dispatchingEmitFunctions = _emitFunctions;
                _dispatchingCount = _dispatchingEmitFunctions.length;
                for (let i = 0; _dispatchingCount > 0; i++, _dispatchingCount--) {
                    _dispatchingEmitFunctions[i](value);
                }
            } else {
                throw new Error(`Already dispatching.`);
            }
        };
        const subscribe = emit => {
            let running = true;
            if (_dispatchingCount > 0) {
                _emitFunctions = _emitFunctions.slice();
            }
            _emitFunctions.push(emit);
            return () => {
                if (running) {
                    running = false;
                    if (_dispatchingCount > 0) {
                        _dispatchingEmitFunctions[_dispatchingEmitFunctions.indexOf(emit)] = noop;
                        _emitFunctions = _emitFunctions.slice();
                    }
                    _emitFunctions.splice(_emitFunctions.indexOf(emit), 1);
                }
            };
        };
        return freeze({
            getObservers: () => {
                return _emitFunctions;
            },
            emit,
            subscribe
        });
    }

    function createListenerMap() {
        return new WeakMap();
    }
    function createListenerFunction(map) {
        return target => {
            let source;
            if (map.has(target)) {
                source = map.get(target);
            } else {
                source = createMulticastSource();
                map.set(target, source);
            }
            return source.subscribe;
        };
    }
    function createListenerDispatchFunction(map) {
        return (target, value) => {
            let source = map.get(target);
            if (source !== void 0) {
                source.emit(value);
            }
        };
    }
    function createListenerBuilderFunctions(map) {
        return freeze({
            listener: createListenerFunction(map),
            dispatch: createListenerDispatchFunction(map)
        });
    }

    function attachNode(node, parentNode, referenceNode = null) {
        parentNode.insertBefore(node, referenceNode);
    }

    const ON_NODE_ATTACHED_LISTENERS = createListenerMap();
    const {
        listener: onNodeAttachedListener,
        dispatch: dispatchNodeAttached
    } = createListenerBuilderFunctions(ON_NODE_ATTACHED_LISTENERS);
    function attachNodeWithEvent(node, parentNode, referenceNode = null, move = false) {
        attachNode(node, parentNode, referenceNode);
        dispatchNodeAttached(node, move);
    }

    function detachNode(node) {
        node.remove();
    }

    const ON_NODE_DETACHED_LISTENERS = createListenerMap();
    const {
        listener: onNodeDetachedListener,
        dispatch: dispatchNodeDetached
    } = createListenerBuilderFunctions(ON_NODE_DETACHED_LISTENERS);
    function detachNodeWithEvent(node, move = false) {
        detachNode(node);
        dispatchNodeDetached(node, move);
    }

    function getFirstChild(node) {
        return node.firstChild;
    }

    function getLastChild(node) {
        return node.lastChild;
    }

    function getNextSibling(node) {
        return node.nextSibling;
    }

    function attachDocumentFragmentWithAttachEvent(fragment, parentNode, referenceNode, move = false) {
        let node = getFirstChild(fragment);
        const lastChild = getLastChild(fragment);
        attachNode(fragment, parentNode, referenceNode);
        while (node !== null) {
            dispatchNodeAttached(node, move);
            if (node === lastChild) {
                break;
            } else {
                node = getNextSibling(node);
            }
        }
    }

    function getParentNode(node) {
        return node.parentNode;
    }

    function getNodeType(node) {
        return node.nodeType;
    }

    function isDocumentFragment(node) {
        return getNodeType(node) === Node.DOCUMENT_FRAGMENT_NODE;
    }

    function getDocument() {
        return document;
    }

    function getDocumentHead() {
        return getDocument().head;
    }

    function getAttributeValue(element, name) {
        return element.getAttribute(name);
    }

    function setAttributeValue(element, name, value) {
        if (value === null) {
            element.removeAttribute(name);
        } else {
            element.setAttribute(name, value);
        }
    }

    function hasAttribute(element, name) {
        return element.hasAttribute(name);
    }

    function createElementNode(tagName, {document = getDocument(), elementOptions} = {}) {
        return document.createElement(tagName, elementOptions);
    }

    function getPreviousSibling(node) {
        return node.previousSibling;
    }

    function isNodeNotMovingForInsertBefore(node, parentNode, referenceNode) {
        return referenceNode === null ? node === getLastChild(parentNode) : node === referenceNode || node === getPreviousSibling(referenceNode);
    }

    function moveNodeWithEvent(node, parentNode, referenceNode = null) {
        if (!isNodeNotMovingForInsertBefore(node, parentNode, referenceNode)) {
            detachNodeWithEvent(node, true);
            attachNodeWithEvent(node, parentNode, referenceNode, true);
        }
    }

    function isChildNode(node) {
        return getParentNode(node) !== null;
    }

    function nodeInsertBefore(parentNode, node, referenceNode) {
        if (isDocumentFragment(parentNode)) {
            attachNode(node, parentNode, referenceNode);
        } else {
            if (isDocumentFragment(node)) {
                attachDocumentFragmentWithAttachEvent(node, parentNode, referenceNode);
            } else {
                if (isChildNode(node)) {
                    moveNodeWithEvent(node, parentNode, referenceNode);
                } else {
                    attachNodeWithEvent(node, parentNode, referenceNode);
                }
            }
        }
        return node;
    }

    function nodeAppendChild(parentNode, node) {
        nodeInsertBefore(parentNode, node, null);
        return node;
    }

    function hasChildNodes(node) {
        return getFirstChild(node) !== null;
    }

    function isElementNode(node) {
        return getNodeType(node) === Node.ELEMENT_NODE;
    }

    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const scriptElement = createElementNode('script');
            scriptElement.onerror = () => {
                reject(new Error(`Failed to load`));
            };
            scriptElement.onload = () => {
                resolve();
            };
            scriptElement.src = url;
            nodeAppendChild(getDocumentHead(), scriptElement);
        });
    }

    let IMPORT_HTML_MINIFIER_PROMISE;
    function importHTMLMinifier() {
        if (IMPORT_HTML_MINIFIER_PROMISE === void 0) {
            IMPORT_HTML_MINIFIER_PROMISE = loadScript(`https://cdn.jsdelivr.net/npm/html-minifier/dist/htmlminifier.min.js`).then(() => {
                return globalThis.require('html-minifier')['minify'];
            });
        }
        return IMPORT_HTML_MINIFIER_PROMISE;
    }
    const DEFAULT_HTML_MINIFIER_OPTIONS = {
        caseSensitive: true,
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        conservativeCollapse: false,
        continueOnParseError: true,
        removeComments: true,
        sortAttributes: true,
        sortClassName: true
    };
    function minifyHTML(code, options = DEFAULT_HTML_MINIFIER_OPTIONS) {
        return importHTMLMinifier().then(minify => {
            return minify(code, options);
        });
    }

    const REACTIVE_ATTRIBUTE_STANDARD_REGEXP = new RegExp('^attr\\.(.*)$');
    const REACTIVE_ATTRIBUTE_PREFIXED_REGEXP = new RegExp('^attr-(.*)');
    function compileReactiveAttribute(bindProperty) {
        const match = bindProperty.prefixMode ? REACTIVE_ATTRIBUTE_PREFIXED_REGEXP.exec(bindProperty.name) : REACTIVE_ATTRIBUTE_STANDARD_REGEXP.exec(bindProperty.name);
        if (match === null) {
            return null;
        } else {
            let attributeName = match[1];
            if (bindProperty.prefixMode && attributeName === '--') {
                attributeName = '..';
            }
            if (attributeName === '..') {
                throw new Error(`TODO`);
            }
            return generateReactiveAttributeLines(attributeName, bindProperty.value);
        }
    }
    function generateReactiveAttributeLines(name, value) {
        return [
            `// reactive attribute '${ name }'`,
            `setReactiveAttribute(${ value }, node, ${ JSON.stringify(name) });`
        ];
    }

    function wrap(pattern) {
        return '(?:' + pattern + ')';
    }
    function startEnd(pattern) {
        return '^' + pattern + '$';
    }

    const CSSHex = '[0-9a-f]';
    const CSSNonASCII = '[\\u00a0-\\u{10ffff}]';
    const CSSUnicode = wrap('\\\\' + CSSHex + '{1,6}(\\r\\n|[ \\t\\r\\n\\f])?');
    const CSSEscape = wrap(CSSUnicode + '|' + '\\\\[^\\r\\n\\f0-9a-f]');
    const CSSNMStart = wrap('[_a-z]' + '|' + CSSNonASCII + '|' + CSSEscape);
    const CSSNMChar = wrap('[_a-z0-9-]' + '|' + CSSNonASCII + '|' + CSSEscape);
    const CSSIdent = '-?' + CSSNMStart + CSSNMChar + '*';
    const CSSIdentifierRegExp = new RegExp(startEnd(CSSIdent), 'u');
    function isValidCSSIdentifier(input) {
        return CSSIdentifierRegExp.test(input);
    }

    const REACTIVE_CLASS_STANDARD_REGEXP = new RegExp('^class\\.(.*)$');
    const REACTIVE_CLASS_PREFIXED_REGEXP = new RegExp('^class-(.*)');
    function compileReactiveClass(bindProperty) {
        const match = bindProperty.prefixMode ? REACTIVE_CLASS_PREFIXED_REGEXP.exec(bindProperty.name) : REACTIVE_CLASS_STANDARD_REGEXP.exec(bindProperty.name);
        if (match === null) {
            return null;
        } else {
            let className = match[1];
            if (bindProperty.prefixMode && className === '--') {
                className = '..';
            }
            if (className !== '..' && !isValidCSSIdentifier(className)) {
                throw new Error(`Invalid className '${ className }'`);
            }
            return className === '..' ? generateReactiveClassListLines(bindProperty.value) : generateReactiveClassLines(className, bindProperty.value);
        }
    }
    function generateReactiveClassLines(name, value) {
        return [
            `// reactive class '${ name }'`,
            `setReactiveClass(${ value }, node, ${ JSON.stringify(name) });`
        ];
    }
    function generateReactiveClassListLines(value) {
        return [
            `// reactive class list`,
            `setReactiveClassList(${ value }, node);`
        ];
    }

    function compileReactiveProperty(bindProperty) {
        return [
            `// reactive property '${ bindProperty.name }'`,
            `setReactiveProperty(${ bindProperty.value }, node, ${ JSON.stringify(bindProperty.name) });`
        ];
    }

    const REACTIVE_STYLE_STANDARD_REGEXP = new RegExp('^style\\.(.*)$');
    const REACTIVE_STYLE_PREFIXED_REGEXP = new RegExp('^style-(.*)');
    function compileReactiveStyle(bindProperty) {
        const match = bindProperty.prefixMode ? REACTIVE_STYLE_PREFIXED_REGEXP.exec(bindProperty.name) : REACTIVE_STYLE_STANDARD_REGEXP.exec(bindProperty.name);
        if (match === null) {
            return null;
        } else {
            let styleName = match[1];
            if (bindProperty.prefixMode && styleName === '--') {
                styleName = '..';
            }
            return styleName === '..' ? generateReactiveStyleListLines(bindProperty.value) : generateReactiveStyleLines(styleName, bindProperty.value);
        }
    }
    function generateReactiveStyleLines(name, value) {
        return [
            `// reactive style '${ name }'`,
            `setReactiveStyle(${ value }, node, ${ JSON.stringify(name) });`
        ];
    }
    function generateReactiveStyleListLines(value) {
        return [
            `// reactive style list`,
            `setReactiveStyleList(${ value }, node);`
        ];
    }

    function createSimpleIteratorCompiler(compilers) {
        return value => {
            for (let i = 0, l = compilers.length; i < l; i++) {
                const result = compilers[i](value);
                if (result !== null) {
                    return result;
                }
            }
            return null;
        };
    }
    function wrapSimpleIteratorCompilerWithExtractor(compiler, extractor) {
        return value => {
            const _value = extractor(value);
            return _value === null ? null : compiler(_value);
        };
    }

    const BIND_PROPERTY_BRACKET_PATTERN = '\\[([^\\]]+)\\]';
    const BIND_PROPERTY_PREFIX_PATTERN = 'bind-(.+)';
    const BIND_PROPERTY_PATTERN = `(?:${ BIND_PROPERTY_BRACKET_PATTERN })` + `|(?:${ BIND_PROPERTY_PREFIX_PATTERN })`;
    const BIND_PROPERTY_REGEXP = new RegExp(`^${ BIND_PROPERTY_PATTERN }$`);
    function extractBindProperty(attribute) {
        const match = BIND_PROPERTY_REGEXP.exec(attribute.name);
        if (match === null) {
            return null;
        } else {
            const prefixMode = match[2] !== void 0;
            return {
                name: prefixMode ? match[2] : match[1],
                value: attribute.value.trim(),
                prefixMode
            };
        }
    }

    const DEFAULT_BIND_PROPERTY_COMPILERS = [
        compileReactiveAttribute,
        compileReactiveClass,
        compileReactiveStyle,
        compileReactiveProperty
    ];
    const compileBindProperty = createSimpleIteratorCompiler(DEFAULT_BIND_PROPERTY_COMPILERS);
    const compileBindPropertyFromAttr = wrapSimpleIteratorCompilerWithExtractor(compileBindProperty, extractBindProperty);

    function compileReactiveEventListener(eventProperty) {
        return [
            `// reactive event listener '${ eventProperty.name }'`,
            `setReactiveEventListener(${ eventProperty.value }, node, ${ JSON.stringify(eventProperty.name) });`
        ];
    }

    const EVENT_ATTRIBUTE_BRACKET_PATTERN = '\\(([^\\)]+)\\)';
    const EVENT_ATTRIBUTE_PREFIX_PATTERN = 'on-(.+)';
    const EVENT_ATTRIBUTE_PATTERN = `(?:${ EVENT_ATTRIBUTE_BRACKET_PATTERN })` + `|(?:${ EVENT_ATTRIBUTE_PREFIX_PATTERN })`;
    const EVENT_ATTRIBUTE_REGEXP = new RegExp(`^${ EVENT_ATTRIBUTE_PATTERN }$`);
    function extractEventProperty(attribute) {
        const match = EVENT_ATTRIBUTE_REGEXP.exec(attribute.name);
        if (match === null) {
            return null;
        } else {
            const prefixMode = match[2] !== void 0;
            return {
                name: prefixMode ? match[2] : match[1],
                value: attribute.value.trim(),
                prefixMode
            };
        }
    }

    const DEFAULT_EVENT_PROPERTY_COMPILERS = [compileReactiveEventListener];
    const compileEventProperty = createSimpleIteratorCompiler(DEFAULT_EVENT_PROPERTY_COMPILERS);
    const compileEventPropertyFromAttr = wrapSimpleIteratorCompilerWithExtractor(compileEventProperty, extractEventProperty);

    function dashCaseToCamelCase(input) {
        return input.replace(/-([a-z])/g, match => match[1].toUpperCase());
    }

    function getReferencePropertyJSName(referenceProperty) {
        return referenceProperty.value === '' ? dashCaseToCamelCase(referenceProperty.name) : referenceProperty.value;
    }
    const REFERENCE_ATTRIBUTE_BRACKET_PATTERN = '\\#([^\\)]+)';
    const REFERENCE_ATTRIBUTE_PREFIX_PATTERN = 'ref-(.+)';
    const REFERENCE_ATTRIBUTE_PATTERN = `(?:${ REFERENCE_ATTRIBUTE_BRACKET_PATTERN })` + `|(?:${ REFERENCE_ATTRIBUTE_PREFIX_PATTERN })`;
    const REFERENCE_ATTRIBUTE_REGEXP = new RegExp(`^${ REFERENCE_ATTRIBUTE_PATTERN }$`);
    function extractReferenceProperty(attribute) {
        const match = REFERENCE_ATTRIBUTE_REGEXP.exec(attribute.name);
        if (match === null) {
            return null;
        } else {
            const prefixMode = match[2] !== void 0;
            return {
                name: prefixMode ? match[2] : match[1],
                value: attribute.value.trim(),
                prefixMode
            };
        }
    }

    function compileDefaultReferenceProperty(referenceProperty) {
        const variableName = getReferencePropertyJSName(referenceProperty);
        const lines = [
            `// reference '${ variableName }'`,
            `var ${ variableName } = node;`
        ];
        return lines;
    }

    const DEFAULT_REFERENCE_PROPERTY_COMPILERS = [compileDefaultReferenceProperty];
    const compileReferenceProperty = createSimpleIteratorCompiler(DEFAULT_REFERENCE_PROPERTY_COMPILERS);
    const compileReferencePropertyFromAttr = wrapSimpleIteratorCompilerWithExtractor(compileReferenceProperty, extractReferenceProperty);

    function compileStaticAttribute(attribute) {
        return [
            `// static attribute '${ attribute.name }'`,
            `setAttributeValue(node, ${ JSON.stringify(attribute.name) }, ${ JSON.stringify(attribute.value) });`
        ];
    }

    const DEFAULT_ATTRIBUTE_COMPILERS = [
        compileReferencePropertyFromAttr,
        compileBindPropertyFromAttr,
        compileEventPropertyFromAttr,
        compileStaticAttribute
    ];
    const compileAttribute = createSimpleIteratorCompiler(DEFAULT_ATTRIBUTE_COMPILERS);

    function indentLines(lines, indent = '  ', copy = false) {
        if (copy) {
            return lines.map(line => indent + line);
        } else {
            for (let i = 0, l = lines.length; i < l; i++) {
                lines[i] = indent + lines[i];
            }
            return lines;
        }
    }
    function scopeLines(lines, copy = false) {
        if (copy) {
            return [
                '{',
                ...indentLines(lines, void 0, true),
                '}'
            ];
        } else {
            indentLines(lines);
            lines.unshift('{');
            lines.push('}');
            return lines;
        }
    }
    function linesToString(lines) {
        return lines.join('\n');
    }
    function nullIfEmptyLines(lines) {
        return lines.length === 0 ? null : lines;
    }
    function optionalLines(lines) {
        return lines === null ? [] : lines;
    }

    function compileDefaultAttributes(attributes) {
        const lines = [];
        for (let i = 0, l = attributes.length; i < l; i++) {
            const result = compileAttribute(attributes[i]);
            if (result !== null) {
                lines.push(...result);
            }
        }
        return nullIfEmptyLines(lines);
    }

    const DEFAULT_ATTRIBUTES_COMPILERS = [compileDefaultAttributes];
    const compileAttributes = createSimpleIteratorCompiler(DEFAULT_ATTRIBUTES_COMPILERS);

    function compileStaticTextNode(node) {
        return compileStaticText(node.data);
    }
    function compileStaticText(text) {
        return text === '' ? null : generateStaticTextNodeLines(text);
    }
    function generateStaticTextNodeLines(text) {
        return [
            `// static text node`,
            `nodeAppendChild(parentNode, createTextNode(${ JSON.stringify(text) }));`
        ];
    }

    const REACTIVE_TEXT_NODE_PATTERN = '{{(.*?)}}';
    const REACTIVE_TEXT_NODE_REGEXP = new RegExp(REACTIVE_TEXT_NODE_PATTERN, 'g');
    function compileReactiveTextNode(node) {
        return compileReactiveText(node.data);
    }
    function compileReactiveText(text) {
        const lines = [];
        REACTIVE_TEXT_NODE_REGEXP.lastIndex = 0;
        let match;
        let index = 0;
        while ((match = REACTIVE_TEXT_NODE_REGEXP.exec(text)) !== null) {
            if (index !== match.index) {
                lines.push(...generateStaticTextNodeLines(text.substring(index, match.index)));
            }
            lines.push(...generateReactiveTextNodeLines(match[1]));
            index = match.index + match[0].length;
        }
        if (index !== text.length) {
            lines.push(...generateStaticTextNodeLines(text.substring(index)));
        }
        return nullIfEmptyLines(lines);
    }
    function generateReactiveTextNodeLines(code) {
        return [
            `// reactive text node`,
            `nodeAppendChild(parentNode, createReactiveTextNode(${ code.trim() }));`
        ];
    }

    const DEFAULT_TEXT_NODE_COMPILERS = [
        compileReactiveTextNode,
        compileStaticTextNode
    ];
    const compileTextNode = createSimpleIteratorCompiler(DEFAULT_TEXT_NODE_COMPILERS);

    function generateObjectPropertiesLines(entries = [], onEmpty = [`{}`]) {
        if (entries.length === 0) {
            return onEmpty;
        } else {
            return [
                `{`,
                ...indentLines(entries.map(([propertyName, propertyValue]) => {
                    return propertyName === propertyValue || propertyValue.trim() === '' ? `${ propertyName },` : `${ propertyName }: ${ propertyValue },`;
                })),
                `}`
            ];
        }
    }
    function generateObjectPropertyEntry(propertyName, propertyValue = propertyName) {
        return [
            propertyName,
            propertyValue
        ];
    }

    const LET_PROPERTY_PATTERN = 'let-(.+)';
    const LET_PROPERTY_REGEXP = new RegExp(`^${ LET_PROPERTY_PATTERN }$`);
    function extractLetProperty(attribute) {
        const match = LET_PROPERTY_REGEXP.exec(attribute.name);
        if (match === null) {
            return null;
        } else {
            return {
                name: match[1],
                value: attribute.value.trim()
            };
        }
    }
    function convertLetPropertyToObjectPropertyEntry(letProperty) {
        return generateObjectPropertyEntry(letProperty.name, letProperty.value);
    }

    function compileRXTemplate(node) {
        const name = node.tagName.toLowerCase();
        if (name === 'rx-template') {
            let referenceProperty;
            const constantsToImports = [];
            const attributes = Array.from(node.attributes);
            for (let i = 0, l = attributes.length; i < l; i++) {
                const attribute = attributes[i];
                const letProperty = extractLetProperty(attribute);
                if (letProperty === null) {
                    const _referenceProperty = extractReferenceProperty(attribute);
                    if (_referenceProperty === null) {
                        if (attribute.name === 'name') {
                            if (referenceProperty === void 0) {
                                referenceProperty = {
                                    value: attribute.value,
                                    name: '',
                                    prefixMode: false
                                };
                            } else {
                                throw new Error(`Found duplicate template's name through attribute 'name'`);
                            }
                        } else {
                            throw new Error(`Found invalid attribute '${ attribute.name }'`);
                        }
                    } else {
                        if (referenceProperty === void 0) {
                            referenceProperty = _referenceProperty;
                        } else {
                            throw new Error(`Found duplicate template's name through reference #${ referenceProperty.name }`);
                        }
                    }
                } else {
                    constantsToImports.push(convertLetPropertyToObjectPropertyEntry(letProperty));
                }
            }
            if (referenceProperty === void 0) {
                throw new Error(`Missing a reference for this template`);
            }
            let compiledChildren = compileNodes(getChildNodes(node));
            if (compiledChildren === null) {
                compiledChildren = [];
            }
            const variableName = getReferencePropertyJSName(referenceProperty);
            const lines = [
                `// template`,
                `var ${ variableName } = (`,
                ...indentLines(generateRXTemplateFunctionLines(compiledChildren, constantsToImports)),
                `);`
            ];
            return lines;
        } else {
            return null;
        }
    }
    function generateRXTemplateFunctionLines(lines, constantsToImport) {
        return [
            `(`,
            ...indentLines(generateObjectPropertiesLines(constantsToImport, [])),
            `) => {`,
            ...indentLines([
                `const parentNode = createDocumentFragment();`,
                ...lines,
                `return parentNode;`
            ]),
            `}`
        ];
    }

    function extractRXAttributes(attributes, expectedAttributes) {
        const mappedAttributes = new Map();
        for (let i = 0, l = attributes.length; i < l; i++) {
            const attribute = attributes[i];
            if (expectedAttributes.has(attribute.name)) {
                mappedAttributes.set(attribute.name, attribute.value);
            } else {
                throw new Error(`Found invalid attribute '${ attribute.name }'`);
            }
        }
        return mappedAttributes;
    }

    const TAG_NAME$7 = 'rx-inject-content';
    const CONTENT_ATTRIBUTE_NAME = 'content';
    const ATTRIBUTE_NAMES$5 = new Set([CONTENT_ATTRIBUTE_NAME]);
    function compileRXInjectContent(node) {
        const name = node.tagName.toLowerCase();
        if (name === TAG_NAME$7) {
            const attributes = extractRXAttributes(node.attributes, ATTRIBUTE_NAMES$5);
            const template = attributes.get(CONTENT_ATTRIBUTE_NAME);
            if (template === void 0) {
                throw new Error(`Missing attribute '${ ATTRIBUTE_NAMES$5 }'`);
            }
            if (hasChildNodes(node)) {
                throw new Error(`Should not have any children`);
            }
            return generateRXInjectContentLines(template);
        } else {
            return null;
        }
    }
    function generateRXInjectContentLines(content) {
        return [
            `// reactive content`,
            `nodeAppendChild(parentNode, createReactiveContentNode(${ content }));`
        ];
    }

    const TAG_NAME$6 = 'rx-container';
    function compileRXContainer(node) {
        if (isRXContainer(node)) {
            return compileNodes(getChildNodes(node));
        } else {
            return null;
        }
    }
    function isRXContainer(node) {
        return node.tagName.toLowerCase() === TAG_NAME$6;
    }

    function generateLocalTemplateLinesFromNodes(nodes, templateName = 'template', constantsToImport) {
        return [
            `const ${ templateName } = (`,
            ...indentLines(generateRXTemplateFunctionLines(optionalLines(compileNodes(nodes)), constantsToImport)),
            `);`
        ];
    }

    function generateLocalTemplateLinesFromElement(node, templateName = 'template', constantsToImport) {
        return [
            `const ${ templateName } = (`,
            ...indentLines(generateRXTemplateFunctionLines(optionalLines(compileElement(node)), constantsToImport)),
            `);`
        ];
    }

    function generateLocalTemplateLinesFromRXContainerOrElement(node, templateName = 'template', constantsToImport) {
        return isRXContainer(node) ? generateLocalTemplateLinesFromNodes(getChildNodes(node), templateName, constantsToImport) : generateLocalTemplateLinesFromElement(node, templateName, constantsToImport);
    }

    const TAG_NAME$5 = 'rx-if';
    const COMMAND_NAME$3 = '*if';
    const CONDITION_ATTRIBUTE_NAME = 'condition';
    const TEMPLATE_TRUE_ATTRIBUTE_NAME = 'true';
    const TEMPLATE_FALSE_ATTRIBUTE_NAME = 'false';
    const LOCAL_TEMPLATE_NAME$3 = 'template';
    const NULL_TEMPLATE$1 = 'null';
    const ATTRIBUTE_NAMES$4 = new Set([
        CONDITION_ATTRIBUTE_NAME,
        TEMPLATE_TRUE_ATTRIBUTE_NAME,
        TEMPLATE_FALSE_ATTRIBUTE_NAME
    ]);
    function compileRXIf(node) {
        const name = node.tagName.toLowerCase();
        if (name === TAG_NAME$5) {
            const attributes = extractRXAttributes(node.attributes, ATTRIBUTE_NAMES$4);
            const condition = attributes.get(CONDITION_ATTRIBUTE_NAME);
            const templateTrue = attributes.get(TEMPLATE_TRUE_ATTRIBUTE_NAME);
            const templateFalse = attributes.get(TEMPLATE_FALSE_ATTRIBUTE_NAME);
            if (condition === void 0) {
                throw new Error(`Missing attribute '${ CONDITION_ATTRIBUTE_NAME }'`);
            }
            if (templateTrue === void 0 && templateFalse === void 0) {
                throw new Error(`At least '${ TEMPLATE_TRUE_ATTRIBUTE_NAME }' or '${ TEMPLATE_FALSE_ATTRIBUTE_NAME }' attribute must be present`);
            }
            if (hasChildNodes(node)) {
                throw new Error(`Should not have any children`);
            }
            return generateRXIfLines(condition, templateTrue, templateFalse);
        } else if (hasAttribute(node, COMMAND_NAME$3)) {
            const condition = getAttributeValue(node, COMMAND_NAME$3);
            setAttributeValue(node, COMMAND_NAME$3, null);
            return scopeLines([
                ...generateLocalTemplateLinesFromRXContainerOrElement(node, LOCAL_TEMPLATE_NAME$3),
                ...generateRXIfLines(condition, LOCAL_TEMPLATE_NAME$3, NULL_TEMPLATE$1)
            ]);
        } else {
            return null;
        }
    }
    function generateRXIfLines(condition, templateTrue = NULL_TEMPLATE$1, templateFalse = NULL_TEMPLATE$1) {
        return [
            `// reactive if`,
            `nodeAppendChild(parentNode, createReactiveIfNode(${ condition }, ${ templateTrue }, ${ templateFalse }));`
        ];
    }

    const TAG_NAME$4 = 'rx-for-loop';
    const COMMAND_NAME$2 = '*for';
    const ITEMS_ATTRIBUTE_NAME = 'items';
    const TEMPLATE_ATTRIBUTE_NAME = 'template';
    const TRACK_BY_ATTRIBUTE_NAME = 'track-by';
    const LOCAL_TEMPLATE_NAME$2 = 'template';
    const ATTRIBUTE_NAMES$3 = new Set([
        ITEMS_ATTRIBUTE_NAME,
        TEMPLATE_ATTRIBUTE_NAME,
        TRACK_BY_ATTRIBUTE_NAME
    ]);
    function compileRXForLoop(node) {
        const name = node.tagName.toLowerCase();
        if (name === TAG_NAME$4) {
            const attributes = extractRXAttributes(node.attributes, ATTRIBUTE_NAMES$3);
            const items = attributes.get(ITEMS_ATTRIBUTE_NAME);
            const template = attributes.get(TEMPLATE_ATTRIBUTE_NAME);
            const trackBy = attributes.get(TRACK_BY_ATTRIBUTE_NAME);
            const options = [];
            if (items === void 0) {
                throw new Error(`Missing attribute '${ ITEMS_ATTRIBUTE_NAME }'`);
            }
            if (template === void 0) {
                throw new Error(`Missing attribute '${ TEMPLATE_ATTRIBUTE_NAME }'`);
            }
            if (trackBy !== void 0) {
                options.push([
                    'trackBy',
                    trackBy
                ]);
            }
            if (hasChildNodes(node)) {
                throw new Error(`Should not have any children`);
            }
            return generateRXForLoopLines(items, template, generateObjectPropertiesLines(options));
        } else if (hasAttribute(node, COMMAND_NAME$2)) {
            const command = extractRXForLoopCommand(getAttributeValue(node, COMMAND_NAME$2));
            setAttributeValue(node, COMMAND_NAME$2, null);
            const options = [];
            if (command.trackBy !== void 0) {
                options.push([
                    'trackBy',
                    command.trackBy
                ]);
            }
            const constantsToImport = [];
            if (command.item !== void 0) {
                constantsToImport.push([
                    'item',
                    command.item
                ]);
            }
            if (command.index !== void 0) {
                constantsToImport.push([
                    'index',
                    command.index
                ]);
            }
            return scopeLines([
                ...generateLocalTemplateLinesFromRXContainerOrElement(node, LOCAL_TEMPLATE_NAME$2, constantsToImport),
                ...generateRXForLoopLines(command.items, LOCAL_TEMPLATE_NAME$2, generateObjectPropertiesLines(options))
            ]);
        } else {
            return null;
        }
    }
    function generateRXForLoopLines(items, template, options) {
        return [
            `// reactive for loop`,
            `nodeAppendChild(`,
            ...indentLines([
                `parentNode,`,
                `createReactiveForLoopNode(`,
                ...indentLines([
                    `${ items },`,
                    `${ template },`,
                    ...options
                ]),
                `)`
            ]),
            `);`
        ];
    }
    const LET_OF_PATTERN = 'let\\s+(\\S.*)\\s+of\\s+(\\S.*)';
    const VARIABLE_AS_PATTERN = '(\\S.*)\\s+as\\s+(\\S.*)';
    const OPTION_PATTERN = '(\\S.*)\\s*\\:\\s*(.*)';
    const LET_OF_REGEXP = new RegExp(`^${ LET_OF_PATTERN }$`);
    const VARIABLE_AS_REGEXP = new RegExp(`^${ VARIABLE_AS_PATTERN }$`);
    const OPTION_REGEXP = new RegExp(`^${ OPTION_PATTERN }$`);
    function generateForCommandInvalidSyntaxError(expression, message) {
        return new Error(`Invalid syntax in the 'for' command '${ expression }': ${ message }`);
    }
    function extractRXForLoopCommand(input) {
        let items;
        let trackBy;
        let item;
        let index;
        const expressions = input.split(';').map(_ => _.trim()).filter(_ => _ !== '');
        const length = expressions.length;
        if (length === 0) {
            throw generateForCommandInvalidSyntaxError(input, 'missing iterable');
        } else {
            const match = LET_OF_REGEXP.exec(expressions[0]);
            if (match === null) {
                throw generateForCommandInvalidSyntaxError(input, `invalid 'let ... of ...' syntax`);
            } else {
                item = match[1];
                items = match[2];
            }
        }
        for (let i = 1; i < length; i++) {
            const expression = expressions[i];
            let match;
            if ((match = VARIABLE_AS_REGEXP.exec(expression)) !== null) {
                const variableName = match[1];
                const variableMappedName = match[2];
                switch (variableName) {
                case 'index':
                    index = variableMappedName;
                    break;
                default:
                    throw generateForCommandInvalidSyntaxError(expression, `invalid local variable '${ variableName }'`);
                }
            } else if ((match = OPTION_REGEXP.exec(expression)) !== null) {
                const name = match[1];
                const value = match[2];
                switch (name) {
                case 'trackBy':
                    trackBy = value;
                    break;
                default:
                    throw generateForCommandInvalidSyntaxError(expression, `invalid option '${ name }'`);
                }
            } else {
                throw generateForCommandInvalidSyntaxError(input, `unknown expression '${ expression }'`);
            }
        }
        return {
            items,
            trackBy,
            item,
            index
        };
    }

    const TAG_NAME$3 = 'rx-inject-template';
    function compileRXInjectTemplate(node) {
        const name = node.tagName.toLowerCase();
        if (name === TAG_NAME$3) {
            let referenceName;
            const letProperties = [];
            const attributes = Array.from(node.attributes);
            for (let i = 0, l = attributes.length; i < l; i++) {
                const attribute = attributes[i];
                const letProperty = extractLetProperty(attribute);
                if (letProperty === null) {
                    if (attribute.name === 'template') {
                        if (referenceName === void 0) {
                            referenceName = attribute.value;
                        } else {
                            throw new Error(`Found duplicate template reference name through attribute 'name'`);
                        }
                    } else {
                        throw new Error(`Found invalid attribute '${ attribute.name }'`);
                    }
                } else {
                    letProperties.push(letProperty);
                }
            }
            if (hasChildNodes(node)) {
                throw new Error(`Should not have any children`);
            }
            return [
                `// inject template`,
                `attachTemplate(`,
                ...indentLines([
                    `${ referenceName },`,
                    `getTemplateReference(${ JSON.stringify(referenceName) }),`,
                    `{`,
                    ...indentLines(letProperties.map(letProperty => {
                        return `${ letProperty.name }: (${ letProperty.value }),`;
                    })),
                    `},`,
                    `parentNode,`
                ]),
                `);`
            ];
        } else {
            return null;
        }
    }

    const TAG_NAME$2 = 'rx-switch-case';
    const COMMAND_NAME$1 = '*switch-case';
    const SWITCH_CASE_ATTRIBUTE_NAME = 'case';
    const LOCAL_TEMPLATE_NAME$1 = 'template';
    const NULL_TEMPLATE = 'null';
    const ATTRIBUTE_NAMES$2 = new Set([
        SWITCH_CASE_ATTRIBUTE_NAME,
        LOCAL_TEMPLATE_NAME$1
    ]);
    function compileRXSwitchCase(node, switchMapName, existingSwitchCaseValues) {
        const name = node.tagName.toLowerCase();
        if (name === TAG_NAME$2) {
            const attributes = extractRXAttributes(node.attributes, ATTRIBUTE_NAMES$2);
            const caseValue = attributes.get(SWITCH_CASE_ATTRIBUTE_NAME);
            const template = attributes.get(LOCAL_TEMPLATE_NAME$1);
            if (caseValue === void 0) {
                throw new Error(`Missing attribute '${ SWITCH_CASE_ATTRIBUTE_NAME }'`);
            }
            if (existingSwitchCaseValues.has(caseValue)) {
                throw new Error(`case '${ caseValue }' already exists`);
            } else {
                existingSwitchCaseValues.add(caseValue);
            }
            if (hasChildNodes(node)) {
                throw new Error(`Should not have any children`);
            }
            return generateRXSwitchCaseLines(switchMapName, caseValue, template);
        } else if (hasAttribute(node, COMMAND_NAME$1)) {
            const caseValue = getAttributeValue(node, COMMAND_NAME$1);
            setAttributeValue(node, COMMAND_NAME$1, null);
            return scopeLines([
                ...generateLocalTemplateLinesFromRXContainerOrElement(node, LOCAL_TEMPLATE_NAME$1),
                ...generateRXSwitchCaseLines(switchMapName, caseValue, LOCAL_TEMPLATE_NAME$1)
            ]);
        } else {
            return null;
        }
    }
    function generateRXSwitchCaseLines(switchMapName, caseValue, template = NULL_TEMPLATE) {
        return [
            `// switch case`,
            `${ switchMapName }.set(${ caseValue }, ${ template });`
        ];
    }

    const TAG_NAME$1 = 'rx-switch-default';
    const COMMAND_NAME = '*switch-default';
    const LOCAL_TEMPLATE_NAME = 'template';
    const ATTRIBUTE_NAMES$1 = new Set([LOCAL_TEMPLATE_NAME]);
    function compileRXSwitchDefault(node, switchDefaultName) {
        const name = node.tagName.toLowerCase();
        if (name === TAG_NAME$1) {
            const attributes = extractRXAttributes(node.attributes, ATTRIBUTE_NAMES$1);
            const template = attributes.get(LOCAL_TEMPLATE_NAME);
            if (template === void 0) {
                throw new Error(`Missing attribute '${ LOCAL_TEMPLATE_NAME }'`);
            }
            if (hasChildNodes(node)) {
                throw new Error(`Should not have any children`);
            }
            return generateRXSwitchDefaultLines(switchDefaultName, template);
        } else if (hasAttribute(node, COMMAND_NAME)) {
            setAttributeValue(node, COMMAND_NAME, null);
            return scopeLines([
                ...generateLocalTemplateLinesFromRXContainerOrElement(node, LOCAL_TEMPLATE_NAME),
                ...generateRXSwitchDefaultLines(switchDefaultName, LOCAL_TEMPLATE_NAME)
            ]);
        } else {
            return null;
        }
    }
    function generateRXSwitchDefaultLines(switchDefaultName, template) {
        return [
            `// switch default`,
            `${ switchDefaultName } = ${ template };`
        ];
    }

    const TAG_NAME = 'rx-switch';
    const SWITCH_MAP_NAME = 'switchMap';
    const SWITCH_DEFAULT_NAME = 'switchDefault';
    const EXPRESSION_ATTRIBUTE_NAME = 'expression';
    const ATTRIBUTE_NAMES = new Set([EXPRESSION_ATTRIBUTE_NAME]);
    function compileRXSwitch(node) {
        const name = node.tagName.toLowerCase();
        if (name === TAG_NAME) {
            const attributes = extractRXAttributes(node.attributes, ATTRIBUTE_NAMES);
            const expression = attributes.get(EXPRESSION_ATTRIBUTE_NAME);
            if (expression === void 0) {
                throw new Error(`Missing attribute '${ EXPRESSION_ATTRIBUTE_NAME }'`);
            }
            const existingSwitchCaseValues = new Set();
            const childNodes = getChildNodes(node);
            const childLines = [];
            let switchDefaultFound = false;
            for (let i = 0, l = childNodes.length; i < l; i++) {
                const childNode = childNodes[i];
                if (isElementNode(childNode)) {
                    const result = compileRXSwitchCase(childNode, SWITCH_MAP_NAME, existingSwitchCaseValues);
                    if (result === null) {
                        const result = compileRXSwitchDefault(childNode, SWITCH_DEFAULT_NAME);
                        if (result === null) {
                            throw new Error(`Found invalid element '${ childNode.tagName.toLowerCase() }'`);
                        } else {
                            if (switchDefaultFound) {
                                throw new Error(`Switch - default already defined`);
                            } else {
                                switchDefaultFound = true;
                                childLines.push(...result);
                            }
                        }
                    } else {
                        childLines.push(...result);
                    }
                }
            }
            return generateRXSwitchLines(expression, childLines, SWITCH_MAP_NAME);
        } else {
            return null;
        }
    }
    function generateRXSwitchLines(expression, childLines, switchMapName = SWITCH_MAP_NAME, switchDefaultName = SWITCH_DEFAULT_NAME) {
        return scopeLines([
            `// reactive switch`,
            `const ${ switchMapName } = new Map();`,
            `let ${ switchDefaultName } = null;`,
            ...childLines,
            `nodeAppendChild(parentNode, createReactiveSwitchNode(${ expression }, ${ switchMapName }, ${ switchDefaultName }));`
        ]);
    }

    const DEFAULT_RX_COMPONENT_COMPILERS = [
        compileRXTemplate,
        compileRXSwitch,
        compileRXIf,
        compileRXForLoop,
        compileRXContainer,
        compileRXInjectContent,
        compileRXInjectTemplate
    ];
    const compileRXComponent = createSimpleIteratorCompiler(DEFAULT_RX_COMPONENT_COMPILERS);

    const DEFAULT_ELEMENT_COMPILERS = [
        compileRXComponent,
        compileDefaultElement
    ];
    const compileElement = createSimpleIteratorCompiler(DEFAULT_ELEMENT_COMPILERS);

    function compileDefaultNode(node) {
        switch (node.nodeType) {
        case Node.TEXT_NODE:
            return compileTextNode(node);
        case Node.COMMENT_NODE:
            return null;
        case Node.ELEMENT_NODE:
            return compileElement(node);
        default:
            return null;
        }
    }

    const DEFAULT_NODE_COMPILERS = [compileDefaultNode];
    const compileNode = createSimpleIteratorCompiler(DEFAULT_NODE_COMPILERS);

    function compileDefaultNodes(nodes) {
        const lines = [];
        for (let i = 0, l = nodes.length; i < l; i++) {
            const result = compileNode(nodes[i]);
            if (result !== null) {
                lines.push(...result);
            }
        }
        return nullIfEmptyLines(lines);
    }

    const DEFAULT_NODES_COMPILERS = [compileDefaultNodes];
    const compileNodes = createSimpleIteratorCompiler(DEFAULT_NODES_COMPILERS);

    function compileDefaultElement(node) {
        const name = node.tagName.toLowerCase();
        const lines = [
            `// element '${ name }'`,
            `const node = createElement(${ JSON.stringify(name) });`,
            `nodeAppendChild(parentNode, node);`
        ];
        const compiledAttributes = compileAttributes(Array.from(node.attributes));
        if (compiledAttributes !== null) {
            lines.push(...[
                `// attributes`,
                ...compiledAttributes
            ]);
        }
        const compiledChildren = compileNodes(getChildNodes(node));
        if (compiledChildren !== null) {
            lines.push(...scopeLines([
                `// child nodes`,
                `const parentNode = node;`,
                ...compiledChildren
            ]));
        }
        return scopeLines(lines);
    }

    function compileHTML(html) {
        const document = new DOMParser().parseFromString(html, 'text/html');
        return compileNodes(getChildNodes(document.body));
    }

    function compileHTMLAsHTMLTemplate(html, constantsToImport) {
        return generateRXTemplateFunctionLines(optionalLines(compileHTML(html)), constantsToImport);
    }

    const DEFAULT_DATA_NAME = '$';

    function compileReactiveHTMLAsComponentTemplateFunction(html, constantsToImport, dataName = DEFAULT_DATA_NAME) {
        return [
            `(${ dataName }, constantsToImport) => {`,
            ...indentLines([
                `return (`,
                ...indentLines(compileHTMLAsHTMLTemplate(html, constantsToImport)),
                `)({`,
                ...indentLines([
                    `...constantsToImport,`,
                    `${ dataName },`
                ]),
                `});`
            ]),
            `}`
        ];
    }

    async function compileReactiveHTMLAsComponentTemplateFunctionOptimized(html, constantsToImport, dataName) {
        return minifyHTML(html).then(html => {
            return compileReactiveHTMLAsComponentTemplateFunction(html, constantsToImport, dataName);
        });
    }

    // export async function compile2(
    //   html: string
    // ): Promise<string> {
    //   const templateString = `
    //     <div class="input-container">
    //       <input
    //         #input
    //         [value]="$.input.subscribe"
    //         (input)="() => $.input.emit(input.value)"
    //       >
    //     </div>
    //     <div
    //       class="max-length-container"
    //       [class.valid]="$.valid"
    //     >
    //       Length: {{ $.remaining }} / 10
    //     </div>
    //   `;
    //
    //   return compileReactiveHTMLAsComponentTemplateFunctionOptimized(
    //     templateString,
    //     generateConstantsToImportForComponentTemplateFromObject(CONSTANTS_TO_IMPORT),
    //   );
    // }
    function compile(html, constantsToImport, dataName) {
        return compileReactiveHTMLAsComponentTemplateFunctionOptimized(html, constantsToImport, dataName)
            .then((lines) => {
            return linesToString(lines);
        });
    }
    // (globalThis as any).compile = compile;

    exports.compile = compile;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
