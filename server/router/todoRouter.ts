import { Router } from 'express';
import { changeShareWith, createNewToDO, deleteTodo, getTodos, updateTodo } from '../controller/todoController';


const todoRouter = Router({ mergeParams: true });


todoRouter.post('/create', createNewToDO);
todoRouter.put('/sharewith',changeShareWith);
todoRouter.get('/', getTodos);
todoRouter.put('/:todoId', updateTodo)
todoRouter.delete('/:todoId', deleteTodo);



export default todoRouter;