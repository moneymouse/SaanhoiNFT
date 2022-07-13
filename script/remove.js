const fs = require("fs");
const sent = fs.readFileSync("script/send").toString().trim().replace(/\r\n/g,"").split(",");
const result = fs.readFileSync("script/namelist").toString().trim();
const res = result.replace(/\r\n/g,"").split(",");

console.log(res.indexOf(sent[0]));
for(let i=0;i<sent.length;i++){
    const index = res.indexOf(sent[i]);
    if(index!=-1){
        res.splice(index,1);
    }
}

fs.writeFileSync("script/namelist_new",res.join(",\n"),console.log);
// fs.writeFileSync("script/send_new",sent.sort().join(",\n"))