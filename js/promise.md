# Promise

## Promise 的术语
1. `promise` 是一个有 `then` 方法的对象或者是函数，行为遵循本规范
2. `thenable` 是一个有 `then` 方法的对象或者是函数
3. `value` 是 `promise` 状态成功时的值，也就是 `resolve` 的参数, 表示结果的数据
4. `reason` 是 `promise` 状态失败时的值, 也就是 `reject` 的参数, 表示拒绝的原因
5. `exception` 是一个使用 `throw` 抛出的异常值

## Promise 的使用

### 异步的逻辑

#### 为什么会有微任务？
调用栈并发量大的时候，微任务可以解决异步时机不可控的问题。

### 异步
- 事件回调
- Ajax 请求
- Node API 
- setTimeout 等

#### callback
```js
function foo(fn) {
    setTimeout(() => {
        console.log('foo');
        // 假如，把这个foo字符串看成是一个复杂计算的结果。
        fn('foo');
    }, 5000)
}

foo((res) => {
    console.log(`I've got ${res}`);
})

```
回调地狱：
```js
s.readFile('a.txt', 'utf-8', function(err, data) {
    fs.readFile('b.txt', 'utf-8', function(err, data1) {
        fs.readFile('c.txt', 'uft-8', function(err, data2) {
            // ... ...

        })
    })
})
```
#### Promise 


## Promise 的实现

### 初探 promise

```js
const handler = (resolve, reject) => {
    setTimeout(() => {
        resolve([3,4,5]);
        reject([1,2,3]);
    }, 1000);
}

function getSomeThing(url) {
    return new Promise(handler)
}

let promise1 = getSomeThing('/api/v1/user/role');
promise1.then((res) => {
    console.log(`the result is ${res}`);
}, (error) => {
    console.log(`the reason is ${error}`);
});

```
1. Promise 是一个构造函数；
2. Promise 接收一个函数，这个函数的参数，是(resolve, reject)，也要求是函数。
3. Promise 返回的对象，包含一个 then 函数，  then 函数接收两个参数，这两个参数，一般也是函数。
4. 我们再使用 new 关键字调用 Promise 构造函数时，在结束时
      如果正确执行， 调用 resolve 方法，将结果放在 resolve 的参数中执行，这个结果可以在后面的then 中的第一个函数参数(onFulfilled)中拿到；
      如果错误执行， 调用 reject  方法，将错误信息放在 reject 的参数中执行，这个结果可以在后面的then 中的第二个函数参数(onRejected)中拿到；

[rule--]
Promise 的 status:
1. `pending`
- 初始的状态，可改变，
- 一个 promise 在 `resolve` / `reject` 前都处于这个状态
- 我们可以通过调用 `resolve` 方法或 `reject` 方法，让这个 promise , 变成 `fulfilled`/`rejected` 状态；

2. `fulfilled`
- 不可变状态
- 在 `resolve` 之后，变成这个状态，拥有一个 `value`

3. `rejected`
- 不可变状态
- 在 `reject` 之后，变成这个状态，拥有一个 `reason`

then 函数：
1. 参数：
`onFulfilled` 必须是函数类型，如果不是，应该被忽略；
`onRejected` 必须是函数类型，如果不是，应该被忽略；

2. onFulfilled / onRejected 的特性
在 promise 变成 `fulfilled` / `rejected` 状态的时候，应该调用 `onFulfilled` / `onRejected`;
在 promise 变成 `fulfilled` / `rejected` 状态之前，不应该被调用;
只能被调用一次。

[--rule]

```js
let promise = new L0Promise((resolve, reject) => {
    // T1
    setTimeout(() => {
        resolve('data');
    }, 1000)
});
// T0 + 0.0000001s
promise.then((data) => {
    console.log(data);
});

```

以上不work

### Promise 完善

[划重点]
问题在于，当我 resolve 的时候， onfulfilled 函数，已经执行过了，
所以，我们需要在一个合适的时间去执行 onfulfilled.
换句话说，我们需要在一个合适的时间，去通知 onfulfilled 执行，
-- 发布订阅。

[rule--]
3. onfulfilled 和 onrejected  应该是微任务，
我们暂时用 setTimeout 来代替。
[--rule]

```js
function L1Promise(execute) {
    this.status = 'pending';
    this.value = null;
    this.reason = null;
    this.onFulfilledArray = [];
    this.onRejectedArray = [];
   
    const resolve = (value) => {
        setTimeout(() => {
            if(this.status === 'pending') {
                this.value = value;
                this.status = 'fulfilled';
                this.onFulfilledArray.forEach(func => func(value));
            }
        })
    };

    const reject = (reason) => {
        setTimeout(() => {
            if(this.status === 'pending') {
                this.reason = reason;
                this.status = 'rejected';
                this.onRejectedArray.forEach(func => func(value));
            }
        })
    };

    execute(resolve, reject);
};

L1Promise.prototype.then = function(onfulfilled, onrejected) {
    onfulfilled = typeof onfulfilled === 'function' 
        ? onfulfilled : data => data;
    onrejected = typeof onrejected === 'function' 
        ? onrejected : error => {throw error};
    if(this.status === 'fulfilled') {
        onfulfilled(this.value);
    }
    if(this.status === 'rejected') {
        onrejected(this.reason);
    }
    if(this.status === 'pending') {
        this.onFulfilledArray.push(onfulfilled);
        this.onRejectedArray.push(onrejected);
    }
};
```
[question]
为什么一定要用数组？

[rule--]
4. then 方法可以多次被调用
- promise 的状态变成 `fulfilled`/`rejected` 后，所有的 `onFulfilled`/`onRejected` 都按照 then 的顺序执行，也就是按照注册顺序执行。 
[--rule]

### 链式调用 

```js
let promise = new Promise((resolve, reject) => {
    // T1
    setTimeout(() => {
        resolve('hello');
    }, 1000)
});
// T0 + 0.0000001s
promise.then((data) => {
    console.log(data);
    return data + ' luyi';
})
.then(data => {
    console.log(data);
})
```
 promise 可以，我们不行，why??

 [rule--]
5. then 应该返回一个 promise
```js
promise2 = promise1.then(onFulfilled, onRejected);
```
- onFulfilled / onRejected 执行的结果为x，调用 resolvePromise;
- 如果 onFulfilled / onRejected 执行时抛出异常， promise2 需要被 reject;
- 如果 onFulfilled / onRejected 不是一个函数，promise2 以 promise1 的 value/reason 触发 fulfilled / rejected 

 [--rule]

 ```js
 function L2Promise(execute) {
    this.status = 'pending';
    this.value = null;
    this.reason = null;
    this.onFulfilledArray = [];
    this.onRejectedArray = [];
   
    const resolve = (value) => {
        setTimeout(() => {
            if(this.status === 'pending') {
                this.value = value;
                this.status = 'fulfilled';
                this.onFulfilledArray.forEach(func => func(value));
            }
        })
    };

    const reject = (reason) => {
        setTimeout(() => {
            if(this.status === 'pending') {
                this.reason = reason;
                this.status = 'rejected';
                this.onRejectedArray.forEach(func => func(value));
            }
        })
    };
    //  try catch
    execute(resolve, reject);
};

L2Promise.prototype.then = function(onfulfilled, onrejected) {
    onfulfilled = typeof onfulfilled === 'function' 
        ? onfulfilled : data => data;
    onrejected = typeof onrejected === 'function' 
        ? onrejected : error => {throw error};

    let promise2; // 作为 then 函数的返回值。
    if(this.status === 'fulfilled') {
        return promise2 = new L2Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let result = onfulfilled(this.value);
                    resolve(result);
                } catch(e) {
                    reject(e);
                }
            })
        })
    }
    if(this.status === 'rejected') {
        return promise2 = new L2Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let result = onrejected(this.reason);
                    resolve(result);
                } catch(e) {
                    reject(e);
                }
            })
        })
        
    }
    if(this.status === 'pending') {
        return promise2 = new L2Promise((resolve, reject) => {
            this.onFulfilledArray.push(() => {
                try {
                    let result = onfulfilled(this.value);
                    resolve(result);
                }
                catch(e) {
                    reject(e);
                }
            })

            this.onRejectedArray.push(() => {
                try {
                    let result = onrejected(this.reason);
                    resolve(result);
                }
                catch(e) {
                    reject(e);
                }
            })
        })
    }
};
```
### 如何实现 resolvePromise
```js
resolvePromise(promise2, x, resolve, reject)
```
 [rule--]
6. resolvePromise 的规范
- 如果 promise2 和 x 相等，那么 reject TypeError
- 如果 x 是一个 promise
    如果 x 是 pending 态，那么 promise 必须要在 pending ,直到 x 变成 fulfilled or rejected.
    如果 x 被 fulfilled, fulfill promise with the same value.
    如果 x 被 rejected, reject promise with the same reason.
- 如果 x 是一个 object 或者 是一个 function
    let then = x.then.
    如果 x.then 这步出错，那么 reject promise with e as the reason.
    如果 then 是一个函数，then.call(x, resolvePromiseFn, rejectPromise)
        resolvePromiseFn 的 入参是 y, 执行 resolvePromise(promise2, y, resolve, reject);
        rejectPromise 的 入参是 r, reject promise with r.
        如果 resolvePromise 和 rejectPromise 都调用了，那么第一个调用优先，后面的调用忽略。
        如果调用then抛出异常e 
            如果 resolvePromise 或 rejectPromise 已经被调用，那么忽略
            则，reject promise with e as the reason
    如果 then 不是一个function. fulfill promise with x.
 [--rule]
 ```js
function L3Promise(execute) {
    this.status = 'pending';
    this.value = null;
    this.reason = null;
    this.onFulfilledArray = [];
    this.onRejectedArray = [];
   
    const resolve = (value) => {
        setTimeout(() => {
            if(this.status === 'pending') {
                this.value = value;
                this.status = 'fulfilled';
                this.onFulfilledArray.forEach(func => func(value));
            }
        })
    };

    const reject = (reason) => {
        setTimeout(() => {
            if(this.status === 'pending') {
                this.reason = reason;
                this.status = 'rejected';
                this.onRejectedArray.forEach(func => func(value));
            }
        })
    };
    //  try catch
    try {
     execute(resolve, reject);
    } catch(e) {
        reject(e);
    }
};

const resolvePromise = (promise2, result, resolve, reject) => {
    // 当 result 和 promise2 相等时，也就是说 onfulfilled 返回 promise2 时，进行 reject
    if (result === promise2) {
      reject(new TypeError('error due to circular reference'))
    }
  
    // 是否已经执行过 onfulfilled 或者 onrejected
    let consumed = false
    let thenable
  
    if (result instanceof Promise) {
      if (result.status === 'pending') {
        result.then(function(data) {
          resolvePromise(promise2, data, resolve, reject)
        }, reject)
      } else {
        result.then(resolve, reject)
      }
      return
    }
  
    let isComplexResult = target => (typeof target === 'function' || typeof target === 'object') && (target !== null)
  
    // 如果返回的是疑似 Promise 类型
    if (isComplexResult(result)) {
      try {
        thenable = result.then
        // 如果返回的是 Promise 类型，具有 then 方法
        if (typeof thenable === 'function') {
          thenable.call(result, function(data) {
            if (consumed) {
              return
            }
            consumed = true
  
            return resolvePromise(promise2, data, resolve, reject)
          }, function(error) {
            if (consumed) {
              return
            }
            consumed = true
  
            return reject(error)
          })
        }
        else {
          resolve(result)
        }
  
      } catch(e) {
        if (consumed) {
          return
        }
        consumed = true
        return reject(e)
      }
    }
    else {
      resolve(result)
    }
  }

L3Promise.prototype.then = function(onfulfilled, onrejected) {
    onfulfilled = typeof onfulfilled === 'function' 
        ? onfulfilled : data => data;
    onrejected = typeof onrejected === 'function' 
        ? onrejected : error => {throw error};

    let promise2; // 作为 then 函数的返回值。
    if(this.status === 'fulfilled') {
        return promise2 = new L2Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let result = onfulfilled(this.value);
                    resolvePromise(promise2, result, resolve, reject);
                } catch(e) {
                    reject(e);
                }
            })
        })
    }
    if(this.status === 'rejected') {
        return promise2 = new L2Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let result = onrejected(this.reason);
                    resolvePromise(promise2, result, resolve, reject);
                } catch(e) {
                    reject(e);
                }
            })
        })
        
    }
    if(this.status === 'pending') {
        return promise2 = new L2Promise((resolve, reject) => {
            this.onFulfilledArray.push(() => {
                try {
                    let result = onfulfilled(this.value);
                    resolvePromise(promise2, result, resolve, reject);
                }
                catch(e) {
                    reject(e);
                }
            })

            this.onRejectedArray.push(() => {
                try {
                    let result = onrejected(this.reason);
                    resolvePromise(promise2, result, resolve, reject);
                }
                catch(e) {
                    reject(e);
                }
            })
        })
    }
};
 ```