// import './style.less';
import test1, { getName } from './test1';
const test2 = require('./test2');
console.log(test1);
console.log(test2);
console.log(getName);
console.log(require.cache);
console.log(require.main);