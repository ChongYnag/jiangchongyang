// setTimeout(function () {
//   console.log(123);
// })

// new Promise(function (resolve, reject) {
//   resolve();
// }).then(() => {
//   console.log(123);
//   while (true) { };
// }); 

// setTimeout(function () {
//   console.log('timeout');
// });

// setImmediate(function () {
//   console.log('immediate');
// });

for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log('timeout');
  });

  setImmediate(function () {
    console.log('immediate');
  });
}