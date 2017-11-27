var request = require('request');

exports.postAppointment = function SendData(url, session, username, enquiry, dateTime, phoneNumber){
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
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};