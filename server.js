const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});


app.post("/", function (req, res) {
    var firstname = req.body.fName;
    var lastname = req.body.lName;
    var email_ = req.body.emails;

    var data={
        members:[{
            email_address:email_,
            status:"subscribed",
            merge_fields:{
                FNAME:firstname,
                LNAME:lastname
            }
        }]
    }

    var jsonData=JSON.stringify(data);

    var options={
        url: "https://usxx.api.mailchimp.com/3.0/lists/unique_id",
        //value of xx can be found on mailchimp server
        method:"POST",
        headers:{
            "Authorization":"your_mailchimp_user_name your_api_key"
        },
        body:jsonData
    };

    request(options, function(error, response, body){
        if(error){
            res.sendFile(__dirname+"/failure.html");
            console.log(error);
        }
        else{
            if(response.statusCode==200){
                res.sendFile(__dirname+"/success.html");
            }
            else{
                res.sendFile(__dirname+"/failure.html");
            }
        }
    });


});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Our code is running on port number 3000");
});
