import { Router } from 'express';
import { createNewToDO, deleteTodo, getTodos, updateTodo } from '../controller/todoController';


const todoRouter = Router({ mergeParams: true });


todoRouter.post('/create', createNewToDO);
todoRouter.get('/', getTodos);
todoRouter.put('/:todoId', updateTodo)
todoRouter.delete('/:todoId', deleteTodo);



export default todoRouter;