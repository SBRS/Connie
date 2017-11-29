var request = require('request');

exports.retreiveMessage = function (session, url){

    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/05f83e36-7be7-4bb1-8ec5-6569b70ceb6b/url?iterationId=51b2fb78-f8ff-4a4d-bd15-67fd94762bac',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': 'a8e10e08aa534e8ab77978e142738e32'
        },
        body: { 'Url': url }
    }, function(error, response, body){
        session.endConversation(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        if (body.Predictions[0].Tag == "House"){
            return "It is a house. We can give you best home loan interest rates. Please book an appointment or call us. Anything else today?";
        }
        else if (body.Predictions[0].Tag == "Car"){
            return "It is a car. Fast approval car finance from 9.95% p.a.*. Please book an appointment or call us. Anything else today?";
        }
        else if (body.Predictions[0].Tag == "TV"){
            return "It is a TV. Whatever your needs, wants or goals we can help you achieve them with Our Personal Loan. Please book an appointment or call us. Anything else today?";
        }        
    } else{
        return "Oops, I couldn't identify your wish. Sorry... Please try another one...";
    }
}