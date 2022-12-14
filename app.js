const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const path = require("path");
const { json } = require("body-parser");

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname + "/signup.html"));
});

app.post("/", function(req, res){
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.emailAddress
    const url = "https://us12.api.mailchimp.com/3.0/lists/a1c13e46da"
    const options = {
        method: "POST",
        auth: "stacey6105:YOUR_API_KEY"
    }
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.get("/success", function(req, res){
    res.sendFile(path.join(__dirname + "/success.html"));
});

app.get("/failure", function(req, res){
    res.sendFile(path.join(__dirname + "/failure.html"));
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
});
