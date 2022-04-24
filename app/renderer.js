const marked = require('marked');
const { ipcRenderer } = require('electron');

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

const renderMarkdownToHtml = (markdown) => {
    htmlView.innerHTML = marked.parse(markdown);
};

markdownView.addEventListener('keyup', (event) => {
    const currentContent = event.target.value;
    renderMarkdownToHtml(currentContent);
});

openFileButton.addEventListener('click', async() => {
    const { file, content } = await ipcRenderer.invoke('dialog:openFile')
    markdownView.value = content;
    renderMarkdownToHtml(content);
});

newFileButton.addEventListener('click', () => {
    ipcRenderer.invoke('dialog:createWindow');
});