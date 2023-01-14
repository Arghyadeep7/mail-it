const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
var ObjectId=mongoose.Types.ObjectId;

// const atob=require("atob");
// const btoa=require("btoa");

require('dotenv').config();

async function main(){
    mongoose.connect(`mongodb+srv://${process.env.MONGODB_URL}.mongodb.net/${process.env.DB_URL}`,{useNewUrlParser:true});
}

main().catch(err=>console.log(err));

app.listen(process.env.PORT || 3000,()=>{
    console.log("Connection Successful!");
});

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,"./client/build")));

app.get('*',(req,res)=>{
    res.sendFile(
        path.join(__dirname,"./client/build/index.html"),(err)=>{
            if(err){
                res.status(500).json(err);
            }
        }
    );
});

const dateSchema=new mongoose.Schema({
    date:String,
    month:String,
    year:String,
    hour:String,
    minute:String,
})

const mailSchema=new mongoose.Schema({
    sender:String,
    senderAdd:String,
    receiver:String,
    receiverAdd:String,
    sub:String,
    msg:String,
    stat:String,
    starred:Boolean,
    dateObj:dateSchema,
});

const userSchema = new mongoose.Schema({
    username:String,
    fname:String,
    lname:String,
    num:String,
    pw:String,
    mails:[mailSchema]
});

const User=mongoose.model('User',userSchema);

app.post("/api/login",(req,res)=>{

    const username=req.body.username;
    const pw=req.body.pw;

    User.collection.findOne({username:username,pw:pw},(err,foundItem)=>{
        if(err){
            console.log(err);
        }else if(foundItem===null){
            return res.status(400).json({message:"NOT FOUND"});
        }else{
            console.log("LOGIN SUCCESSFUL");
            return res.status(200).json({...foundItem,message:"FOUND"});
        }
    });

});

app.post("/api/register",(req,res)=>{

    const username=req.body.username;

    User.collection.findOne({username:username},(err,foundItem)=>{
        if(err){
            console.log(err);
        }else if(foundItem===null){
            if(req.body.type==="SEARCH"){
                return res.status(400).json({message:"NOT FOUND"});
            }else{
                const user= new User({
                    username: username,
                    fname: req.body.fname,
                    lname: req.body.lname?req.body.lname:"",
                    num: req.body.num?req.body.num:"",
                    pw: req.body.pw,
                    mails: []
                });
            
                User.collection.insertOne(user,(err)=>{
                    if(err){
                        return res.status(400).json({message:"ERROR"});
                    }else{
                        console.log("USER REGISTRATION SUCCESSFUL");
                        return res.status(200).json({message:"USER REGISTRATION SUCCESSFUL"});
                    }
                });
            }
        }else{
            console.log("Username already EXISTS!");
            return res.status(200).json({message:"FOUND"});
        }
    });

});

app.post("/api/send",(req,res)=>{

    const currentTime = new Date();

    const currentOffset = currentTime.getTimezoneOffset();

    const ISTOffset = 330;   // IST offset UTC +5:30 

    const IST = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);

    var hour=IST.getHours();
    if(hour<10){
        hour="0"+hour;
    }
    var minute=IST.getMinutes();
    if(minute<10){
        minute="0"+minute;
    }

    const dateObj={
        date:IST.getDate(),
        month:IST.getMonth()+1,
        year:IST.getFullYear(),
        hour:hour,
        minute:minute,
        _id:ObjectId()
    };

    User.collection.findOne({username:req.body.receiverAdd},(err,foundItem)=>{
        if(err){
            console.log(err);
        }else if(foundItem===null){
            res.status(400).json({message:"NOT "});
        }else{

            const mail={
                sender:req.body.sender,
                senderAdd:req.body.senderAdd,
                receiver:foundItem.fname+" "+foundItem.lname,
                receiverAdd:req.body.receiverAdd,
                sub:req.body.sub,
                msg:req.body.msg,
                stat:"SENT",
                starred:false,
                dateObj:dateObj,
                _id:ObjectId()
            };

            User.collection.updateOne({username:mail.senderAdd},{
                $push:{
                    mails:{
                        $each: [mail],
                        $position:0
                    }
                }
            },(err)=>{
                if(err){
                    console.log(err);
                }else{

                    mail.stat="NEW";

                    if(mail.receiverAdd===mail.senderAdd){
                        mail._id=ObjectId();
                    }

                    User.collection.updateOne({username:mail.receiverAdd},{
                        $push:{
                            mails:{
                                $each: [mail],
                                $position:0
                            }
                        }
                    },(err)=>{
                        if(err){
                            console.log(err);
                        }else{
                            res.status(200).json({message:"SUCCESSFUL"});
                        }
                    });
                }
            });
        }
    });    
    
});

app.post("/api/get",(req,res)=>{
    const username=req.body.username;

    User.collection.findOne({username:username},(err,foundItem)=>{
        if(err){
            console.log(err);
        }else if(foundItem===null){
            return res.status(400).json({message:"NOT FOUND"});
        }else{
            return res.status(200).json({...foundItem,message:"FOUND"});
        }
    });
});

app.post("/api/star",(req,res)=>{
    
    const mail=req.body;

    User.collection.updateOne({username:mail.username,"mails._id":ObjectId(mail.ids[0])},
        {$set:{"mails.$.starred":mail.starred}},(err)=>{
        if(err){
            console.log(err);
        }else{
            res.status(200).json({message:"SUCCESSFUL"});
        }
    });

});

app.post("/api/opened",(req,res)=>{
    
    const mail=req.body;

    User.collection.updateOne({username:mail.username,"mails._id":ObjectId(mail._id)},
        {$set:{"mails.$.stat":mail.stat}},(err)=>{
        if(err){
            console.log(err);
        }else{
            res.status(200).json({message:"SUCCESSFUL"});
        }
    });

});

app.post("/api/delete",(req,res)=>{
    
    const mail=req.body;

    for(let i=0;i<mail.ids.length;i++){
        User.collection.updateOne({username:mail.username},{
            $pull:{
                mails:{
                    _id:ObjectId(mail.ids[i])
                }
            }
        },(err)=>{
            if(err){
                console.log(err);
                res.status(400).json({message:"FAILED!"});
            }
        });
    }

    res.status(200).json({message:"SUCCESSFUL"});

});