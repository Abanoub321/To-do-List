import { Router } from 'express';
import { createNewToDO, deleteTodo, getTodos, updateTodo } from '../controller/todoController';
import { changeShareWith } from '../controller/todolistController';


const todoRouter = Router({ mergeParams: true });


todoRouter.post('/create', createNewToDO);
todoRouter.put('/sharewith',changeShareWith);
todoRouter.get('/', getTodos);
todoRouter.put('/:todoId', updateTodo)
todoRouter.delete('/:todoId', deleteTodo);



export default todoRouter;