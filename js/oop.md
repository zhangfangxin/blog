# 类与继承

new 关键字，和 Object.create 方法，所构造出来的，对象关系。
```js
const a = new A();  -->   a.__proto__ = A.prototype;
{
    a = Object.create(A.prototype);
}

const b = Object.create(c);  -->   b.__proto__ = c;
{
    b.__proto__ = function.prototype = c;
    function f(){};
    f.prototype = c;
    return new f();
}
```

## 面向过程 和 面向对象
OOP 
### 举个例子

我们要吃一道菜。
#### 从面向过程的角度
他描述的是过程量，强调的是，我做一件事情的全流程。
```js
// 回锅肉
// 养猪
yangzhu();
getPork();
cookDish();
haveDinner();
```
#### 从面向对象的角度

OOP 
    -> 类，-- 一切事物的抽象。
    -> 对象， 

类： 汽车， 人， 爪哇的学员， 2022款的迈腾；菜鸡；大佬；
对象： 麓一的车。 爪哇的永远的菜鸡。

单纯从吃回锅肉的角度来说：
我 (对象)  -- eat( 回锅肉 )

```js

class Consumer extends Person{
    eat(food:Food) {
        food.beEat();
    }
};

class Chief extends Person{
    cook(food:Food) {
        food.cooked();
    }
}

class Food() {

};

class Pork extend Food() {
    cooked() {
        
    };
    beEat() {

    };
}

const luyi = new Consumer();
const pork = new Pork();
luyi.eat(pork.cooked());
```

### JS 对象的创建
#### 创建一个对象有哪几种方法？
##### Object.create();
```js
const foo = Object.create({});
const bar = {};

foo.__proto__.__proto__ === Object.prototype;
bar.__proto__ === Object.prototype;

```
Object.create() 创建了一个对象。

`let p = Object.create(q);`  -> p.__proto__ === q;
p 的原型，指向q；
当我们需要调用 p 对象的一个方法或属性的时候，如果 p 上面没有，我会去 q 上找。
p.getName 

hasOwnProperty
if(Object.prototype.hasOwnProperty) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
Object.prototype.toString.call()
hasOwn 方法，stage4

##### var bar = {};

##### new 关键字;
```js
function Person(name) {
    this.name = name;
}
Person.prototype.getName = function() {
    console.log(this.name);
}
const p = new Person('菜鸡');

//1. new 创建一个对象，指向构造函数的原型
p.__proto__ === Person.prototype;
//2. 构造函数上，有个原型（是个对象），里面有个 constructor 函数，就是这个构造函数本身。
Person.prototype.constructor === Person;
//3. p对象的构造函数，是 Person
p.constructor === Person;

```
###### new 关键字，到底干了什么？
- 创建了一个对象
- 该对象的原型，指向了这个 Function 的 prototype
- 该对象实现了这个构造函数的方法；
- 根据一些特定情况，返回对象
    - 如果没有返回值，则返回我创建的这个对象；
    - 如果有返回值，是一个对象，则返回该对象；
    - 如果有返回值，不是一个对象，则返回我创建的这个对象；

```js
function newFunc(Father) {
    if(typeof Father !== 'function') {
        throw new Error('new operator function the frist param must be a function');
    }
    var obj = Object.create(Father.prototype);
    var result = Father.apply(obj, Array.prototype.slice.call(arguments,1));
    return result && typeof result === 'object' && result !== null ? result : obj;
}

const p = newFunc(Person, name);
```

### 继承
其实实现一个继承，主要就两个部分：
- 使用父类的构造函数方法和原型函数
- 让对象的原型链指向父类

ES5 原型继承 - 构造函数继承 - 组合继承 - 组合寄生继承
ES6 class 继承

#### 原型继承
```js
function Parent(name) {
    this.name = name;
};

Parent.prototype.getName = function() {
    console.log(this.name);
}

function Child() {};

Child.prototype = new Parent();
Child.prototype.constructor = Child;
// 隐含的问题
// 1. 如果有属性是引用的属性，一旦某个实例修改了这个属性，那么都会被修改。
// 2. 创建的 child 的时候，是不能传参数的
```
#### 构造函数的继承
```js
function Parent (actions, name) {
    this.actions = actions;
    this.name = name
}

function Child(id) {
    Parent.apply(this, Array.prototype.slice.call(arguments, 1));
    this.id = id;
}
// 隐含的问题
// 1. 属性或者方法，想被继承的话，只能在构造函数中定义
// 2. 如果方法在构造函数中定义了，每次都会创建。
```




#### 组合继承
```js
function Parent (actions, name) {
    this.actions = actions;
    this.name = name
}
Parent.prototype.getName = function() {
    console.log(this.name);
}

function Child(id) {
    Parent.apply(this, Array.prototype.slice.call(arguments, 1));
    this.id = id;
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;
```


#### 组合寄生式继承
```js
function Parent (actions, name) {
    this.actions = actions;
    this.name = name
}
Parent.prototype.getName = function() {
    console.log(this.name);
}

function Child(id) {
    Parent.apply(this, Array.prototype.slice.call(arguments, 1));
    this.id = id;
}
// Child.prototype = Object.create(Parent.prototype);
Child.prototype = inherit(Parent.prototype);
Child.prototype.constructor = Child;

///////// class 继承中做的，而狭义上的组合寄生式继承，没有做的。 /////////
for(var k in Parent) {
    if(Parent.hasOwnProperty(k) && !(k in child)) {
        Child[k] = Parent[k];
    }
}

function inherit(p) {
    if(p == null) throw TypeError();
    if(Object.create) {
        return Object.create(p);
    }

    var t = typeof p;
    if(t !== 'object' && t !=='function') throw TypeError();
    function f() {};
    f.prototype = p;
    return new f();
}
```

#### 组合寄生继承 和 class 继承有什么区别？
- class 继承，会继承静态属性
- 子类中，必须在  constructor 调用 super, 因为子类自己的this 对象，必须先通过父类的构造函数完成。





## 附录

《JavaScript 权威指南》  -- 
《JavaScript 高级程序设计》  --
《JavaScript 语言精髓编程实践》
《how JavaScript work》 -- 菜鸡提供
https://blog.sessionstack.com/tagged/tutorial?gi=57650a3023b5

https://github.com/Troland/how-javascript-works

《深入React技术栈》  -- 

《狼书》
《深入浅出 Node》 --