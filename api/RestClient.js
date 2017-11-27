var request = require('request');

exports.postAppointment = function sendData(url, session, username, enquiry, dateTime, phoneNumber, callback){
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
            'phoneNumber': phoneNumber
        }
      };
      
      request(options, function handleSendData (error, response, body) {
        if (!error && response.statusCode === 201) {
            console.log(body);
            callback(body, session, username);
        }
        else{
            console.log(error);
        }
      });
};