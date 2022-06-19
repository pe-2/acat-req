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
    getData(name) {
        return this[`${name}_data`];
    }
    getRawData(name){
        return this[`${name}_raw_data`]
    }
    recordReqTime(name){
        this[`${name}_config`].reqTime ++;
    }
}