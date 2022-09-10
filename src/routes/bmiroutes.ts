
import * as bodyParser from "body-parser";
import * as express from "express";
import { Logger } from "../utils/logger";

class BMIRoute {

    public express: express.Application;
    public logger: Logger;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.logger = new Logger();
    }

    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {
        this.express.post("/bmi-calculator", (req, res, next) => {
            let users = this.requestTransformer(req.body);
            let responseBody = users.map(user => this.calculateBMIAndGetBMICategoryAndHealthRisk(user));
            res.json(this.responseTransformer(responseBody));
        });
    }

    private calculateBMIAndGetBMICategoryAndHealthRisk(user) {
        let mass = user.mass;
        let height = user.height;
        let bmi = mass/Math.pow(height, 2);
        user = {
            "gender": user.gender,
            "mass": mass,
            "height": height,
            "bmi": bmi
        };
        return this.getBMICategoryAndHealthRisk(user);
    }
    
    private getBMICategoryAndHealthRisk(user) {
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
    
    private requestTransformer(users) {
        return users.map(user => {
            let data = {};
            data['gender'] = user.Gender;
            data['height'] = user.HeightCm/100;
            data['mass'] = user.WeightKg;
            return data;
        });
    }
    
    private responseTransformer(users) {
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
}

export default new BMIRoute().express;