// build-markdown.js
const fs = require('fs');
const path = require('path');
const marked = require('marked').marked

const markdownDir = path.join(__dirname, '', 'markdown');
const outputDir = path.join(__dirname, '', 'generated');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// 读取 Markdown 目录中的所有文件
const markdownFiles = fs.readdirSync(markdownDir);

markdownFiles.forEach(file => {
    const filePath = path.join(markdownDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const html = marked(fileContents);
    // 压缩 HTML: 移除多余的空格和换行符
    const minifiedHtml = html.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
    const outputFilePath = path.join(outputDir, file.replace('.md', '.html'));
    fs.writeFileSync(outputFilePath, minifiedHtml);
});
