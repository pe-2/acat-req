export default function transformData(data, mapper) {
    let newData = {};
    let oldPropArr = [];
    for (let i in mapper) {
        let oldPorperty = mapper[i][0];
        let newProperty = mapper[i][1];
        if (data[oldPorperty]) {
            newData[newProperty] = data[oldPorperty];
            oldPropArr.push(oldPorperty);
        }
    }
    for(let i in data){
        if(oldPropArr.indexOf(i) === -1){
            newData[i] = data[i];
        }
    }
    return newData;
}