var request = require('request');

exports.postAppointment = function sendData(url, session, username, enquiry, dateTime, phoneNumber, appointmentId, callback){
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
            'appointmentId': appointmentId
        }
      };
      
      request(options, function handleSendData (error, response, body) {
        if (!error && response.statusCode === 201) {
            callback(body, session, username, enquiry, dateTime, appointmentId);
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
            callback(body, session, username, phoneNumber);
        }
    });
};

exports.deleteAppointment = function deleteData(url,session, username ,phoneNumber, appointmentId, id, callback){
    var options = {
        url: url + "/" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    request(options,function (error, response, body){
        if( !error && response.statusCode === 200){
            console.log(body);
            callback(body, session, username, appointmentId);
        }else {
            console.log(error);
            console.log(response);
        }
    })

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