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
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag;
    } else{
        console.log('Oops, please try again!');
    }
}