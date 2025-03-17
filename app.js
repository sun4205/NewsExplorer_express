const express = require('express');
const { errors } = require("celebrate");
const mainRouter = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');

const app = express();

const {PORT = 3000} = process.env;

app.use(express.json());
app.use("/", mainRouter);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
})