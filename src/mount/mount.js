import axios from "axios";
import transformData from "../transD/transD";
export default function mount(target, reqOpt) {
    const { name } = reqOpt;
    if (name === undefined) {
        throw new Error('reqOpt must has a name property');
    }
    if (target[name] !== undefined) {
        throw new Error('reqOpt name should not be same');
    }
    target[name] = function (moreOpt) {
        for (let i in moreOpt) { //moreOpt 只建议写 data 和 parmas
            if (i !== 'data' && i !== 'params') {
                console.warn(`property ${i} is s not recommended to write in this parameter`);
            }
        }
        return axios(Object.assign(reqOpt, moreOpt)).then(res => {
            target.recordReqTime(name);
            let { data } = res;
            let { mapper } = reqOpt;
            if (reqOpt.mapper) {
                target[`${name}_data`] = transformData(data, mapper);
                target[`${name}_raw_data`] = data;
                return;
            }
            target[`${name}_data`] = data;
        })
    }
    target[`${name}_config`] = Object.assign(reqOpt, { reqTime: 0 });

    //添加了一行新的注释
}