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

## bind
> bind接收多个参数，第一个是bind返回值，返回值是一个函数上下文的this，不会立即执行。

```js
let obj = {
    name:"一个"
}

function allName(firstName,lastName,flag){
    console.log(this);
    console.log(`我的全名是"${firstName}${this.name}${lastName}"我的座右铭是"${flag}"`)
}

allName.bind(obj); //不会执行
let fn = allName.bind(obj);
fn('我是', '前端', '好好学习天天向上') //我的全名是"我是一个前端"我的座右铭是"好好学习天天向上"
    
// 也可以这样用，参数可以分开传。bind后的函数参数默认排列在原函数参数后边
fn = allName.bind(obj, "你是")
fn('前端', '好好学习天天向上') //我的全名是"你是一个前端"我的座右铭是"好好学习天天向上"
```

### 实现call
```js
const obj = {
    name:'joy',
    fn:function(){
        console.log(1);
    }
};

function getName(a,b){
    console.log(this.name,a,b);
}

function mySymbol(obj) {
   let fn = (Math.random()+new Date().getTime()).toString(32).slice(0,8);
   if(obj.hasOwnProperty(fn)){
       return mySymbol(obj); //递归调用 
   }else{
       return fn;
   }
}

Function.prototype.newCall = function(context){
    //异常处理
    if(typeof this !== 'function'){
        throw this+"is not a function";
    }
    context = context || window;
    //这里考虑fn方法与obj里面的方法 会重名 需要判断
    // context.fn = this;
    let fn = mySymbol(context);
    context[fn] = this;
    let arg = [...arguments].slice(1);
    context[fn](...arg);
    delete context[fn];
}

getName.newCall(obj,1,2); // joy 1 2
```

### 实现apply 
```js
const obj = {
    name:'joy',
    fn:function(){
        console.log(1);
    }
};

function getName(a,b){
    console.log(this.name,a,b);
}

function mySymbol(obj) {
   let fn = (Math.random()+new Date().getTime()).toString(32).slice(0,8);
   if(obj.hasOwnProperty(fn)){
       return mySymbol(obj); //递归调用 
   }else{
       return fn;
   }
}

Function.prototype.newApply = function(context){
    //异常处理
    if(typeof this !== 'function'){
        throw this+"is not a function";
    }
    context = context || window;
    //这里考虑fn方法与obj里面的方法 会重名 需要判断
    // context.fn = this;
    let fn = mySymbol(context);
    context[fn] = this;
    //apply 传递参数是数组 所以这里不需要解构了
    let arg = arguments[1] || [];
    context[fn](...arg);
    delete context[fn];
}

getName.newApply(obj,[1,2]); // joy 1 2
```

### 实现bind

```js
const obj = {
    name:'joy'
};

function getName(name,age,grade){
    this.name = name;
    console.log(`我叫${this.name},我今年${age},我得了${grade}分`);
}

getName.prototype.say = function(){
    console.log(this.name);
}

Function.prototype.newBind = function(context){
    if(typeof this !== "function"){
        throw this+"is not a function"; 
    }
    let self = this;
    let arg = [...arguments].slice(1);
    const F = function(){
        self.apply(this instanceof F?this:context,[...arg,...arguments])
    }

    if (self.prototype) {
        F.prototype = self.prototype;
    }

    return F;
}
// getName.newBind(obj,17)(100) //joy
let fun = getName.newBind(obj,'李琪',17,100);
fun();
console.log(new fun().say());
// let fun = getName.newBind(obj) //joy

// console.log(new fun(17,100));
```

### 练习
```js
//call apply bind 实现
//bind
Function.prototype.myBind = function(context){
  if(typeof this !== "function"){
    throw new Error(this + "不是一个function");
  }
  let _this = this;
  let arg = [...arguments].slice(1);
  function F(){
    // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
    // 以上面的是 demo 为例，如果改成 `this instanceof F ? null : context`，实例只是一个空对象，将 null 改成 this ，实例会具有 fn 属性        
    // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
    _this.apply(this instanceof F?this:context,[...arg,...arguments]);
  }
  if(_this.prototype){
    F.prototype = _this.prototype;
  }
  return F;
}

let obj = {
  name:"李琪",
  age:18,
  fn:function(){
    console.log("fn")
  }
};

function getName(age,grade){
//   this.name = "ss";
  console.log(`我是${this.name},我${age},我得了${grade}分数`)
}

getName.prototype.fn = function(){
  console.log("woshifn");
}

let fn = getName.myBind(obj,17);
fn(1);

let f = new fn(1);
f.fn();

getName.myBind(obj,17)(100)

//call
function mySypol(obj){
  let fn = (Math.random()+new Date().getTime()).toString(32).slice(0,8);
  if(obj.hasOwnProperty(fn)){
    return mySypol(obj)
  }else{
    return fn;
  }
}
Function.prototype.myCall = function(context){
  if(typeof this !== "function"){
    throw new Error(this + "不是一个function");
  }
  context = context || window;
  let arg = [...arguments].slice(1);
  //fn 有可能重名 这里可以处理下
  let fn = mySypol(context);
  context[fn] = this;
  context[fn](...arg);
  delete context[fn];
}

getName.myCall(obj,1,2);


Function.prototype.myApply = function(context){
  if(typeof this !== "function"){
    throw new Error(this + "不是一个function");
  }
  context = context || window;
  let arg = arguments[1];
  let fn = mySypol(context);
  context[fn] = this;
  context[fn](...arg);
  delete context[fn];
}
getName.apply(obj,[1,2]);
```