## JS模块化
### 1. 不得不说的历史
#### 背景
JS本身定位：简单的页面设计 - 页面动画 + 基本的表单提交
并无模块化 or 命名空间的概念

> JS的模块化需求日益增长

#### 幼年期：无模块化（委婉的辩解）
1. 开始需要在页面加载不同的js了：动画库、表单库、格式化工具
2. 多种js文件被分在不同的文件中
3. 不同的文件又被同一个模板所引用

```js
    // test.html
    <script src="jquery.js"></script>
    <script src="tools.js"></script>
    <script src="main.js"></script>
```
认可：
文件分离是最基础的模块化，第一步

* 追问：
script标签两个参数 - async & defer
```js
    <script src="jquery.js" type="text/javascript" async></script>
```
总结：
普通 - 解析到标签，立刻pending，并且下载且执行
defer - 解析到标签开始异步下载，继续解析完成后开始执行
async - 解析到标签开始异步下载，下载完成之后立刻执行并且阻塞解析，执行完成后，再继续解析

1. 兼容性 => IE9 + 兼容程度不同
2. 问题方向 => 浏览器渲染原理、同步异步原理、模块化加载原理

问题出现：
* 污染全局作用域 => 不利于大型项目的开发以及多人团队共建

#### 成长期：模块化的雏形 - IIFE(语法侧的优化)
##### 作用域的把控
栗子：
```js
    // 全局变量
    let count = 0;

    // 代码块1
    const increase = () => ++count;
    // 代码块2
    const reset = () => {
        count = 0;
    }

    increase();
    reset();
```

利用函数块级作用域
```js
    (() => {
        let count = 0;
        //……
    })();
```
定义函数 + 立即执行 => 独立的空间
初步实现了一个最最最最最最最简单的模块

尝试定义一个最简单的模块 - 模块 and 外部
```js
    // iifemodule
    const module = (() => {
        let count = 0;
        return {
            increase: () => ++count;
            reset: () => {
                count = 0;
            }
        }
    })();

    module.increase();
    module.reset();
```

** 追问：有额外依赖的时候，如何优化处理IIFE **
> 优化1：依赖其他的IIFE
```js
    const iifeModule = ((dependecyModule1, dependecyModule2) => {
        let count = 0;
        // dependecyModule……
        return {
            increase: () => ++count;
            reset: () => {
                count = 0;
            }
        }
    })(dependecyModule1, dependecyModule2);
```

> 追问2：了解早期jQuery依赖处理/模块加载的方案么？ / 了解传统IIFE是如何解决多方依赖的问题么？
IIFE + 传参调配

实际上，传统框架应用了一种revealing的写法
揭示模式
```js
    const iifeModule = ((dependencyModule1, dependencyModule2) => {
        let count = 0;
        const increase = () => ++count;
        const reset = val => {
            count = 0;
            // dependencyModule
        }

        return {
            increase,
            reset
        }
    })(dependencyModule1, dependencyModule2);
    iifeModule.increse(1);
    iifeModule.reset();
    // 返回的是能力 = 使用方传参 + 本身逻辑能力 + 依赖能里
    // $('').attr('title', 'new');
```

* 追问：
面试中后续引导的方向：
1. 深入模块化实现 2. 转向框架：jquery、vue、react的模块化实现的细节，以及框架的特征原理 3. 转向设计模式 - 注重模块化的设计模式

#### 成熟期
##### CJS - Commonjs
> node.js指定的标准
特征:
* 通过module + export 去对外暴露接口
* 通过require去调用其他模块

模块组织方式：
dep.js
```js
    // 引入部分
    const dependecyModule1 = require(./dependecyModule1);
    const dependecyModule2 = require(./dependecyModule2);

    // 核心逻辑
    let count = 0;
    const increase = () => ++count;
    const reset = val => {
        // …… 
    }

    // 暴露接口部分
    export.increase = increase;
    export.reset = reset;

    module.exports = {
        increase,
        reset
    }
```

```js
    const { increase, reset } = require('dep.js');

    increase();
    reset();
```

** 可能会被问到的问题 ** 
实际执行处理
```js
    (function(thisValue, export, module) {
        const dependecyModule1 = require(./dependecyModule1);
        const dependecyModule2 = require(./dependecyModule2); 
        // 业务逻辑
    }).call(thisValue, exports, require, module)

    // 部分开源项目分别传入全局、指针、框架做参数
    (function(window, $, undefined) {
        const _show = function () {}
    })(window, jQuery);
    // window - 1. 全局作用域改成了局部作用域，执行的时候不用全局调用，提升效率 2. 编译时候优化压缩 (function(c){}(window))
    // jQuery - 1. 独立进行改动挂载，保障稳定 2. 防止全局污染
    // undefined - 1. 防止重写
```
> * 优点：
CJS服务侧角度解决了依赖全局污染的问题
> * 缺憾：
针对服务端

新的问题 - 异步依赖

#### AMD
> 通过异步加载 + 允许定制回调函数
经典实现框架: require.js

新增定义方式:
```js
    // 通过define来定义一个模块，然后用require去加载
    define(id, [depends], callback);
    require([module], callback);
```

```js
    define('amdModule', ['dependecyModule1', 'dependecyModule2'], (dependecyModule1,
    dependecyModule2) => {
        // 业务逻辑
        let count = 0;
        const increase = () => ++count;
        const reset = val => {
            count = 0;
            // dependecyModule1……
        }
    })
```

```js
    require(['amdModule'], amdModule => {
        amdModule.increase();
    })
```

** 面试题：如何对已有代码做兼容
1. 增加定义阶段
2. 返回作为回调内部的return

```js
    define('amdModule', [], require => {
        // 引入部分
        const dependecyModule1 = require(./dependecyModule1);
        const dependecyModule2 = require(./dependecyModule2);

        // 核心逻辑
        let count = 0;
        const increase = () => ++count;
        const reset = val => {
            // …… 
        }

        // 暴露接口部分
        export.increase = increase;
        export.reset = reset;

        return {
            increase,
            reset
        }
    })
```

** 面试题3： 兼容判断AMD&CJS - 区分
UMD的出现
```js
    (define('amdModule', ['dependencyModule1'], require => {
        // 核心逻辑
        let count = 0;
        const increase = () => ++count;
        const reset = val => {
            // …… 
        }

        // 暴露接口部分
        export.increase = increase;
        export.reset = reset;

        return {
            increase,
            reset
        }
    }))(
        // 目标： 一次性去区分CJS和AMD
        // 1. CJS factory
        // 2. module module.exports
        // 3. define
        typeof module === 'Object'
        && module.exports
        && typeof define !== "function"
            ? // 是CJS
                factory => module.exports => factory(require, exports, module)
            : // 是AMD
                define
    )
```

> * 优点: 解决了浏览器的异步动态依赖
* 缺点：会有引入成本，没有考虑按需加载

##### CMD规范
> 按需加载
主要应用框架 sea.js

```js
    // 依赖就近
    define('module', (require, exports, module) => {
        let $ = require('jquery');
        // ……………………

        let depends1 = require('./dependencyModule1');
    })
```

> * 优点：按需加载，依赖就近
* 缺憾：1. 依赖于打包 2. 扩大了模块内的体积

区别：按需加载、依赖就近

#### ESM
> 走进新时代

新增定义：
引入关键字 - import
导出关键字 - export

```js
    // 引入区域
    import dependencyModule1 from './dependencyModule1.js';

    // 逻辑处理区域
    // …… 

    export default {
        increase, reset
    }
```

** 追问： ESM动态模块 ** 
考察：export promise

ES11原生地解决方案
```js
    import('./esModule.js').then(dynamicEsModule => {
        dynamicEsModule.increase();
    })
```

> * 优点
通过一种最统一的形态整合了所有js的模块化
