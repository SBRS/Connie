var rest = require('../api/Restclient');
var builder = require('botbuilder');

exports.createAppointment = function postAppointment(session, username, enquire, dateTime, phoneNumber) {
    var url = 'https://conniebot.azurewebsites.net/tables/appointment';
    var id = randomInt (1000, 9999);
    rest.postAppointment(url, session, username, enquire, dateTime, phoneNumber, id, handleCreateAppointmentResponse);
};

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function handleCreateAppointmentResponse(message, session, username, id) {
    session.endConversation("%s, your appointment has been booked %s", username, id);
}

exports.retrieveAppointment = function getAppointment(session, username, phoneNumber) {
    var url = 'https://conniebot.azurewebsites.net/tables/appointment';
    rest.getAppointment(url, session, username, phoneNumber, displayAppointments);
};

function displayAppointments(message, session, username, phoneNumber) {
    var retrieveAppointmentResponse = JSON.parse(message);
    var allAppointments = [];
    for (var index in retrieveAppointmentResponse) {
        var clientNameReceived = retrieveAppointmentResponse[index].clientName;
        var phoneNumberReceived = retrieveAppointmentResponse[index].phoneNumber;
        var enquiryReceived = retrieveAppointmentResponse[index].enquiry;
        var dateTimeReceived = retrieveAppointmentResponse[index].dateTime;    
        var idReceiver =  retrieveAppointmentResponse[index].appointmentId;    

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === clientNameReceived.toLowerCase() && phoneNumber === phoneNumberReceived) {
            var card = new builder.ThumbnailCard(session)
                .title(enquiryReceived.toUpperCase())
                .subtitle('Date and Time: ' + dateTimeReceived)
                .text('Appointment ID: ' + idReceiver)
                .images([
                    builder.CardImage.create(session, 'http://www.pvhc.net/img58/myrhslyykacxjpfzxauv.png')])
            allAppointments.push(card);
        }
    }

    var message = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(allAppointments);
    session.send(message);

    session.endConversation("%s, here are your appointments. Anything else I can do for you?", username);
}