const express =require('express')
const app =express()
require('./db/mongoose')
const bodyParser=require('body-parser')
const port = process.env.PORT || 7000;
const taskRouter = require('./routes/tasks/tasks.routes')
const userRouter= require('./routes/user/user.routes')
const cors=require('cors')
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRouter)
app.use(taskRouter)
app.listen(port, () => console.log(`Listening on port ${port}`));