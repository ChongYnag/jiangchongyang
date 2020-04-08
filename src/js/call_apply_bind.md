# call、apply、bind实现及详解

### 在JS中，这三者都是用来改变函数的this对象的指向的，他们有什么样的区别呢。
在说区别之前还是先总结一下三者的相似之处：
- 都是用来改变函数的this对象的指向的。
- 第一个参数都是this要指向的对象。
- 都可以利用后续参数传参。

```js


let obj = {
    name: "一个"
}

function allName(firstName, laseName) {
    console.log(this);
    console.log(`我的全名是"${firstName}${this.name}${laseName}"`)
}

allName("我是", "前端");
// Window {parent: Window, opener: null, top: Window, length: 0, frames: Window, …}
//我的全名是"我是前端"

/**
 * call 接受多个参数，第一个参数为函数上下文也就是this，后边参数为函数本身参数
 */
allName.call(obj, "我是", "前端");
//{name: "一个"}  
//我的全名是"我是一个前端"

/**
 * apply 参数列表是个数组
 */
allName.apply(obj, ["我是", "前端"]);
//{name: "一个"}  
//我的全名是"我是一个前端"

/**
 * bind 参数列表多个，返回一个可执行函数,切参数不能是数组
 */

let fnBind = allName.bind(obj, ...["我是"]);
fnBind("前端");

/**
 *  实现call、apply、bind
 */

Function.prototype.newCall = function (context) {
    //异常处理
    if (typeof this !== "function") {
        throw `${this} is not a function`;
    }
    //第一个参数如果没传 那么sele指向window
    context = context || window;
    context.fn = this;
    //去除第一个元素
    let args = [...arguments].slice(1);
    context.fn(...args);
    delete context.fn;
}
//测试newCall
allName.newCall(obj, "我是", "前端");

/**
 *  实现apply
 */
Function.prototype.newApply = function (context) {
    //异常处理
    if (typeof this !== "function") {
        throw `${this} is not a function`;
    }
    context = context || window;
    context.fn = this;
    //apply 传递参数是数组 所以这里不需要解构了
    let args = arguments[1] || [];
    context.fn(...args);
    delete context.fn;
}
//测试newApply
allName.newApply(obj, ["我是", "前端"]);

/**
 *  实现bind
 */
Function.prototype.newBind =  function(context){
    if(typeof this !== "function"){
        throw `${this} is not a function`
    }
    let args = Array.prototype.slice.call(arguments,1);
    let self = this,
        fn = function(){
              return self.apply(this instanceof fn?this:context, [...args,...arguments]);     
        };
    if(this.prototype){
        fn.prototype = this.prototype;
    }
    return fn;
};
//测试newBind
let newBind = allName.newBind(obj, "我是", "前端");
newBind();
```