var express = require("express");
var request = require("request");

var app = express();

var config = {
  clientId: "*******************",
  redirectUri: "http://localhost:3000/callback",
  scope: "vote create_annotation manage_annotation me",
  clientSecret: "*****************"
};

app.get("/", function(request, response) {
  var authUrl = "https://api.genius.com/oauth/authorize?client_id=" +
    config.clientId +
    "&redirect_uri=" + config.redirectUri +
    "&scope=" + config.scope +
    "&state=&response_type=code";
  response.redirect(authUrl);
});


app.get("/callback", function(req, res) {

  var options = {
    url: "https://api.genius.com/oauth/token",
    form: {
      code: req.query.code,
      client_secret: "******************",
      grant_type: "authorization_code",
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: "code"
    }
  };

  request.post(options, function(error, response) {
    console.log("Status code:", response.statusCode);
    if (response.statusCode > 399) {
      console.log(
        "Whops. Something weng wrong. What does the status code indiciate? If it is a 401, your client secret is probably invalid"
      );
    } else {
      console.log(response.statusCode);
      var body = JSON.parse(response.body);
      console.log(body.access_token);
    }
  })
});

app.listen(3000, function() {
  console.log(
    "This is a tool used to attain a Genius access token for testing purposes."
  )
  console.log(
    "All you need to do is, go to http://localhost:3000/ and authenticate. Your access token will then appear in this console."
  );
});
