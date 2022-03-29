import express from 'express';
import ToDo from '../models/ToDo';
import ToDoList from '../models/ToDoList';

const createNewTodoList = async (req: express.Request | any, res: express.Response) => {
    const { title } = req.body;
    if (!title) {
        res.json({
            success: false,
            message: 'Title should not be null or empty'
        })
    }
    try {
        const todoList = await new ToDoList({ title, userId: req.user._id }).save();
        if (todoList)
            res.json({
                success: true,
            })
        else
            throw Error();
    } catch (e) {
        throw Error();
    }
}


const getAllTodoList = async (req: express.Request | any, res: express.Response) => {
    const { _id } = req.user;
    const todoList = await ToDoList.find({ userId: _id });

    res.json({
        success: true,
        result: todoList
    })
}


const deleteTodoList = async (req: express.Request | any, res: express.Response) => {
    const { todoId } = req.params;
    const { _id } = req.user;
    try {
        const todoList = await ToDoList.findById(todoId);

        if (todoList.userId != _id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        await ToDoList.findByIdAndDelete(todoId);
        const todos = await ToDo.find({ TodoListId: todoId })
        await Promise.all(todos.map(async (todo) => {
            await ToDo.findByIdAndDelete(todo._id);
        }))

        if (todoList)
            res.json({
                success: true
            })
        else
            res.json({
                success: false,
                message: 'Something went wrong while deleting the list'
            })
    } catch (error) {
        res.json({
            success: false,
            message: 'Something went wrong while deleting the list'
        })
    }
}


const updateTodoList = async (req: express.Request | any, res: express.Response) => {
    const { todoId } = req.params;
    const { newTitle } = req.body;
    const { _id } = req.user;
    const todoList = await ToDoList.findById(todoId);
    if (todoList.userId != _id.toString()) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        })
    }
    await ToDoList.findByIdAndUpdate(todoId, { title: newTitle });
    if (todoList)
        res.json({
            success: true
        })
    else
        res.json({
            success: false,
            message: 'Something went wrong while updating the title'
        })
}


export { createNewTodoList, getAllTodoList, deleteTodoList, updateTodoList };