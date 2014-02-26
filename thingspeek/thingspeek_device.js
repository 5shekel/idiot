
data <- {
    supplyVoltage = "",
    lightLevel = "",
}

function getData() {
    data.supplyVoltage = hardware.voltage();
    data.lightLevel = hardware.lightlevel();
        //local c_str = format("%.01f", c);
    //foreach(i,val in data) server.log("index ["+i+"]="+val+"\n");
    
    agent.send("sendData", data);
    imp.wakeup(1, getData);
}
getData();
