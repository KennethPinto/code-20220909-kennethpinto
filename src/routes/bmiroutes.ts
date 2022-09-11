
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
            let promises = [];
            promises.push(users.map(user => this.calculateBMI(user)));
            Promise.all(promises).then((user) => {
                users.push(user);
            });
            promises.push(users.map(user => this.getBMICategoryAndHealthRisk(user)));
            Promise.all(promises).then((user) => {
                users.push(user);
            });
            res.json(this.responseTransformer(users));
        });
    }

    private calculateBMI(user) {
        return new Promise((resolve, reject) => {
            user['bmi'] = user.mass/Math.pow(user.height, 2);
            resolve(user);
          });
    }
    
    private getBMICategoryAndHealthRisk(user) {
        return new Promise((resolve, reject) => {
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
            resolve(user);
        });
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