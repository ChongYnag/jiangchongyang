# javascript 继承

## 什么是继承

> 继承是面向对象软件技术当中的一个概念，与多态、封装共为面向对象的三个基本特征。继承可以使得子类具有父类的属性和方法或者重新定义、追加属性和方法等。

## javascript 常用继承方式

-   <a href="#原型链继承">原型链继承</a>
-   <a href="#借用构造函数继承">借用构造函数继承</a>
-   <a href="#组合继承">组合继承</a>
-   <a href="#原型式继承">原型式继承</a>
-   <a href="#寄生式继承">寄生式继承</a>
-   <a href="#寄生组合式继承">寄生组合式继承</a>

## 原型链继承

```js
/// Parent
function Parent(name) {
    // 实例属性
    this.name = 'Parent';
}
// 原型方法
Parent.prototype.getName = function() {
    return this.name;
};

/// Child
function Child() {}
Child.prototype = new Parent();

/// Test
var ch1 = new Child();
console.log(ch1.getName()); // Parent
```

### 缺点

#### 1. 所有新实例都会共享父类的实例属性。(任意实例修改原型属性，影响其他实例属性)

::: danger
修改是指对引用类型的修改,新的赋值操作会直接作用于实例，不会影响原型上的属性，参考如下代码
:::

```js
/// test
var ch1 = new Child();
// 此处的赋值只会作用于当前实例
// 除非直接通过原型修改才会产生副作用
// ch1.__proto__.name = 123;
ch1.name = 123;
var ch2 = new Child();
console.log(ch2.getName()); // Parent
```

以下示例使用了引用类型的属性，导致了副作用的产生:

```js
/// Parent
function Parent(name) {
    // 实例属性
    this.options = {
        version: '1.0'
    };
}
// 原型方法
Parent.prototype.getOptions = function() {
    return this.options;
};

/// Child
function Child() {}
Child.prototype = new Parent();

/// test
var ch1 = new Child();
ch1.options.version = '1.2';
var ch2 = new Child();
console.log(ch2.getOptions()); // {version: "1.2"}
```

#### 2. 新实例无法向父类构造方法传参

#### 3. 继承单一

## 借用构造函数继承

```js
/// Parent
function Parent(name) {
    // 实例属性
    this.name = 'Parent';
}

/// Child
function Child() {
    Parent.apply(this, Array.prototype.slice.call(arguments));
}

/// test
var ch1 = new Child();

console.log(ch1.name);
```

### 优点

1. 解决了原型链继承 1,2,3
2. 可以继承多个父类

### 缺点

1. 只能继承父类构造属性，无法继承父类原型

## 组合继承

组合继承结合了原型链继承和借用构造函数继承

```js
/// Parent
function Parent(name) {
    this.name = name;
}

Parent.prototype.getName = function() {
    return this.name;
};

/// Child
function Child() {
    Parent.apply(this, Array.prototype.slice.call(arguments));
}

Child.prototype = new Parent();

/// test
var ch1 = new Child('Child');
console.log(ch1.getName()); //Child
```

## 原型式继承

类 Object.create 的实现

```js
/// Parent
function Parent() {
    this.name = 'Parent';
}

/// Child
function create(obj) {
    function F() {}
    F.prototype = obj;
    return new F();
}
var parent = new Parent();
var ch1 = create(parent);

/// test
console.log(ch1.name);
```

父类不变，增加包装对象的一个方法

### 缺点

1. 同原型链继承 1,2,3

## 寄生式继承

给原型式继承增加包装函数

```js
/// Parent
function Parent() {}

/// Child
function create(obj) {
    function F() {}
    F.prototype = obj;
    return new F();
}

function createChild(obj) {
    var child = create(obj);
    child.name = 'child';
    return child;
}

/// test
var ch1 = createChild(new Parent());
console.log(ch1);
```

### 缺点

1. 无法复用

## 寄生组合式继承

```js
function extend(Child, Parent) {
    var prototype = Object.create(Parent.prototype);
    prototype.constructor = Child;
    Child.prototype = prototype;
}

/// Parent
function Parent(name) {
    this.name = name;
}

Parent.prototype.getName = function() {
    return this.name;
};

/// Child
function Child() {
    Parent.apply(this, Array.prototype.slice.call(arguments));
}
extend(Child, Parent);

/// test
var ch1 = new Child('ch1');
console.log(ch1);
console.log(ch1.getName()); // Child
```

### 优点

1. 避免了组合式继承调用两次父类构造方法
2. 避免了父类属性被篡改

::: tip
extend 具有两个功能：子类的原型是用父类的原型和修改原型的 constructor 指向。
:::

## new 关键字作用

1. 创建一个空对象
2. 新对象的**proto**指向构造函数的原型
3. 以空对象为 this 指向调用构造方法
4. 判断返回值是否为空，不为空则返回，否则返回创建的新对象
