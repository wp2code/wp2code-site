/** Generating Base64 for lpip*/
// VS code 安装 Code Runner
const lqip = require("lqip");
const path = require("path");
const file = `./kaleido.png`;
const filePath = path.join(__dirname, file);
console.log("filePath", filePath);
lqip.base64(filePath).then((res) => {
  console.log(res); // "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhY.....
});

lqip.palette(filePath).then((res) => {
  console.log(res); //  [ '#628792', '#bed4d5', '#5d4340', '#ba454d', '#c5dce4', '#551f24' ]
});
