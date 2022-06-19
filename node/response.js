// 引入系统模块http
const http = require('http');
// 创建web服务器
const app = http.createServer();
const url = require("url");
const Buffer = require('buffer');

// 用request添加服务器请求事件
app.on('request', (req, res) => {
    // 获取到url
    let urlParseObj = url.parse(req.url)

    //设置跨域
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    console.log(req.url);
    // if (req.url === '/banana') {
    //     console.log(req.url);
    //     res.writeHead(404);
    //     res.end();
    //     return;
    // }
    res.writeHead(200, {
        'content-type': 'application/json'
    })
    //获取请求体中的内容

    function getBody() {
        let data = [];
        return new Promise((reslove, reject) => {
            req.on('data', chunk => {
                data.push(chunk)  // 将接收到的数据暂时保存起来
            })

            req.on('end', () => {
                if (data.length) {
                    reslove(JSON.parse(data));
                } else {
                    reject({ err: 'no data' });
                }
            })
        })
    }

    getBody().then(body => {
        let { query, href } = urlParseObj;
        let { headers } = req;
        let backData = {
            href, query, body, headers
        }
        res.end(JSON.stringify(backData));
    }).catch(
        err => {
            let { query, href } = urlParseObj;
            let { headers } = req;
            res.end(JSON.stringify({ href, query, headers, data: err }));
        }
    )

})
app.listen(8000);
console.log('网站服务器启动成功');

