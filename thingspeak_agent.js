// via https://gist.github.com/evilmachina/6402955
// its not jaascript, its squirrel...

local thingspeakUrl = "http://api.thingspeak.com/update";
local headers = {"Content-Type": "application/x-www-form-urlencoded",
                  "X-THINGSPEAKAPIKEY":"P63RYC0ELC003JK7"};

function httpPostToThingspeak (data) {
  local request = http.post(thingspeakUrl, headers, data);
  local response = request.sendsync();
  return response;
}

device.on("sendData", function(data) {
   local response =  httpPostToThingspeak("field1="+
   data.supplyVoltage+"&field2="+data.lightLevel);
   //foreach(i,val in data) server.log("index ["+i+"]="+val+"\n");
   ///server.log(response.body);
});
