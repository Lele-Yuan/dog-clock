const express = require('express');
const app = express();
const path = require('path');
app.use(express.static('dist')); //监控静态资源

app.get('/latest.yml', function (req, res) {
	res.setHeader('Content-Type', 'text/yaml');

    // 发送 YML 文件
    const ymlFilePath = path.join(path.join(__dirname, 'dist'), 'latest-mac.yml'); // 确保 latest.yml 文件存在
    res.sendFile(ymlFilePath);
});
app.listen(8060, () => {
    console.log('loaclhost:8060')
})