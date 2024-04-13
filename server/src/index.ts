import dotenv from 'dotenv';
import App from './app';
import runner from './migrateData';
import StripeChecker from './configs/stripe.checker';

dotenv.config();

const port = process.env.PORT || 3000;
const app = new App(port);

app.listen();
runner();
StripeChecker.start();
