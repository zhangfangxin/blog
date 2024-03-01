### 先来思考两个问题

#### 程序是怎么执行的？
传统的编译非常复杂的：
1. 先进行分词：
`CString str = "hello"`;
CString / str / = / "hello" /

2. 构建AST（抽象语法树）：

3. 代码生成

（JIT）
JavaScript 的执行主要分为两个阶段：
- 代码预编译阶段
    - 前置阶段：
        - 进行变量声明
        - 变量声明进行提升，但是值为 undefined;
        - 非表达式的函数声明进行提升；
- 代码执行阶段


#### 对于JS来说，一个变量，是如何被赋值和使用的，有什么区别？
`var a = 2`;

- `var a`:
编译器会先问作用域，是不是已经有了一个a, 在当前的作用域中？
    是： 编译器会忽略这个声明，然后继续往下走；
    不是：在当前的作用域中，生成一个新的变量，并命名为a；

- `a = 2`:
编译器会问作用域，是不是已经有一个a, 在当前的作用域中？
    如果是: 赋值为2；
    如果不是：去**上一层的作用域**中去找。

### 作用域
> 作用域，就是根据名称查找变量的规则。

#### 词法作用域/静态作用域
词法作用域就是，定义在词法阶段的作用域。
词法作用域就是你写代码的时候，将变量写在哪里决定的，
因此，当词法分析器处理代码时，会保持作用域不变。
(eval, with)

#### 函数作用域
函数作用域就是，属于这个函数的全部变量，都可以在整个函数内使用。


### 上下文
词法作用域，是在写代码的时候，或者在定义时，确定的；
而动态作用域，是在运行时确定。
[高阶函数]

### 闭包

#### 面试时被问到什么是闭包，如何解释？
> 函数嵌套函数时，内层函数引用了外层函数作用域下的变量，并且内层函数在全局环境下可访问，就形成了闭包。

执行上下文 不等于 词法作用域。

#### 闭包的使用场景？
- 当我使用FP的时候，基本上就有闭包了。
- 当一个函数的执行，和上下文相关的时候，基本上就有闭包了。

```JavaScript
function memorize(fn) {
    const deps = {
        '1|2': 3,
        '1|3': 4

    };
    return function(...rest) {
        const key = rest.join('|');
        dep[key] || (dep[key] = fn(...rest));
        return dep[key];
    }
}

const mAdd = memorize(add);
```
IIFE 

### this
#### this 指向什么？
this 的指向，是根据上下文，动态决定的。
- 在简单调用时，this 默认指向的是 window / global / undefined （浏览器/node/严格模式）
- 对象调用时，绑定在对象上；
- 使用 call . apply . bind 时，绑定在指定的参数上；
- 使用 new 关键字是，绑定到新创建的对象上；
（以上三条优先级：new > apply/call/bind > 对象调用）
- 使用箭头函数，根据外层的规则决定。

```JavaScript
function called(context) {
    const args = Array.prototype.slice.call(arguments, 1);
    context.fn = this;
    if(context) {
        const result = context.fn(...args);
        delete context.fn;
        return result;
    } else {
        return this(...args);
    }
}
```

```JavaScript
function bound(context) {
    const me = context;
    const fn = this;
    const args = Array.prototype.slice.call(arguments, 1);
    return function(...innerArgs) {
        const allArgs = [...args, ...innerArgs];
        return fn.apply(fn, allArgs);
    }
}

```