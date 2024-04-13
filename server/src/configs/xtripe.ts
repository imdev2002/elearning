import Stripe from 'stripe';

const xtripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default xtripe;
