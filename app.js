var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./controller/LuisDialog'); 

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: 'f131d72c-6ce9-40cf-bdb3-e925b40c25c5',
    appPassword: 'zaaWAKEWK953({+hymhH36@'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Sorry, didn't get that. I'm still learning new things. Please try again.");
});

bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                var card = new builder.HeroCard()
                .title('Hey! Connie here. How can I help you?')
                .images([
                    builder.CardImage.create(message, 'https://image.ibb.co/ePqasw/Connie.png')]);
                var msg = new builder.Message().address(message.address).addAttachment(card);
                // var reply = new builder.Message()
                //     .address(message.address)
                //     .text("Hey! Connie here. How can I help you?");
                bot.send(msg);
            }
        });
    }
});

// This line will call the function in your LuisDialog.js file
luis.startDialog(bot);

