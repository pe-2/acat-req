# 请求交互框架 ACAT-REQ
## 介绍
  ### 这是一个可以将请求交互逻辑和视图层分开的工具，当你的交互配置和视图层混在一起的时候，这还不是最严重的，当后台接口发生变动的时候，你就得一个一个去找自己那些请求都写在了哪里。
  ### 最后无奈，只能向屎山屈服
## 快速开始
### 安装
```
  npm i acat-req 
```
### 展示代码
请求层 requests.js 所有请求的配置都在这里
```
  import acatReq from 'acat-req'
  
  const reqOpts = [
    {
      url: 'apple',
      name: 'apple',
    }
  ];
  
   const baseOpt = { 
    baseURL: 'http://127.0.0.1', 
  }
  
  let acat = acatReq(reqOpts, baseOpt);
  
  export default acat;
 ```
 视图层 以react为例 单个请求发送实例
 ```
  import acat form 'requests.js'
  
  export default function Ele(){
      let [apple,setApple] = useState();
      
      let getApple = ()=>{
        acat.apple().then(()=>{
          acat.getData('apple',setApple);
        })
      }
      
      return (
        <div onClick>{apple}</div>
      )
  }
 在点击该组件div时就会发送请求并且将响应数据挂在state上
```
### 概念图
![acat_png](https://user-images.githubusercontent.com/80669557/174471480-551afe54-2e45-4d35-aefd-7789ee793c7d.png)

### 使用第一步

  #### 引入的全局方法名为acatReq, 调用会返回一个对象，返回的对象身上包含所有请求配置对应的请求方法。所有请求方法都基于axios
  该方法需要传入两个参数，第一个是请求配置列表，第二个基础默认配置比如默认基础路径、请求头等等。
  <br/>发送请求是基于axios，所以这些配置也是要和axios保持一致。
```
  //引入方法
  import acatReq from 'acat-req'
  
  //编辑接口配置列表
  const reqOpts = [
    {
      url: 'apple',
      name: 'apple',
    },
    {
      url: 'banana',
      name: 'banana',
    },
    {
      url: 'cat',
      name: 'cat',
    },
  ];
  
  //默认配置
  const baseOpt = {
    baseURL: 'http://127.0.0.1', 
  }
  
  export default acatReq(reqOpts, baseOpt);
```

### 使用第二部：拿到对象，咔咔咔渲染

#### 引入对象

```
  // acat 便是 acatReq返回的对象
  import acat from 'requets.js'
```

#### 发送单个请求,是以 对象.接口名()发送，这样就发送了一个请求
```
  acat.apple()
```

#### 关于拿到响应数据: apple 方法返回了一个promise,可不是resData哦
#### acat 身上有个方法叫 getData,第一个参数是接口名, 在发送请求后调用，便会获得响应数据。
```
  acat.apple().then(
    ()=>{
      acat.getData('apple')    // resData
    }
  )
```

#### 将数据挂载到状态上：getData的第二个参数是一个回调函数，该回调函数只有一个参数便是响应数据

#### 现在以 react 为例，展示如何将数据挂载到state上
```
let [apple,setApple] = useState();

acat.apple().then(
  ()=>{
    acat.getData('apple',setApple);
  }
)
//这样在请求发送成功之后便会将请求数据挂载在state上了
//vue就更简单了，直接传个赋值函数进去就可以了 🤤
```

#### 在页面一开始加载的时候就发送请求
```
  acat.sendReqs('apple','banana');
  这样就同步发送了两个请求
```

#### 拿到继发请求响应数据组
```
  acat.sendRes('apple','banana').then(
    resArr =>{
      console.log(resArr);
      //具体resArr长什么样，你打印了就知道了
    }
  ).catch(
    arr =>{
      console.log(arr);
    }
  )
```


