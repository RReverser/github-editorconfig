// ==UserScript==
// @name github-editorconfig
// @include https://github.com/*
// ==/UserScript==

function $(query, context) {
    return (context || document).querySelector(query);
}

function reselect(selectQuery, newValue, insert) {
    var select = $(selectQuery), option;
    // not applicable for current page
    if (!select) {
        return;
    }
    // remove ' (auto)' in old option
    option = select.options[select.selectedIndex];
    option.textContent = option.textContent.replace(' (auto)', '');
    // set new value
    select.value = newValue;
    option = select.options[select.selectedIndex];
    // if such option doesn't exist, create it
    if (!option) {
        option = document.createElement('option');
        option.value = newValue;
        insert(option, select);
        option.selected = true;
    }
    // add ' (auto)' to editorconfig'ured option
    option.textContent += ' (auto)';
    // manually fire 'change' event on select (as it doesn't by default)
    var e = document.createEvent('HTMLEvents');
    e.initEvent('change', false, true);
    select.dispatchEvent(e);
    return option;
}

var config = {};

function setEditorConfig(newConfig) {
    config = newConfig;

    var viewer = $('.highlight');

    // set 'tab-size' CSS property
    if (viewer && config.tab_width) {
        ['tabSize', 'mozTabSize', 'oTabSize', 'webkitTabSize'].some(function (propName) {
            if (propName in this) {
                this[propName] = config.tab_width;
                return true;
            }
        }, viewer.style);
    }

    if (config.indent_style) {
        reselect('.js-code-indent-mode', config.indent_style + 's');
    }

    if (config.indent_size) {
        reselect('.js-code-indent-width', config.indent_size, function (option, select) {
            var optgroup = $('optgroup', select);
            option.textContent = option.value;

            // find place to insert new option and keep list sorted
            var options = select.options;
            for (var beforeIndex = 0; beforeIndex < options.length; beforeIndex++) {
                if (options[beforeIndex].value > option.value) {
                    break;
                }
            }
            optgroup.insertBefore(option, options[beforeIndex]);
        });
    }
}

// bind once for navigating through History API
document.addEventListener('submit', function (event) {
    if (event.target !== $('.edit-file>form')) {
        return;
    }

    var editor = $('#blob_contents');
    var text = editor.value;

    if (config.trim_trailing_whitespace) {
        text = text.replace(/\s+$/mg, '');
    }

    if (config.insert_final_newline && text.slice(-1) !== '\n') {
        text += '\n';
    }

    editor.value = text;
});

function getEditorConfig(pathname, callback) {
    var path = pathname.slice(1).split('/');

    var repo = path.slice(0, 2);
    var action = path[2]; //
    var commit = path[3]; // use branch name by default

    if (action !== 'blob' && action !== 'edit') {
        return;
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

function update() {
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
}

// use MutationObserver as we can't inject into History API
new MutationObserver(update)
.observe($('#js-repo-pjax-container'), {childList: true});

// initial "update"
update();