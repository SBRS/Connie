var builder = require('botbuilder');
var appointment = require('./Appointment');
var converter = require('./CurrencyConverter');
var cognitiveService = require('./CognitiveService');

exports.startDialog = function (bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b191d9b0-5ee6-4bf1-8877-4cdec79a7456?subscription-key=2c70aba8386345928012a19cf560bcd5&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    bot.dialog('bookAppointment', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, 'Please, provide your name to book an appointment.');
            } else {
                next(); // Skip if already has this info.
            }
        },
        function (session, results, next) {
            if (results.response) {
                session.conversationData["username"] = results.response;
            }
            if (!session.conversationData["enquire"]) {
                builder.Prompts.text(session, 'Please, provide purpose of your appointment (open account, open deposit, close deposit and etc.)');
            } else {
                next();
            }
        },
        function (session, results, next) {
            if (results.response) {
                session.conversationData["enquire"] = results.response;
            }
            if (!session.conversationData["dateTime"]) {
                builder.Prompts.time(session, 'Please, provide an appointment date and time. You can use format like MM/DD/YYYY HH:MM:SS or just type something like November 30th 2017 at 10:20am.');
            } else {
                next();
            }
        },
        function (session, results, next) {
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
            session.send('Creating an appointment... Please wait...');
            appointment.createAppointment(session, session.conversationData["username"], session.conversationData["enquire"], session.conversationData["dateTime"], session.conversationData["phoneNumber"]);
        }
    ]).triggerAction({
        matches: 'bookAppointment'
    });

    bot.dialog('retrieveAppointment', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, 'Please, provide your name to look for your appointments.');
            } else {
                next(); // Skip if already has this info.
            }
        },
        function (session, results, next) {
            if (results.response) {
                session.conversationData["username"] = results.response;
            }
            if (!session.conversationData["phoneNumber"]) {
                builder.Prompts.text(session, 'Please, provide your phone number to look for your appointments.');
            } else {
                next();
            }
        },
        function (session, results) {
            if (results.response) {
                session.conversationData["phoneNumber"] = results.response;
            }
            session.send('Searching for your appointments... Please wait...');
            appointment.retrieveAppointment(session, session.conversationData["username"], session.conversationData["phoneNumber"]);
        }
    ]).triggerAction({
        matches: 'retrieveAppointment'
    });

    bot.dialog('deleteAppointment', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, 'Please, provide your name to delete your appointment.');
            } else {
                next(); // Skip if already has this info.
            }
        },
        function (session, results, next) {
            if (results.response) {
                session.conversationData["username"] = results.response;
            }
            if (!session.conversationData["phoneNumber"]) {
                builder.Prompts.text(session, 'Please, provide your phone number.');
            } else {
                next();
            }
        },
        function (session, results, next) {
            if (results.response) {
                session.conversationData["phoneNumber"] = results.response;
            }
            if (!session.conversationData["appointmentId"]) {
                builder.Prompts.text(session, 'Please, provide your appointment ID.');
            } else {
                next();
            }
        },
        function (session, results) {
            if (results.response) {
                session.conversationData["appointmentId"] = results.response;
            }
            session.send('Deleting your appointment... Please wait...');
            appointment.deleteAppointment(session, session.conversationData["username"], session.conversationData["phoneNumber"], session.conversationData["appointmentId"]);
        }
    ]).triggerAction({
        matches: 'deleteAppointment'
    });

    bot.dialog('currencyConverter', [
        function (session, args) {
            session.dialogData.args = args || {};
            // Pulls out the currencyFrom entity from the session if it exists
            session.conversationData["currencyFrom"] = builder.EntityRecognizer.findEntity(args.intent.entities, 'currencyFrom').entity;
            // Pulls out the currencyTo entity from the session if it exists
            session.conversationData["currencyTo"] = builder.EntityRecognizer.findEntity(args.intent.entities, 'currencyTo').entity;

            // Checks if the for entity was found
            if (session.conversationData["currencyFrom"] && session.conversationData["currencyTo"]) {
                builder.Prompts.number(session, 'How much ' + session.conversationData["currencyFrom"].toUpperCase() + ' do you want to convert to ' + session.conversationData["currencyTo"].toUpperCase()) + '?';
            } else {
                session.endConversation("No currency identified! Please try again");
            }
        },
        function (session, results) {
            if (results.response) {
                session.conversationData["amount"] = results.response;
            }
            session.send('Converting... Please wait...');
            converter.displayCurrency(session, session.conversationData["currencyFrom"], session.conversationData["currencyTo"], session.conversationData["amount"]);
        }
    ]).triggerAction({
        matches: 'currencyConverter'
    });

    bot.dialog('makeAwish', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["url"]) {
                builder.Prompts.text(session, 'Please, provide url for a picture of your wish');
            } else {
                next();
            }
        },
        function (session, results) {
            if (results.response) {
                session.conversationData["url"] = results.response;
            }
            session.send('Identifying your wish... Please wait...');
            cognitiveService.retreiveMessage(session, session.conversationData["url"]);
        }
    ]).triggerAction({
        matches: 'makeAwish'
    });
}