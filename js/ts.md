## TypeScript 详解
### 一、TS基础概念
#### 1. 什么是TS
a. 对比原理
* 是JS的一个超集，在JS原有语法之上，添加了可选静态类型和基于类的面向对象编程
> 面向项目：
TS - 面向解决大型复杂项目，多人协同架构以及代码维护复杂的场景
JS - 脚本化语言，用于面相简单页面场景

> 自主检测：
TS - 编译期间，主动发现并纠正提示错误 => 编译时
JS - 运行时报错

> 类型检测：
TS - 弱类型，编译时支持动态和静态类型检测
JS - 弱类型，无静态类型选项

> 运行流程：
TS - 依赖编译，打包实现并且转义成浏览器可以运行的代码
JS - 可直接被浏览器运行

> 复杂特性
TS - 模块化、泛型、接口

b. 安装运行
```js
    npm install -g typescript
    tsc -v

    tsc ./test.ts

    // 面试点：所以的类型检测和纠错阶段 —— 编译时
```

#### 2. TS基础类型与写法

* boolean 、string 、number、array、Null、undefined

```ts
    // es
    let isEnabled = true;
    let class = 'zhaowa';
    let classNum = 2;
    let u = undefined;
    let n = null;
    let classArr = ['basic', 'execute'];

    // TS
    let isEnabled: boolean = true;
    let class: string = 'zhaowa';
    let classNum: number = 2;
    let u: undefined = undefined;
    let n: null = null; 
    let classArr: string[] = ['basic', 'execute'];
    let classArr: Array<string> = ['basic', 'execute'];
```

* tuple - 元组
```ts
    let tupleType: [string, boolean];
    tupleType = ['zhaowa', true];
```

* enum - 枚举
```ts
    // 数字类枚举 - 默认从零开始，依次递增
    enum Score {
        BAD,
        NG,
        GOOD,
        PERFECT
    }
    let score: Score = Score.BAD;

    // 字符串类型枚举
    enum Score {
        BAD = 'bad',
        NG = 'ng',
        GOOD = 'good',
        PERFECT = 'perfect'
    }

    // 值
    enum Score {
        BAD,  // 0
        NG,
        GOOD,
        PERFECT
    }

    // 反向映射
    enum Score {
        BAD,
        NG,
        GOOD,
        PERFECT
    }
    let scoreName = Score[0];  // BAD
    let scoreValue = Score['BAD']; // 0

    // 异构状态
    enum Enum {
        A,  // 0
        B,  // 1
        C = "C",
        D = "D",
        E = 6, 
        F   // 7
    }
    // 面试：指出每种具体值
    // 1. 第一个未明确赋值的项目为0 => 所有未赋值的依次往下排，直到被数字打断
    // 2. 从数字打断处继续进行依次排序
    // 3. 有明确赋值的保留明确值
    // => JS本质实现（手写异构枚举）
    let Enum;
    (function(Enum) {
        // 正向
        Enum["A"] = 0
        Enum["B"] = 1
        Enum["C"] = "C"
        Enum["D"] = "D"
        Enum["E"] = 6
        Enum["F"] = 7
    
        // 逆向
        Enum[0] = "A"
        Enum[1] = "B"
        Enum[6] = "E"
        Enum[7] = "F"
    })
```

* any、unknown、void、never
```ts
// any - 绕过所有类型检查 => 类型检测和编译筛查全部失效
let anyValue: any = 123;

anyValue = 'anyValue';
anyValue = false;

let Value1: boolean = anyValue;

// unknow - 绕过赋值检查 => 禁止更改传递
let unknowValue: unknown;

unknowValue = true;
unknowValue = 123;
unknowValue = "unknowValue";

let value1: unknown = unknowValue; // OK
let value2: any = unknowValue; // OK
let value3: boolean = unknowValue; // NOK

// void(与any相反) - 声明返回值 => 会结束但无返回值
function voidFunction(): void {
    console.log("void function");
}

// never - 用不返回 or 永远error
function error(msg: string): never {
    throw new Error(msg);
}

function longlongloop(): never {
    while(true) {
        // ...
    }
}
```

* object / Object / {} - 对象
```ts
    // object - 非原始类型
    // TS 将JS Object 分成了两个接口来定义
    interface ObjectConstructor {
        create(o: object | null): any;
    }

    const proto = {};

    Object.create(proto);   // OK
    Object.create(null);    // OK
    Object.create(undefined);  // NOK

    // Object
    // Object.prototype 上的属性
    interface Object {
        constructor: Function;
        toString(): string;
        valueOf(): object;
        hasOwnProperty(v: PropertyKey): boolean;
        isPrototypeOf(v: object): boolean;
    }

    // 定义了Object类属性
    interface ObjectConstructor {
        new(value: any): objectl
        readonly prototype: Object;
    }

    // {} - 定义空属性 => 防止新属性添加紊乱
    const obj = {};
    obj.class = 'zhaowa'; // Error

    const obj = {};
    obj.toString(); // OK
```

### 二、接口 - interface

* 对行为的抽象，具体行为实现由类来完成
```ts
// 描述了对象的内容
interface Class {
    name: string;
    time: number;
}

let zhaowa: Class = {
    name: 'typeScript',
    time: 2
}

// 只读 & 任意
interface Class {
    readonly name: string;
    time: number;
}

// 面试题 - 和es的引用不同 => const
let arr: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = arr;
 
ro[0] = 12;   // 赋值 - ERROR
ro.push(5);   // 增加 - ERROR
ro.length = 100;  // 长度改写 - ERROR
arr = ro;       // 覆盖 - ERROR

// 任意可添加属性
interface Class {
    readonly name: string;
    time: number;
    [propName: string]: any;
}

const c1 = { name: 'JS' };
const c2 = { name: 'browser', time: 1, level: 1 };
const c3 = { name: 'typescript', time: 2, isTrail: true };

// node._isChecked
```

### 三、交叉类型 - &
```ts
    interface A { x: D; }
    interface B { x: E; }
    interface C { x: F; }

    interface D { d: boolean; }
    interface E { e: string; }
    interface F { f: number; }

    type ABC = A & B & C;

    let abc: ABC = {
        x: {
            d: false,
            e: 'class',
            f: 5
        }
    };

    // 合并冲突问题：
    interface A {
        c: string;
        d: string;
    }

    interface B {
        c: number;
        e: string;
    }
    type AB = A & B;

    let ab : AB = {
        d: 'class',
        e: 'class'
    }
    // 合并关系是且 => c: never
```

### 四、断言 - 类型声明、转换（和编译器的告知交流）
* 编译时作用
```ts
    // 尖括号形式声明 - 阶段性类型
    let anyValue: any = "zhaowa";
    let anyValue: number = (<string>anyValue).length;

    // AS声明
    let anyValue: any = "zhaowa";
    let anyLength: number = (anyValue as string).length;

    // 非空判断 - 只确定不是空
    type ClassTime = () => number;

    const start = (classTime: ClassTime | undefined) => {
        let num = classTime!(); // 具体类型待定，但确定非空
    }

    // 面试题： - 核心：编译时功能
    const tsClass: number | undefined = undefined;
    const zhaowa: number = tsClass!;
    console.log(zhaowa); // 编译时通过

    "use strict"
    const tsClass = undefined;
    const zhaowa = tsClass; 
    console.log(zhaowa); // undefined

    // 那么存在的意义？
    // 肯定断言 - 肯定化保证赋值
    let score: number;
    startClass();
    console.log(2 * score);
    
    function startClass() {
        score = 5;
    }
    // let score!: number - 告知编译器，运行时下，会被赋值的
```

### 五、类型守卫 - 保障在语法规定的范围内，额外的确认
* 多态 - 多种状态（多种类型）
```ts
    // in - 定义属性场景下的内容确认
    interface Teacher {
        name: string;
        courses: string[];
    }

    interface Student {
        name: string;
        startTime: Date;
    }

    type Class = Teacher | Student;

    function startCourse(cls: Class) {
        if ("courses" in cls) {
            console.log('teacher');
        }
        if ("startTime" in cls) {
            console.log('student');
        }
    }

    // typeof / instanceof - 类型分类场景下的身份确认
    function class(name: string, score: string | number) {
        if(typeof score === "string") {
            console.log('teacher');
        }
        if(typeof score === "number") {
            console.log('student');
        }
    }

    interface Teacher {
        name: string;
        courses: string[];
    }

    interface Student {
        name: string;
        startTime: Date;
    }

    type Class = Teacher | Student;

    const getName = (cls: Class) => {
        if (cls instanceof Teacher) {
            return cls.courses;
        }
        if (cls instanceof Student) {
            return cls.name;
        }
    }

    // 自定义类型
    const isTeacher = function(cls: Teacher | Student): cls is Teacher {
        return 'course' in cls;
    }

    const getName = (cls: Teacher | Student) => {
        if (isTeacher(cls)) {
            return cls.courses;
        }
    }
```

### 六、TS进阶
#### 1. 函数重载
```ts
    class Class {
        start(name: number, score: number): number;
        start(name: string, score: string): string;
        start(name: string, score: number): string;
        start(name: number, score: number): string;
        start(name: Combinable, score: Combinable) {
            if(typeof name === "string" || typeof score === "string") {
                return 'student: ' + name + '-' + score;
            }
            return 'teacher: ' + name + score;
        };
    }
```

#### 2. 泛型 - 重用
* 让模块可以支持多种类型的数据 - 类型和值一样可以赋值传递
```ts
    function startClass<T, U>(name: T, score: U): T {
        return name + score;
    }
    function startClass<T, U>(name: T, score: U): string {
        return `${name}${score}`;
    }
    function startClass<T, U>(name: T, score: U): T {
        return (name + String(score)) as any as T;
    }

    startClass<Number, String>('yy', 5);
```

#### 3. 装饰器 - decorator
```ts
    function Zhaowa(target: Function): void {
        target.prototype.startClass = function(): void {
            // startclass
        }
    }

    @Zhaowa
    class Class {
        // ……
    }

    // 属性装饰器
    function nameWrapper(target: any, key: string) {
        // ……
        Object.defineProperty(target, key, {
            // getter & setter
        })
    }

    class Class {

        @nameWrapper
        public name: string;
    }
```
