import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import todoListRouter from './router/TodoListRouter';

const app = express();

const port = process.env.PORT || 5000;

mongoose.connect(`${process.env.MONGODB_URI}`, () => console.log('Connected to DB'));

app.use(express.json());

app.use('/api/todolist', todoListRouter);



app.listen(`${port}`, () => console.log(`listening to port ${port}`))