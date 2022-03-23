import express from 'express';
import ToDo from '../models/ToDo';
import ToDoList from '../models/ToDoList';

const createNewTodoList = async (req: express.Request, res: express.Response) => {
    const { title } = req.body;
    if (!title) {
        res.json({
            success: false,
            message: 'Title should not be null or empty'
        })
    }
    try {
        const todoList = await new ToDoList({ title }).save();
        if (todoList)
            res.json({
                success: true,
            })
        else
            res.json({
                success: false,
                message: 'Something went wrong while adding to do'
            })
    } catch (e) {
        res.json({
            success: false,
            message: 'Something went wrong while adding to do'
        })
    }
}


const getAllTodoList = async (req: express.Request, res: express.Response) => {
    const todoList = await ToDoList.find();
    res.json({
        success: true,
        result: todoList
    })
}


const deleteTodoList = async (req: express.Request, res: express.Response) => {
    const { todoId } = req.params;
    try {
        const todoList = await ToDoList.findByIdAndDelete(todoId);
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


const updateTodoList = async (req: express.Request, res: express.Response) => {
    const { todoId } = req.params;
    const { newTitle } = req.body;
    const todoList = await ToDoList.findByIdAndUpdate(todoId, { title: newTitle }, { new: true });
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