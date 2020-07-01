var JiraClient = require("jira-connector")

class JiraOperation {
buff=[]
    constructor(project) {

       this.jira = new JiraClient({
            host: "tester231.atlassian.net",
            basic_auth: {
                email: "bundzavadym@gmail.com",
                api_token: "ech2CcUxsCpT1COWcEsh4CC3"
            }
        });
    }
    async getAllUser(data=null){


        let a = await this.jira.user.all('')

        return a;
    }
    async getAllProjectName(){
    let a = await this.jira.project.getAllProjects('')
        return a
    }
   async getAllIssues(data=null){
    this.buff=[];
    let a;

        a= await  this.jira.search.search({
            jql:'project="PP231"'
        }).then(data=>{
            for(let i =0;i<data.issues.length;i++){
                this.buff.push(data.issues[i].fields)
            }
            //console.log(this.buff.length)
            return this.buff
            // console.log(this.buff[4])
        })



       return a;
    }
}
//let a= new JiraOperation()
module.exports= {JiraOperation};
