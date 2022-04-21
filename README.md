# requestAll

#### 介绍
一个函数完成页面所有的请求？

#### 软件架构

通过对封装的ajax函数进行promise链式调用来实现一次性执行所有刚进页面就需要发送的请求

通过事件触发的函数会返回一个可以用@[EventName]绑定

可以通过设置目标数据data的名字来直接将请求到的数据存放到vueComponet的data里

#### 安装教程

git clone https://gitee.com/pw-1/request-all.git

克隆之后本地仓库中会有一个request.js为目标文件

#### 使用说明

1. 引入文件

   ```vue
   <script>
   		import request from 'request.js'//使用具体的路径
       //request 是一个对象，有四个属性，分别是 MyHeaders,AjaxOpt,ajax,requestAll
     
       //MyHeaders 请求体的headers的类 用来设置默认的请求头 
       //比如 MyHeaders.prototype['Content-Type'] = 'Application/json'
     
       //AjaxOpt 是请求参数的默认类，可以用来设置默认的基础路径 
       //比如 AjaxOpt.prototype.baseUrl = 'http://localhost:8080'
     
       //ajax 一个封装好的交互函数 传入交互的参数就可以发送请求，
     	//该函数返回一个promise对象，可以通过then方法设置交互成功之后的逻辑
     
       //requestAll 是本次的明星函数，可以实现只调用一次就完成所有请求的发送或绑定
   	</script>
   ```

2. requestAll的使用

   ```vue
   <script>
     import request from 'request.js'
     
     request.MyHeaders.prototype['Content-Type'] = 'Application/json';//设置Content-Type，必须两个单词首字母都大写
     request.MyHeaders.prototype['token'] = "123123dsasdasdasd";//设置token
     request.AjaxOpt.prototype.baseUrl = "http://localhost:3000/";//基础路径的设置
     
     export default {
       name:"xxx",
       method:{
         requestAll:request.requestAll,
       },
       data:{
   			requests:[//所有交互请求的配置参数
           {
             url:'a', //测试接口a ，控制台打印请求结果
           },
           {
             url:'b',
             targetData:'now', // 直接请求接口 b，将拿到的请求结果 res的now 属性放到 data里的now上
           },
           {
             url:'d',
             targetData:'ok',
             delay:true, //会返回一个func函数绑定到本对象上，想要调用该函数直接 this.requests[2].func()
             //该函数会将请求到的结果放到下面的ok上 也是 res里的ok属性被拿到下面
           },
         ],
         //之后用户的自定义数据
         now:'',//目标属性now
         ok:'',
       },
       mounted(){
         this.requestAll(requests,this);//开启所有请求
       }
     }
   </script>
   ```

   

   3.requests配置项详解

   ```js
    {
             url:'',//必选 接口的路径
             method:'',//可选，默认get
             data:{}, //可选，发送的数据 请求体中的数据
             parmas:{},//可选，路径中的数据
             headers:{}, //单独设置header, 针对传文件之类的特别请求
             targetData:'', //存放请求结果到的目标数据 vm 的 data 里的属性名
             delay:true,	 //是否延迟执行这个请求，设置之后在此对象绑定发送该请求的函数
             successHandler:(res)=>{},//成功请求后调用的函数，默认打印请求结果
             failHandler:(err)=>{},// 失败后调用的函数，末日打印 err
    }
   ```
   
   

