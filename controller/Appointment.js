var rest = require('../api/Restclient');

exports.createAppointment = function postAppointment(session, username, enquire, dateTime, phoneNumber){
    var url = 'https://conniebot.azurewebsites.net/tables/appointment';
    rest.postAppointment(url, session, username, enquire, dateTime, phoneNumber, handleCreateAppointmentResponse);
};

function handleCreateAppointmentResponse(message, session, username){
    session.endConversation("%s, your appointment has been booked", username);  
}