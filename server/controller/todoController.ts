import express from 'express';
import ToDo from '../models/ToDo';


const getTodos = async (req: express.Request, res: express.Response) => {
    const { listId } = req.params;
    try {
        const todos = await ToDo.find({ TodoListId: listId });
        res.json({
            success: true,
            todos
        });
    } catch (error) {
        return res.json(
            {
                success: false,
                message: 'something went wrong'
            }
        )
    }
}



const createNewToDO = async (req: express.Request, res: express.Response) => {
    const { listId } = req.params;
    const { text } = req.body;

    if (!text) {
        return res.json({
            success: false,
            message: 'You can\'t add empty todo'
        })
    }
    else {
        const todo = await new ToDo({ text, TodoListId: listId }).save();
        if (!todo)
            return res.json({
                success: false,
                message: 'something went wrong'
            });
        else
            return res.json({
                success: true,
            })
    }

}

const updateTodo = async (req: express.Request, res: express.Response) => {
    const { todoId } = req.params;
    try {
        const todo = await ToDo.findByIdAndUpdate(todoId, { done: true });
        if (!todo)
            return res.json({
                success: false,
                message: 'Can\'t update'
            })
        else
            return res.json({
                success: true,
            })
    } catch (error) {
        return res.json({
            success: false,
            message: 'something went wrong'
        })
    }
}



const deleteTodo = async (req: express.Request, res: express.Response) => {
    const { todoId } = req.params;
    try {
        const todo = await ToDo.findByIdAndDelete(todoId);
        if (!todo)
            return res.json({
                success: false,
                message: 'Can\'t delete'
            })
        else
            return res.json({
                success: true,
            })
    } catch (error) {
        return res.json({
            success: false,
            message: 'something went wrong'
        })
    }
}


export { createNewToDO, getTodos, updateTodo, deleteTodo };