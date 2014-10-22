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

function $(query, context) {
    return (context || document).querySelector(query);
}

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

function setEditorConfig(newConfig) {
    config = newConfig;

    style.textContent = !config.tab_width ? '' : '.highlight {\n' + ['', '-moz-', '-o-'].map(function (prefix) {
        return prefix + 'tab-size: ' + config.tab_width + ';\n';
    }).join('') + '}';

    if (config.indent_style) {
        reselect('.js-code-indent-mode', config.indent_style + 's');
    }

    if (config.indent_size) {
        reselect('.js-code-indent-width', config.indent_size, function (option, select) {
            var optgroup = $('optgroup', select);
            option.textContent = option.value;

            var options = select.options;
            for (var beforeIndex = 0; beforeIndex < options.length; beforeIndex++) {
                if (options[beforeIndex].value > config.indent_size) {
                    break;
                }
            }
            optgroup.insertBefore(option, options[beforeIndex]);
        });
    }
}

document.addEventListener('submit', function (event) {
    if (event.target !== $('.edit-file>form')) {
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

    editor.value = text;
});

function getEditorConfig(pathname, callback) {
    var path = pathname.slice(1).split('/');

    var repo = path.slice(0, 2);
    var action = path[2]; //
    var commit = path[3]; // use branch name by default

    if (action !== 'blob' && action !== 'edit') {
        return setEditorConfig({});
    }

    // try to find exact commit SHA on page
    var commitElement;
    if (commitElement = $('.js-permalink-shortcut')) {
        commit = commitElement.pathname.split('/')[4];
    } else if (commitElement = $('input[name="commit"]')) {
        commit = commitElement.value;
    }

    kango.invokeAsyncCallback('getEditorConfig', {
        config: repo.concat([commit, '.editorconfig']).join('/'),
        absolute: pathname,
        relative: path.slice(4).join('/')
    }, callback);
}

var lastPathName = '';

setInterval(function () {
    var newPathName = location.pathname;
    if (newPathName === lastPathName) {
        return;
    }
    lastPathName = newPathName;
    getEditorConfig(newPathName, function (config) {
        if (config.$path.absolute === location.pathname) {
            setEditorConfig(config);
        }
    });
}, 100);