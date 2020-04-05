## this

> 作为普通函数

> 使用call apply bind 

> 作为对象方法被调用

> 在class 方法中调用

> 箭头函数

> this取什么值，是在函数执行的时候确定的，不是在函数定义的时候确定的

```js
function fn1(){
    console.log(this);
}
fn1() //window

fn1.call({x:100}) //{x:100}

//bind 返回一个函数
const fn2 =  fn1.bind({x:100})
fn2() // {x:100} 
```
![this](/zuoyongyu02.png)
>箭头函数里的this 取的是上级作用域的值

![this](/zuoyongyu03.png)



