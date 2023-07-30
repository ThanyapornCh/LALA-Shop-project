// const { sequelize, User } = require('./models');
// sequelize.sync({ force: true });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// const omise = require('omise')({
//   publicKey: process.env.OMISE_PUBLIC_KEY,
// });

// console.log(process.env.OMISE_PUBLIC_KEY);

// const createCharge = async () => {
//   const customer = await omise.customers.create({
//     email: 'john.doe@example.com',
//     description: 'John Doe (id: 30)',
//     card: token.id,
//   });

//   const charge = await omise.charges.create({
//     amount: 10000,
//     currency: 'thb',
//     customer: customer.id,
//   });
//   console.log('Charge--->', charge);
// };
// createCharge();

const authRoute = require('./routes/auth-route');
const userRoute = require('./routes/user-route');
const orderRoute = require('./routes/order-route');

const adminRoute = require('./routes/admin-route');

// const adminAuthenticateMiddleware = require('./middlewares/admin-authenticate');
const authenticateMiddleware = require('./middlewares/authenticate');
const notFoundMiddleware = require('./middlewares/not-found');
const errorMiddleware = require('./middlewares/error');

const app = express();

app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 1000 * 60 * 15,
    max: 1000,
    message: { message: 'too many requests, please try again later' },
  })
);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/auth', authRoute);
app.use('/users', authenticateMiddleware, userRoute);
app.use('/order', authenticateMiddleware, orderRoute);

app.use('/admin', adminRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 8000;
app.listen(port, () =>
  console.log(chalk.yellowBright.italic.bold(`server running on port:${port}`))
);
