github-editorconfig
===================

EditorConfig support for GitHub

This extension provides [EditorConfig](http://editorconfig.org/) support for GitHub.

It looks for [`.editorconfig`](http://editorconfig.org/#example-file) file in the root of repository the current file belongs to, and applies it's settings to code viewer and editor. Branch is always taken into account.

You can also set [default editorconfig](src/common/res/default.editorconfig) that will be used for repos without custom one.
