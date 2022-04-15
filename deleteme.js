
async function test(){
const start = Date.now();
await sleep(500);
const end = Date.now();
console.log(end - start);
function sleep(ms) { return new Promise((resolve) => { setTimeout(resolve, ms); }); }
}
test();
