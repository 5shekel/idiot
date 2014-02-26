// IDIOT - ACDCWIFI
//// agent ////
// bootstrap code via https://github.com/tomerweller/iot
//based on https://github.com/electricimp/examples/tree/master/SnackBot and others
// shenkar SE lab (redButkhe/yair99) http://00idiot00.tumbler.com

const html = @"   ";

//////////////////////
// Global Variables //
//////////////////////
server.log("restart egent");
_AC_state <- ""; 
_SENSOR_state <- "";   
_DC_state <- ""; 
supplyVoltage <- ""; // ambient sensor reading (internal)

data <-  { _AC_state = 0, _SENSOR_state = 0, _DC_state = 0, supplyVoltage = 0};

/////////////////////////////////////////////////////////////////
//communication with DEVICE , send json table out
/////////////////////////////////////////////////////////////////
device.on("sendToAgent", function(temp) {
    data = temp;
    foreach(i,val in data){ server.log( i +" = "+val);}
    //server.log(http.jsonencode(data));
});

/////////////////////////////////////////////////////////////////
/// thingspeek storage
/////////////////////////////////////////////////////////////////
// via https://gist.github.com/evilmachina/6402955
local thingspeakUrl = "https://api.thingspeak.com/update";
local headers = {"Content-Type": "application/x-www-form-urlencoded",
                  "X-THINGSPEAKAPIKEY":"xxxxxxxxxxxxxxxxxxxx"};
                  
function httpPostToThingspeak (temp) {
    // foreach(i,val in data){ server.log( i +" = "+val);} // //loop over table

  local request = http.post(thingspeakUrl, headers, temp);
  local response = request.sendsync();
  return response;
}

device.on("sendData", function(temp) {
   //local response =  httpPostToThingspeak("field1="+   data.supplyVoltage);
   foreach(i,val in data) server.log("["+i+"]="+val+"\n");
   
   //dump table to valid urlencoding
    local tlength = 0;    local conct="";
    foreach(i,val in temp) {
        conct += "&field"+tlength+"="+val;        
        tlength++; 
    }
   local response = httpPostToThingspeak(conct);
 // server.log(conct);
});


/////////////////////////////////////////////////////////////////
//comunication with HTML CLIENT
/////////////////////////////////////////////////////////////////
function respondImpValues(request, response) { 
    try
    {
        response.header("Access-Control-Allow-Origin", "*");
        if (request.method=="POST"){
                local args = http.jsondecode(request.body);
                device.send("argsFromJs",args); //route to device, ready for pull
            response.send(200, "OK");
            //server.log("respondImpValues "+http.jsonencode(args));

        }else if(request.method="GET"){
            //send to server imp values
            //foreach(i,val in data){ server.log( i +" = "+val);} // //loop over table
            local jsonVars = http.jsonencode(data);
            response.send(200, jsonVars);
            //server.log(jvars);
        }
    }
    catch (ex) {
        response.send(500, "Internal Server Error: " + ex);
    }
}
http.onrequest(respondImpValues);

/*-- gggggggggggggggggggggggggggggggggggggggggggggggggggggggggg-->  
// http.onrequest(function) sets up a function handler to call when an http
// request is received. Whenever we receive an http request call respondImpValues
// https://electricimp.com/docs/api/http/onrequest/


function mailgun(emailFrom, emailTo, emailSubject, emailText) {
    const MAILGUN_URL = "https://api.mailgun.net/v2/me.mailgun.org/messages";
    const MAILGUN_API_KEY = "key-your_api_key";
    local auth = "Basic " + http.base64encode("api:"+MAILGUN_API_KEY);
    local text = http.urlencode({from=emailFrom, to=emailTo, subject=emailSubject, text=emailText});
    local req = http.post(MAILGUN_URL, {Authorization=auth}, text);
    local res = req.sendsync();
    if(res.statuscode != 200) {
        server.log("error sending email: "+res.body);
    }
}
mailgun("postmaster@me.mailgun.org", "me@yahoo.com", "Testing Mailgun", "Thank you deldrid1!");
*/