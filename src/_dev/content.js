// ==UserScript==
// @name github-editorconfig
// @include https://github.com/*
// @include https://github.com/*
// ==/UserScript==

if (!Array.from) {
    Array.from = function (obj) {
        return Array.prototype.slice.call(obj);
    };
}

var $ = document.querySelector.bind(document);

function reselect(selectQuery, newValue, insert) {
    var select = $(selectQuery), option;
    if (!select) {
        return;
    }
    option = select.options[select.selectedIndex];
    option.textContent = option.textContent.replace(' (auto)', '');
    select.value = newValue;
    option = select.options[select.selectedIndex];
    if (!option) {
        option = document.createElement('option');
        option.value = newValue;
        insert(option, select);
        option.selected = true;
    }
    option.textContent += ' (auto)';
    var e = document.createEvent('HTMLEvents');
    e.initEvent('change', false, true);
    select.dispatchEvent(e);
    return option;
}

var config = {};

var style = document.createElement('style');
document.head.appendChild(style);

window.setEditorConfig = function (newConfig) {
    config = newConfig;

    style.textContent = !config.tab_width ? '' : '.highlight {\n' + ['', '-moz-', '-o-'].map(function (prefix) {
        return prefix + 'tab-size: ' + config.tab_width + ';\n';
    }).join('') + '}';

    if (config.indent_style) {
        reselect('.js-code-indent-mode', config.indent_style + 's');
    }

    if (config.indent_size) {
        reselect('.js-code-indent-width', config.indent_size, function (option, select) {
            option.textContent = option.value;

            var options = select.options;
            for (var beforeIndex = 0; beforeIndex < options.length; beforeIndex++) {
                if (options[beforeIndex].value > config.indent_size) {
                    break;
                }
            }
            select.insertBefore(option, options[beforeIndex]);
        });
    }
};

document.addEventListener('submit', function (event) {
    var form = $('.edit-file>form');

    if (event.target !== form) {
        return;
    }

    var editor = $('#blob_contents');
    var text = editor.value;

    if (config.trim_trailing_whitespace) {
        text = text.replace(/\s+$/mg, '');
    }

    if (config.insert_final_newline) {
        var newLine = aceSession.getDocument().getNewLineCharacter();
        if (text.slice(-newLine.length) !== newLine) {
            text += newLine;
        }
    }

    debugger;
    editor.value = text;
});

function getEditorConfig(pathname, callback) {
    var path = pathname.slice(1).split('/');
    if (path[2] !== 'blob' && path[2] !== 'edit') {
        return setEditorConfig({});
    }
    var branch = path[3];
    kango.invokeAsyncCallback('getEditorConfig', {
        config: path.slice(0, 2).concat([branch, '.editorconfig']).join('/'),
        absolute: pathname,
        relative: path.slice(4).join('/')
    }, callback);
}

var lastPathName = '';

(function update() {
    var newPathName = location.pathname;
    if (newPathName !== lastPathName) {
        lastPathName = newPathName;
        getEditorConfig(newPathName, function (config) {
            if (config.$path.absolute === location.pathname) {
                setEditorConfig(config);
            }
        });
    }
    window.setTimeout(update, 500);
})();