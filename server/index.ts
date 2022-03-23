import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import todoListRouter from './router/TodoListRouter';
import userRouter from './router/userRouter';
import requireLogin from './middlewares/requireLogin';

const app = express();

const port = process.env.PORT || 5000;

mongoose.connect(`${process.env.MONGODB_URI}`, () => console.log('Connected to DB'));

app.use(express.json());

app.use('/api/users',userRouter)

app.use(requireLogin)
app.use('/api/todolist', todoListRouter);



app.use((err:any, req:express.Request, res:express.Response, next:express.NextFunction) => {
    res.status(500).send('Internal server error')
  })

app.listen(`${port}`, () => console.log(`listening to port ${port}`))