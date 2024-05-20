import 'dotenv/config';
import App from './app';
import runner from './migrateData';
import StripeChecker from './configs/stripe.checker';
import RefreshData from './configs/refresh.data';

const port = process.env.PORT || 3000;
const app = new App(port);

console.log(`+---------------------------------------------+
|                                             |
|                                             |
|     __ __                                   |
|    / // /__ _______ _  ___  __ ________ __  |
|   / _  / _ \`/ __/  ' \\/ _ \\/ // / __/ // /  |
|  /_//_/\\_,_/_/ /_/_/_/\\___/\\_,_/_/  \\_, /   |
|                                    /___/    |
|                                             |
|                                             |
+---------------------------------------------+`);

app.listen();
runner();
StripeChecker.start();
RefreshData.start();
