const express = require('express');
const app = express();
app.use(express.static('dist')); //监控静态资源
app.listen(8060, () => {
    console.log('loaclhost:8060')
})