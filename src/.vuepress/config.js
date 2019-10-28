const path = require('path');
module.exports = {
  title: 'Awesome',
  description: 'Just playing around',
  dest: path.resolve(__dirname, '../../docs'),
  themeConfig: {
    sidebar: [
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