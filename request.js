class AjaxOpt { //给交互配置赋予一些默认的属性值
    constructor(opt) {
        let {
            method,
            url,
            data,
            headers,
            successHandler,
            failHandler,
            delay,
            targetData,
            parmas,
        } =
        opt;

        let res = {
            method: method ? method : 'get',
            path: this.baseUrl + url,
            data: data ? data : null,
            headers,
            successHandler: successHandler ? successHandler : (res) => {
                console.log(res)
            },
            failHandler: failHandler ? failHandler : (rej) => {
                console.log(rej)
            },
            delay,
            targetData,
        }
        let parmaStr = '';
        for (let i in parmas) {
            parmaStr += `${i}=${parmas[i]}`
            if (i !== parmas.length - 1) {
                parmaStr += '&';
            }
        }
        parmaStr = parmaStr.slice(0, parmaStr.length - 1);
        if (parmas !== undefined) {
            res.path += `?${parmaStr}`;
        }
        for (let i in res) {
            this[i] = res[i];
        }
    }
}
class MyHeaders {
    constructor(headers) {
        for (let i in headers) {
            this[i] = headers[i];
        }
    }
}

function ajax(option) { //主要来进行交互的函数
    let {
        method, //默认为get
        path,
        data,
        headers,
    } = option;
    return new Promise((res, rej) => {
        let xml = new XMLHttpRequest();
        xml.onreadystatechange = function() {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                if (this.responseText[0] === '{') {
                    res(JSON.parse(this.responseText));
                }
                res(this.responseText);
            } else {
                return rej(this.responseText);
            }
        }
        xml.open(method, path);
        for (let i in headers) {
            xml.setRequestHeader(i, headers[i]);
        }
        if (headers['Content-Type'].includes('json')) {
            data = JSON.stringify(data);
        }
        xml.send(data);
    })
}

//开始封装函数
function requestAll(reqOpts, vueC) {

    reqOpts = reqOpts.map((val) => {
        val.headers = new MyHeaders(val.headers);
        return new AjaxOpt(val);
    })
    console.log(reqOpts);
    let delayReq = reqOpts.filter((val) => {
        return val.delay !== undefined
    })
    delayReq.forEach((element, j) => {
        let index;
        for (let i in vueC.requests) {
            if (i == j) {
                index = i;
                break;
            }
        }
        vueC.$set(vueC.requests, index, {
            func(data, parmas) {
                if (data) {
                    element.data = data;
                }
                if (parmas) {
                    let parmaStr = '';
                    for (let i in parmas) {
                        parmaStr += `${i}=${parmas[i]}`
                        if (i !== parmas.length - 1) {
                            parmaStr += '&';
                        }
                    }
                    parmaStr = parmaStr.slice(0, parmaStr.length - 1);
                    if (parmas !== undefined) {
                        element.path += `?${parmaStr}`;
                    }
                }
                let p = ajax(element);
                if (element.targetData) {
                    p.then((res) => {
                        console.log(res)
                        vueC[element.targetData] = res[element.targetData];
                        vueC.$set(vueC, element.targetData, res[element.targetData])
                    }).catch((err) => {
                        console.log(err);
                    })
                }
                return p;
            },
            ...element,
        })
    });

    reqOpts = reqOpts.filter((val) => {
        if (val.targetData) {
            val.successHandler = (res) => {
                vueC.$set(vueC, val.targetData, res[val.targetData]);
            }
        }
        return val.delay === undefined;
    })


    let func = (i) => {
        return new Promise((reslove, reject) => {
            ajax(reqOpts[i]).then((res) => {
                reqOpts[i].successHandler(res);
                reslove();
            }).catch((rej) => {
                reqOpts[i].failHandler(rej);
                reject();
            })
        });
    }

    let p = func(0)
    for (let i = 1; i < reqOpts.length; i++) {
        p = p.then(
            () => {
                return func(i);
            },
            () => {
                return func(i);
            }
        )
    }
}

export default {
    MyHeaders,
    AjaxOpt,
    ajax,
    requestAll,
}