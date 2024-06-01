// Dear programmer:
// When I wrote this code, only God and I knew how it worked.
// Now, only God knows it!

// Therefore, if you are trying to optimize this routine and it fails (most surely),
// please increase this counter as a warning to the next person:
// total_hours_wasted_here = 42

// Thank you.

// console.log(`+---------------------------------------------+
// |                                             |
// |                                             |
// |     __ __                                   |
// |    / // /__ _______ _  ___  __ ________ __  |
// |   / _  / _ \`/ __/  ' \\/ _ \\/ // / __/ // /  |
// |  /_//_/\\_,_/_/ /_/_/_/\\___/\\_,_/_/  \\_, /   |
// |                                    /___/    |
// |                                             |
// |                                             |
// +---------------------------------------------+`);

import 'dotenv/config';
import App from './app';
import runner from './migrateData';
import StripeChecker from './configs/stripe.checker';
import RefreshData from './configs/refresh.data';

const port = process.env.PORT || 3000;
const app = new App(port);

app.listen();
runner();
StripeChecker.start();
RefreshData.start();
