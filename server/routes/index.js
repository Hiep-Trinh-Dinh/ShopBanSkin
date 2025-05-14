const authRouter = require('./auth-route');
const productRouter = require('./product-route');
const postRouter = require('./post-route');
const chatRouter = require('./chat-route');
const verificationRouter = require('./verification-route');
const historyRouter = require('./history-route');
const transactionRouter = require('./transaction-route');

function route(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/product', productRouter);
    app.use('/api/post', postRouter);
    app.use('/api/chat', chatRouter);
    app.use('/api/verification', verificationRouter);
    app.use('/api/history', historyRouter);
    app.use('/api/transaction', transactionRouter);
}

module.exports = route;