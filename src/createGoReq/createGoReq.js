import mount from '../mount/mount'
import axios from 'axios';
export default class CreateGlobalReq {
    constructor(reqOpts, baseOpt) {
        reqOpts.forEach(element => {
            mount(this, element);
        });
        this.baseOpt = baseOpt;
        for (let i in baseOpt) {
            if (i === 'headers') {
                for (let j in baseOpt[i]) {
                    axios.defaults[i][j] = baseOpt[i][j];
                }
                continue;
            }
            axios.defaults[i] = baseOpt[i];
        }
    }
    getData(name, callback) {
        if (callback) {
            callback(this[`${name}_data`]);
        }
        return this[`${name}_data`];
    }
    getRawData(name) {
        return this[`${name}_raw_data`]
    }
    recordReqTime(name) {
        this[`${name}_config`].reqTime++;
    }
    sendReqs(...names) {
        return new Promise((reslove, reject) => {
            let p = new Promise((res, rej) => { res(1) });
            let errArr = {};
            let resArr = {};
            let push = function (name, val) {
                if (this[name] === undefined) {
                    this[name] = val;
                } else {
                    let index = 0;
                    if(name.split('_').length > 1){
                        index = Number(name.split('_')[1]);
                        name = name.split('_')[0];
                    }
                    push.bind(this)(`${name}_${++index}`, val);
                }
            }
            resArr.push = errArr.push = push;
            let tempFunc = (name) => {
                return () => {
                    return new Promise((res, rej) => {
                        this[name]().then(() => {
                            resArr.push(name, this.getData(name));
                            res();
                        }).catch(err => {
                            errArr.push(name, err);
                            rej();
                        })
                    });
                }
            }
            for (let i in names) {
                if (this[names[i]] === undefined) {
                    throw new Error('You have no ' + i + ' request func');
                }
                let func = tempFunc(names[i]);
                p = p.then(func, func);
            }
            p.then(() => {
                reslove(resArr);
            }).catch(() => {
                reject({
                    err: errArr,
                    res: resArr,
                });
            })
        })
    }
}