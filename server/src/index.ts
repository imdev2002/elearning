import dotenv from 'dotenv';
import App from './app';
import runner from './migrateData';
import StripeChecker from './configs/stripe.checker';
import RefreshData from './configs/refresh.data';

dotenv.config();

const port = process.env.PORT || 3000;
const app = new App(port);

app.listen();
runner();
StripeChecker.start();
RefreshData.start();
