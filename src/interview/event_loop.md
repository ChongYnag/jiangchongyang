# Event Loop

> 主线程从"任务队列"中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为 Event Loop（事件循环）。 -阮一峰

## 为什么 Javascript 是单线程语言

::: tip
单线程-同一时间只能做一件事
:::

1. Javascript 的主要作用是完成用户交互、DOM 操作。多线程会带来同步问题、增加同步的复杂度。
2. web work(主线程操作子线程，但是不能操作 dom)。

## 为什么会有 Event Loop

这里我总结了三个前提:

1. Javascript 的是单线程语言
2. CPU 绝大部分时间是空闲的(主线程代码执行之后，绝大部分时间 CPU 是空闲的)
3. I/O、ajax 等操作相对 CPU 执行代码是缓慢的且需要长期占用 CPU 资源

Event Loop 的作用就是将主线程执行和任务分开，如 ajax 等不占用 CPU 但是需要等待返回的任务作为任务加入到任务队列中，高效运用 CPU 资源。

::: tip
在任务队列中注册的均为回调函数，任务执行由事件轮询机制设定的优先级依次执行
:::

## Event Loop

Event Loop 的工作方式参考下图:

![Event Loop 执行大致流程](/event_loop.png)

上图中包含 Javascript 执行环境、回调队列，主线程执行代码时会生成包含堆和栈，栈中的代码调用相应的 WebApi 向任务队列中注册回调函数。

## 宏任务(Macro task)和微任务(Micro task)

### 宏任务

1. script 代码(主线程)、setTimeout、setInterval、I/O、ajax

### 微任务

1. Promise、MutationObserver、MessageChannel

## Node.js 中的 Event Loop

Node.js 的运行机制不同于浏览器环境，如下图:
![Node.js Event Loop 执行大致流程](/event_loop_node.png)

Node.js 的运行机制如下:
::: tip

1. V8 Engine 解析 Javascript 脚本
2. 解析后的代码，调用 Node API
3. libuv 负责 Node API 的执行。它将不同的任务分给不同的线程。形成一个 Event Loop，以异步的方式将任务的执行结果返回给 V8 Engine
4. V8 Engine 将结果返回给用户
   :::

::: warning
除了 setTimeout 和 setInterval，Node.js 还提供了 process.nextTick 和 setImmediate
:::

![Node.js Event Loop Process 执行大致流程](/event_loop_process.png)

#### process.nextTick

::: warning
Node.js 中主线程为单线程，事件循环也是单线程，相互独立
:::

> 在事件循环的任何阶段，如果 nextTickQueue 不为空，都会在当前阶段操作结束后优先执行 nextTickQueue 中的回调函数。
> ::: warning
> 若使用 nextTick 做递归操作，可能导致堆栈溢出的情况，可以使用 setImmediate 代替
> :::

#### setTimeout 和 setImmediate

setTimeout 会在规定时间到期后执行，setImmediate 会在 epoll 之后执行，无法预测执行时事件循环处于哪个阶段，所以同时存在时顺序不固定。

```js
setTimeout(function() {
  console.log(timeout);
});

setImmediate(function() {
  console.log('immediate);
});

// 1. 先输出timeout，后输出 immediate
// 2. 先输出immediate，后输出timeout
```

::: danger
测试代码只有上述代码是输出是固定的，原因应该是 timers 阶段永远是先执行的。可以用以下代码测试

```js
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log('timeout');
  });

  setImmediate(function () {
    console.log('immediate');
  });
}

// timeout
// immediate
// immediate
// immediate
// timeout
// timeout
```
上面的输出更能看出在epoll阶段, immediate是先于setTimeout执行的
:::

在epoll阶段结果就是确定的了

```js
var fs = require('fs')

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout')
  }, 0)
  setImmediate(() => {
    console.log('immediate')
  })
})

// 先输出 immediate 后输出 timeout
```