var rest = require('../api/Restclient');
var builder = require('botbuilder');

exports.displayCurrency = function getRate(session, convertFrom, convertTo, amount) {
    var url = 'https://api.fixer.io/latest?base=' + convertFrom.toUpperCase() + '&symbols=' + convertTo.toUpperCase();
    rest.getRate(url, session, convertFrom, convertTo, amount, handleDisplayCurrency);
};

function handleDisplayCurrency(message, session, convertFrom, convertTo, amount) {
    var displayCurrencyResponse = JSON.parse(message);
    var currencyRate = displayCurrencyResponse.rates[convertTo.toUpperCase()];
    var total = amount * currencyRate;
    //Displays currency converter adaptive card in chat box 
    session.send(new builder.Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "0.5",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Convert " + convertFrom.toUpperCase() + " to " + convertTo.toUpperCase(),
                            "size": "large"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Amount: " + amount + " " + convertFrom.toUpperCase()
                        },
                        {
                            "type": "TextBlock",
                            "text": "Exchange rate: " + currencyRate
                        },
                        {
                            "type": "TextBlock",
                            "text": "Total: " + total + convertTo.toUpperCase()
                        }
                    ]
                },
            ]
        }
    }));
    session.endConversation("Anything else today?")
}