### http缓存

```js
//expires: Wed, 08 Apr 2020 07:44:24 GMT  过期时间
缺点：1.太长 每次请求都会占用流量 2.时间与客户端可能存在误差 

// cache-control:  （这些值都可以同时设置的）
   1 private  只允许客户端缓存
   2 public   客户端和代理服务器都可以缓存
   3 max-age  相对时间 单位是秒  
   4 no-cache  不适用缓存 这个可以和服务器端协商缓存
   5 no-store  绝对的不缓存
   6 must-revalidate 必须校验缓存验证 

//last-modified: Mon, 12 Dec 2016 08:38:42 GMT 上次更新时间

if-modified-since     Mon, 12 Dec 2016 08:38:42 GMT  协商缓存会在请求时添加 上次更新时间
  if-modified-since <= last-modified  返回304 拉浏览器缓存 

// 用文件的hash 
Etag: "196f-5827608e6efeb"  文件变了 Etag就会变。
if-none-matched 会带上浏览器本地 Etag  命中返回304 负责拉200
```