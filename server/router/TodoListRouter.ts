import { Router } from 'express';
import { createNewTodoList, deleteTodoList, getAllTodoList, updateTodoList } from '../controller/todolistController';
import checkAuth from '../middlewares/checkAuth';
import todoRouter from './todoRouter';

const todoListRouter = Router();


todoListRouter.post('/create', createNewTodoList);
todoListRouter.get('/', getAllTodoList);
todoListRouter.delete('/:todoId', deleteTodoList);
todoListRouter.put('/:todoId', updateTodoList)
todoListRouter.use('/:listId',checkAuth, todoRouter)


export default todoListRouter;