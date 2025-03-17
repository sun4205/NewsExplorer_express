const express = require('express');
const cors = require("cors");
const { errors } = require("celebrate");
const limiter = require('./middlewares/ratelimiter');
const mainRouter = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');

const app = express();

const {PORT = 3000} = process.env;

app.use(cors());
app.use(limiter);
app.use(express.json());
app.use("/", mainRouter);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
})