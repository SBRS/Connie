var builder = require('botbuilder');
var appointment = require('./Appointment');

exports.startDialog = function (bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b191d9b0-5ee6-4bf1-8877-4cdec79a7456?subscription-key=2c70aba8386345928012a19cf560bcd5&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    bot.dialog('bookAppointment', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.userData["username"]) {
                builder.Prompts.text(session, "Please provide your name to book an appointment.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results) {
            if (results.response) {
                session.conversationData["username"] = results.response;
            }
            if (!session.conversationData["enquire"]) {
                builder.Prompts.text(session, 'Please, provide purpose of your appointment (open account, open deposit, close deposit and etc.)');
            } else {
                next();
            }
        },
        function (session, results) {
            if (results.response) {
                session.conversationData["enquire"] = results.response;
            }
            if (!session.conversationData["dateTime"]) {
                builder.Prompts.time(session, 'Please, provide an appointment date and time. You can use format like MM/DD/YYYY HH:MM:SS or just type something like November 30th 2017 at 10:20am.');
            } else {
                next();
            }
        },
        function (session, results) {
            if (results.response) {
                session.conversationData["dateTime"] = builder.EntityRecognizer.resolveTime([results.response]);
            }
            if (!session.conversationData["phoneNumber"]) {
                builder.Prompts.text(session, 'Please, provide your phone number. Our operator will use this number to contact you.');
            } else {
                next();
            }
        },
        function (session, results) {
            if (results.response) {
                session.conversationData["phoneNumber"] = results.response;
            }
            session.send('Creating appointment... Please wait.');
            appointment.createAppointment(session, session.conversationData["username"], session.conversationData["enquire"], session.conversationData["dateTime"], session.conversationData["phoneNumber"]);
            session.conversationData = {};
        }
    ]).triggerAction({
        matches: 'bookAppointment'
    });

    bot.dialog('currencyConverter', function (session, args) {
        // Pulls out the currencyFrom entity from the session if it exists
        var currencyFromEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'currencyFrom');
        // Pulls out the currencyTo entity from the session if it exists
        var currencyToEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'currencyTo');

        // Checks if the for entity was found
        if (currencyFromEntity && currencyToEntity) {
            session.send('convert %s to %s', currencyFromEntity.entity, currencyToEntity.entity);
        } else {
            session.send("No currency identified! Please try again");
        }
    }).triggerAction({
        matches: 'currencyConverter'
    });
}