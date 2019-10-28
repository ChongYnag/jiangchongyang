/// 原型链继承
function Parent() {
  this.name = 'Parent';
}

Parent.prototype.getName = function()  {
  console.log(this.name);
}

function Child() {
  //this.name = 'Child';
}

Child.prototype = new Parent();

var ch1 = new Child();
ch1.getName();