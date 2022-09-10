let express = require("express");
let bodyParser = require("body-parser");
    
let app = express();
let port = 3000;

app.use(bodyParser.json());

app.get("/", function(req, res) {
    res.send("App Works!");
});

app.post("/bmi-calculator", function(req, res) {
    let users = requestTransformer(req.body);
    let responseBody = users.map(request => calculateBMIAndGetBMICategoryAndHealthRisk(request));
    res.json(responseTransformer(responseBody));
});

function calculateBMIAndGetBMICategoryAndHealthRisk(user) {
    let mass = user.mass;
    let height = user.height;
    let bmi = mass/Math.pow(height, 2);
    user = {
        "gender": user.gender,
        "mass": mass,
        "height": height,
        "bmi": bmi
    };
    return getBMICategoryAndHealthRisk(user);
}

function getBMICategoryAndHealthRisk(user) {
    let bmi = user.bmi;
    if(bmi<18.5) {
        user['bmiCategory'] = "Underweight";
        user['healthRisk'] = "Malnutrition risk";
    } else if(bmi>=18.5 && bmi<=24.9) {
        user['bmiCategory'] = "Normal weight";
        user['healthRisk'] = "Low risk";
    } else if(bmi>=25 && bmi<=29.9) {
        user['bmiCategory'] = "Overweight";
        user['healthRisk'] = "Enhanced risk";
    } else if(bmi>=30 && bmi<=34.9) {
        user['bmiCategory'] = "Moderately obese";
        user['healthRisk'] = "Medium risk";
    } else if(bmi>=35 && bmi<=39.9) {
        user['bmiCategory'] = "Severely obese";
        user['healthRisk'] = "High risk";
    } else {
        user['bmiCategory'] = "Very severely obese";
        user['healthRisk'] = "Very high risk";
    }
    return user;
}

function requestTransformer(users) {
    return users.map(user => {
        let data = {};
        data['gender'] = user.Gender;
        data['height'] = user.HeightCm/100;
        data['mass'] = user.WeightKg;
        return data;
    });
}

function responseTransformer(users) {
    return users.map(user => {
        let data = {};
        data['Gender'] = user.gender;
        data['HeightCm'] = user.height*100;
        data['WeightKg'] = user.mass;
        data['BMI'] = user.bmi;
        data['BMI Category'] = user.bmiCategory;
        data['Health Risk'] = user.healthRisk;
        return data;
    });
}

app.listen(port, function(err) {
     console.log(`Running server on port: ${port}`);
});