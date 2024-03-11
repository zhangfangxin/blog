## 性能优化
### 一、回到那道面试题
* 输入
URL：资源定位符
```js
    // http:www.zhaowa.com - http协议
    // 面试： http & TCP - (TCP/IP) => 计算机网络
    // 1. http - 应用层 < = > TCP - 传输层

    // 2. 关联：http基于TCP实现连接 => 追问：TCP连接特性（请求、发送、断开）=> debug过程中 连接挂了
    //  http1.0 1.1 2.0
    // => keep-alive - 保持的是TCP的连接状态 - 不用反复建立连接
    // => 多条并发复用同一条通路 -  避免chrome最大六条TCP连接限制 - 复用通路，无并发限制
    // => UDP vs TCP

    // 3. 状态：http - 无状态 < = > TCP - 有状态
    // 优化点：
    // => socket连接，socket并不是链接，而是一个封装化的TCP，方便应用更加方便使用调用

    // https:www.zhaowa.com - https协议
    // 追问：http & https
    // 1. https = http + SSL(TLS) => 位于TCP与传输应用协议之间
    // 2. 实现原理
    // 3. HTTPS多次链接：导致网络请求加载时间延长；增加开销和功耗
    // => 合并请求 + 长连接 => 二维码已过期
    // => 中间层 整合请求 => 异常处理
```

* 域名解析
```js
    // 1. 浏览器缓存 - 浏览器中会缓存DNS
    // 2. 系统缓存 - 操作系统会在系统中做一些 => 改HOST
    // 3. 路由器缓存 - 各级路由器上
    // 4. 运营商的各级缓存 => traceRoute
    // 5. 根域名服务器
        // 优化：
        // => CDN - Content Delivery Network
        // 1. 为同一个主机配置多个IP地址
        // 2. 就近就快
        // 3. LB - 负载均衡

        // => 缓存 => 各级缓存 => CDN => 浏览器
```

* web服务器
```js
    // apache、nginx
    // 1. 接收请求 => 传递给服务端的代码
    // 2. 反向代理 => 传递给其他服务器
    // 3. 不同域名 => 指向相同ip的服务器 => nginx域名解析 => 引导到不同的服务监听端口

    // nginx => 跨域头
```

### 前端网络优化
* 手写并发控制 - QPS-limit
```js
    // 面试：并发优化  10个请求，由于后台性能所限或者业务需求只能同时执行n个
    // 分析：
    // 输入：max参数
    // 存储：taskQue
    // 内容：执行 - run | 创建任务 - createTask
    // 唯一性 => 单例模式
    class LimitPromise {
        constructor(max) {
            // 异步任务的并发上限
            this._max = max || 6;
            // 当前正在执行任务的数量
            this._count = 0;
            // 等待执行的任务队列
            this._taskQueue = [];
            // 单例模式复用
            this.instance = null;
        }

        run(caller) {
            // 主入口
            // 输入：外部传入要添加的请求
            // 输出：返回队列处理的promise
            return new Promise((resolve, reject) => {
                // 创建一个处理任务
                const task = this._createTask(caller, resolve, reject);

                // 当前队列任务数量是否达到上限
                if (this._count >= this._max) {
                    this._taskQueue.push(task);
                } else {
                    task();
                }
            })
        }

        _createTask(caller, resolve, reject) {
            return () => {
                caller().then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                }).finally(() => {
                    this._count--;
                    if (this._taskQueue.length) {
                        // 完成任务清出
                        const task = this._taskQueue.shift();
                        task();
                    }
                })
                this._count++;
            }
        }

        // 单例
        static getInstance(max) {
            if (!this.instance) {
                this.instance = new LimitPromise(max);
            }
            return this.instance;
        }
    }
```

### 浏览器在渲染时
* 浏览器的执行顺序
主线：HTML => DOM + CSSOM => renderTree + js => layout => paint
面试：
repaint - 改变文本、颜色改变
reflow - 元素个数、几何尺寸发生了变化
=> 优化点：减少repaint、避免reflow
=> display: none => reflow; visibility: hidden => repaint;

### 脚本执行层面 - JS
mark & sweep => 触达标记，锁定清空、未触达的直接抹掉
```js
    const zhaowa = {
        js: {
            performance: 'good',
            teacher: '云隐'
        }
    };

    // 建立引用关系
    const _obj = zhaowa;

    // 引用源替换 - 暂未gc
    zhaowa = 'best';

    // 深入层级做引用 - 暂未gc
    const _class = _obj.js;

    // 引用方替换 - 暂未gc
    _obj = 'over';

    // 触发gc完成
    _class = null;

    // 内存泄露 - 避免莫名其妙的全局变量
    function foo() {
        bar1 = '';
        this.bar2 = '';
    }

    // 未清理的定时器
    setInterval(() => {

    }, 1000)

    // 使用后的闭包 - 及时清理
    function zhaowa() {
        const _no = 1;
        return {
            number: _no
        }
    }
```
