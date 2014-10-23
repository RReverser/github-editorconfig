github-editorconfig
===================

This is a browser extension that provides [EditorConfig](http://editorconfig.org/) support for GitHub.

It looks for [`.editorconfig`](http://editorconfig.org/#example-file) file in the root of repository the current file belongs to, and applies it's settings to code viewer and editor. Branch is always taken into account.

In options you can also set [default editorconfig](src/common/res/default.editorconfig) that will be used for repos without custom one.

It's built with [Kango - cross-browser extension framework](http://kangoextensions.com/).

Download links
--------------

You can download extension for your browser from the corresponding store:

* [Chrome](https://chrome.google.com/webstore/detail/github-editorconfig/bppnolhdpdfmmpeefopdbpmabdpoefjh)
* [Firefox](https://addons.mozilla.org/en-US/firefox/addon/github-editorconfig/)
* Opera - *under review* (for now you can use [this addon](addons.opera.com/en/extensions/details/download-chrome-extension-9/) to install from Chrome store)

Screenshots
-----------

Sample .editorconfig:
![Sample .editorconfig](https://cloud.githubusercontent.com/assets/557590/4751070/01e62090-5a9a-11e4-96e8-85d0d1e3c79e.png)

Code viewer (tabs are set to preconfigured width of 4 instead of GitHub's default 8):
![Code viewer](https://cloud.githubusercontent.com/assets/557590/4751072/01e6e6e2-5a9a-11e4-862d-53b65d109958.png)

Code editor (preconfigured options are chosen and marked as **(auto)**; `trim_trailing_whitespace` and `insert_final_newline` are taken into account on commit):
![Code editor](https://cloud.githubusercontent.com/assets/557590/4751069/01e2c918-5a9a-11e4-83fe-be49db527d28.png)

Options page (just a default `.editorconfig` for repos without custom one):
![Options page (default editorconfig)](https://cloud.githubusercontent.com/assets/557590/4751071/01e66b9a-5a9a-11e4-91f3-36800fbc8466.png)
