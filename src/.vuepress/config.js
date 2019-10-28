const path = require('path');
module.exports = {
    title: '前端知识梳理',
    description: 'Just playing around',
    dest: path.resolve(__dirname, '../../docs'),
    themeConfig: {
        sidebar: [
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
                    '/interview/inherit',
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