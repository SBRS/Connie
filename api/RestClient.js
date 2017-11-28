var request = require('request');

exports.postAppointment = function sendData(url, session, username, enquiry, dateTime, phoneNumber, id, callback){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type': 'application/json'
        },
        json: {
            'clientName': username,
            'enquiry': enquiry,
            'dateTime': dateTime,
            'phoneNumber': phoneNumber,
            'appointmentId': id
        }
      };
      
      request(options, function handleSendData (error, response, body) {
        if (!error && response.statusCode === 201) {
            console.log(body);
            callback(body, session, username, id);
        }
        else{
            console.log(error);
        }
      });
};

exports.getAppointment = function getData(url, session, username, phoneNumber, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function handleGetData(error,response,body){
        if(error){
            console.log(error);
        }else {
            console.log(body);
            callback(body, session, username, phoneNumber);
        }
    });
};

exports.getRate = function getData(url, session, convertFrom, convertTo, amount, callback){
    request.get(url, function handleGetRate(error,response, body){
        if(error){
            console.log(error);
        }else {
            console.log(body);
            callback(body, session, convertFrom, convertTo, amount);
        }
    });
};