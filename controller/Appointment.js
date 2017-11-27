var rest = require('../api/Restclient');

exports.createAppointment = function postAppointment(session, username, enquire, dateTime, phoneNumber){
    var url = 'https://conniebot.azurewebsites.net/tables/appointment';
    rest.postAppointment(url, session, username, enquire, dateTime, phoneNumber);
};