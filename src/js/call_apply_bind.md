# call、apply、bind实现及详解

### 在JS中，这三者都是用来改变函数的this对象的指向的，他们有什么样的区别呢。
在说区别之前还是先总结一下三者的相似之处：
- 都是用来改变函数的this对象的指向的。
- 第一个参数都是this要指向的对象。
- 都可以利用后续参数传参。

## call
> call 接收多个参数，第一个为函数上下文也就是this，后边参数为函数本身的参数。

```js
let obj ={
    name: "一个"
}
function allName(firstName, lastName) {
    console.log(this)
    console.log(`我的全名是“${firstName}${this.name}${lastName}”`)
}
// 很明显此时allName函数是没有name属性的
allName('我是', '前端') //我的全名是“我是前端”  this指向window
allName.call(obj, '我是', '前端') //我的全名是“我是一个前端” this指向obj
```
![输出结果](/call.png)

## apply
> apply接收两个参数,第一个参数为函数上下文this,第二个参数为函数参数,只不过是通过一个数组的形式传入的。

```js
allNmame.apply(obj,['我是','前端']) //我的全名是“我是一个前端” this指向obj
```