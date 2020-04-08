const path = require('path');
module.exports = {
    title: '前端知识梳理',
    description: 'Just playing around',
    dest: path.resolve(__dirname, '../../docs'),
    themeConfig: {
        sidebar: [
            {
                title:"变量类型",
                collapsable: false,
                children: [
                    '/js/值类型和引用类型',
                ]
            },
            {
                title:"原型和原型链",
                collapsable: false,
                children: [
                    '/js/原型和原型链',
                    '/js/手写简易JQuery实现',
                ]
            },
            {
                title:"作用域合闭包",
                collapsable: false,
                children: [
                    '/js/作用域',
                    '/js/闭包',
                    '/js/this',
                    '/js/call_apply_bind',
                ]
            },
            {
                title:"http缓存",
                collapsable: false,
                children: [
                    '/js/http缓存',
                ]
            },
            {
                title: 'js经典问题',
                //  path: '/interview/',
                collapsable: false,
                children: [
                    '/js/call_apply_bind',
                ]
            },
            {
                title: 'Interview',
                //  path: '/interview/',
                collapsable: false,
                children: [
                    '/interview/inh·erit',
                    '/interview/xss_csrf',
                    '/interview/event_loop'
                ]
            }
        ]
    },
    markdown: {
        lineNumbers: true
    }
}