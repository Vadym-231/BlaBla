const server = require('express');
const fs = require('fs');
const {JiraOperation} = require('./JiraClass')
const {sql} = require( './mySqlClass')
const path =require('path')

const app = server()
const mySql =new sql('127.0.0.1','root','root','test');
const jira = new JiraOperation();
function checkDate(data) {
    let date1 =new Date(data.created)
    let date2 = new Date()
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if(diffDays>5){
        return 'yellow'
    }if(diffDays>1){
        return 'red'
    }else {
        return 'white'
    }
   // console.log(diffDays)
    //console.log(((((Date.parse(date)-Date.parse(data.created))/100)/60)/60)/24)
   // console.log(data.created+'  now date:'+ new Date())
}


function renderDefaultInformation(req,res,project=null){

    jira.getAllUser().then(data=> {
        let users=[],endData={userAction:[]};
        data.map(data => {
            if (data.accountType !== 'app') {
                users.push({nameDispl:data.displayName,acountId:data.accountId});
            }
        })
        endData.users=users;
        let buff;
        if(data!==null){
           buff=jira.getAllIssues(data)
        }else{
            buff=jira.getAllIssues()
        }
        buff.then(data=>{
           users.map(dataUs=>{
               data.map(data_=>{
                   if(data_.reporter.displayName===dataUs.nameDispl&&data_.reporter.accountId===dataUs.acountId){
                       endData.userAction.push({UserName:data_.assignee.displayName,status:data_.status.name,priority:data_.priority.name,type:data_.issuetype.name,srcType:data_.issuetype.iconUrl,dayLate5:checkDate(data_)})

                   }
                       })
           })
            res.send(JSON.stringify(endData))
            endData=null;
        }).catch(err=>{
            console.log(err)
            mySql.sqlQuerry2('select max(id) from test.logtable;').then(data=>{
                mySql.sqlQuerry2("insert into test.logtable(id,errorMessang,date) values("+(Number(data[0][0]['max(id)'])+1)+",'"+err.toString()+"','"+new Date()+"');")
            })
        })
    }).catch(err=>{
        console.log(err)
        mySql.sqlQuerry2('select max(id) from test.logtable;').then(data=>{
                        mySql.sqlQuerry2("insert into test.logtable(id,errorMessang,date) values("+(Number(data[0][0]['max(id)'])+1)+",'"+err+"','"+new Date()+"');")
        })
    })
}
function getProject(req,res) {
    jira.getAllProjectName().then(data=>{
        let buff={arr:[]}
        data.map(data_=>{
            buff.arr.push({name:data_.name,key:data_.key})
        })
        res.send(JSON.stringify(buff))
    })
}
function htmlOrCss(res,PathStr,type){
    res.writeHead(200,{'Content-Type': type+'; charset=utf-8'});

    return fs.createReadStream(PathStr,'utf-8');//(__dirname+PathStr,'utf-8');
}

app.get('/',(req,res)=>{
    htmlOrCss(res,path.join(__dirname,'index.html'),'text/html').pipe(res)
})
app.get('/getDataByFilter=:project',(req,res)=>{
    renderDefaultInformation(res,res,req.params.project)
})
app.get('/getAllProjectName',(req,res)=>{
    getProject(req,res)
})
app.get('/giveMeCss',(req,res)=>{
    htmlOrCss(res,path.join(__dirname,'style.css'),'text/css').pipe(res)
})
app.get('/getDefaultInformation',(req,res)=>{
    renderDefaultInformation(res,res)
})
app.listen(8280, function () {
  //  console.log(app.port);
});