## 浏览器相关
### 一、认识浏览器运行态下的JS
#### 包含：BOM、DOM、ECMAScript
```js
    (function(conext, undefined) {
        const _class = ['js', 'browser', 'vue'];

        // 1. 向全局作用域中存储一个class变量
        window.classArr = _class.map(item => item);

        // 2. 获取当前页面地址
        const _url = location.href;

        // 3. 改变页面标题
        document.title = 'zhaowa class';

        // 4. 获取渲染节点
        document.getElementById('app');
    })(this)

    // 简述：
    // ECMAScript - 处理了基础逻辑、数据处理
    // BOM - 对浏览器本身功能区域的汇总处理
    // DOM - 对浏览器视窗内的HTML文本的相关操作
```

### 二、BOM
#### 1. location
location.href  -> 'https://www.zhaowa.com/search?class=browser#comments'
        .origin -> 'https://www.zhaowa.com'
        .protocol -> 'https:'
        .host    -> 'www.zhaowa.com'
        .port   -> ''
        .pathname -> '/search/'
        .search  -> '?class=browser'
        .hash   -> '#comments'  // SPA \ iframe

location.assign('${url}')  // 跳转到指定path，替换pathname
        .replace('${url}')  // 效果同assign，同时替换掉浏览历史
        .reload()
        .toString() // 产出当前地址=>字符串

* 面试场景：
手写拆解路径题目
* 面试方向：
1. location本身的api操作
2. 路由相关：跳转、参数、操作 => 场景题：可返回、是否可刷新 => 框架
3. url处理 - 手写处理 & 正则

#### 2.history
history.state -> 存储当前页面状态

history.pushState() // 跳转到指定状态页上
        .replaceState() // 替换当前状态

* 面试方向 - 路由方向history和hash模式的利弊分析 => 两种路由方式的考察 | 路径与浏览器渲染机制的联系

#### 3. navigator
* 浏览器信息大集合
```js
navigator.userAgent // 获取当前用户环境信息
```

* 面试方向
1. UA读取信息 => 浏览器兼容性
2. 剪切板 & 键盘操作 => 登录 or 验证码
3. 环境 => 微信 => unionId appid

#### 4. screen
表示显示区域 - 屏幕

* 面试方向 - 判断区域大小、方位
window 视窗判断：
全局入口处
window.innerHeight
window.innerWidth

文本处获取
document.documentElement.clientHeight(/width)
document.body.clientHeight(/width)

网页的size -> offsetHeight = clientHeight + 滚动条 + 边框
document.documentElement.offsetHeight(/offsetWidth)
document.body.offsetHeight(/width)

定位：
scrollLeft / scrollTop - 距离常规左上滚动的距离
offsetLeft / offsetTop - 距离常规左上相对距离

el.getBoundingClientRect()
    .top .left .bottom .right
* 兼容性问题 - IE 会多出2px

### 三、Event 事件模型
```js
    <div id="app">
        <p id="dom">Click</p>
    </div>

    // 冒泡 - ms: p -> div -> body -> HTML -> document
    // 捕获 - ns: document -> HTMl -> body -> div -> p

    el.addEventListener(event, function, useCapture); // useCapture - false

    // 追问:
    // 1. 如何阻止事件的传播
    event.stopPropagation();
    // 注意：无论向上还是向下都是可以阻止的 => 无法阻止默认事件的发生 - a标签跳转

    // 2. 如何阻止默认事件传播
    event.preventDefault();

    // 3. 相同节点绑定多个同类事件，如何阻止
    event.stopImmediatePropagation();
    // 追问 => 样式上 & 性能上

    // 4. 手写事件绑定
    // attachEvent & addEventListener
    // 区别
    // a. 传参 attachEvent对于事件名加上'on'
    // b. 执行顺序，attachEvent - 后绑定先执行；addEventListener - 先绑定先执行
    // c. 解绑 detachEvent vs removeEventListener
    // d. 阻断 e.cancelBubble = true  vs e.stopPropagation()
    // e. 默认事件打断 e.returnValue vs e.preventDefault

    class bindEvent {
        constructor(element) {
            this.element = element;
        }

        addEventListener = (type, handler) => {
            if (this.element.addEventListener) {
                this.element.addEventListener(type, handler, false);
            } else if (this.element.attachEvent) {
                const element = this.element;
                this.element.attachEvent('on' + type, () => {
                    handler.call(element);
                });
            } else {
                this.element['on' + type] = handler;
            }
        }

        removeEventListener = (type, handler) => {
            if (this.element.removeEventListener) {
                this.element.removeEventListener(type, handler, false);
            } else if (this.element.detachEvent) {
                const element = this.element;
                this.element.detachEvent('on' + type, handler);
            } else {
                this.element['on' + type] = null;
            }
        }

        static stopPropagation(e) {
            if(e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        }

        static preventDefault(e) {
            if(e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = true;
            }
        }
    }

    // 5. 性能优化 - 事件代理
    <ul class="list">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
    </ul>
    <div class="content"></div>

    var list = document.querySelector(".list");
    var li = list.getElementsByTagName("li");
    var content = document.querySelector(".content");

    // 硬碰硬
    for(var n = 0; n > li.length; n++) {
        li[n].addEventListener("click", function() {
            // cb业务逻辑
        })
    }

    // 代理后 - 利用了冒泡
    function onClick(e) {
        var e = e || window.event;
        if (e.target.nodeName.toLowerCase() === "li") {
            const liList = this.querySelectorAll("li");
            index = Array.prototype.indexOf.call(liList, target);
        }
    }

    list.addEventListener("click", onClick, false);
```

### 四、网络层
```js
    // 实例化
    const xhr = new XMLHttpRequest();

    // 初始化连接
    // xhr 有一个open方法
    // open - 5个参数 => method - get / post; url - 请求的地址; async - 是否异步请求
    xhr.open(method, url, async);

    // send发送请求
    // 内容：post - 将请求体的参数传入；get - 可以不传 or 传入null
    xhr.send(data)

    // 接收
    xhr.readyStatus
    0 - 尚未调用open
    1 - 已调用open
    2 - 已发送请求（已调用send
    3 - 已接收到请求返回的数据
    4 - 请求已完成
    xhr.onreadystatuschange = () => {
        if (xhr.readyStatus === 4) {
            if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                console.log('请求成功', xhr.responseText)；
            }
        }
    }

    // 设置超时时间
    xhr.timeout = 1000;

    xhr.ontimeout = () => console.log('请求超时');

    // 封装
    ajax({
        url: 'reqUrl',
        method: 'get',
        async: true,
        timeout: 30000,
        data: {
            payload: 'text'
        }
    }).then(
        res => console.log('成功' + res),
        err => console.log('失败' + err)
    )

    // 实现
    function ajax(options) {
        const {
            url,
            method,
            async,
            timeout,
            data
        } = options;

        const xhr = new XMLHttpRequest();

        if (timeout && timeout > 0) {
            xhr.timeout = timeout;
        }

        return new Promise((resolve, reject) => {

            // 1. 阶段状态处理
            // 成功
            xhr.onreadystatechange = () => {
                if (xhr.readyStatus === 4) {
                    if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                        resolve && resolve(xhr.responseText);
                    } else {
                        reject && reject();
                    }
                }
            }

            // 失败
            xhr.ontimeout = () => reject && reject('超时');
            xhr.onerror = () => reject && reject(err);

            // 2. 传参处理
            let _params = [];
            let encodeData;

            if (data instanceof Object) {
                for (let key in data) {
                    // 参数拼接
                    _params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
                }
                encodeData = _params.join('&');
            }

            // get类型处理
            if(method === 'get') {
                const index = url.indexOf('?');
                if (index === -1) url += '?';
                else if (index !== url.length - 1) url += '&';
                url += encodeData;
            }

            // 3. 初始化连接
            xhr.open(method, url, async);

            // 4. 发送
            if (method === 'get') {
                xhr.send(null);
            } else {
                xhr.setRequestHeader(
                    'Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8'
                )
                xhr.send(encodeData);
            }
        }) 
    }
```
