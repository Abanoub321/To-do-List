import express from 'express';
import Status from '../models/StatusEnum';
import ToDo from '../models/ToDo';
import ToDoList from '../models/ToDoList';
import ShareWith from '../models/TodoShareWith';

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


const changeShareWith = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { listId } = req.params;
    const { shareWith } = req.body;

    try {
        if (shareWith === 'public') {
            await ToDoList.findByIdAndUpdate(listId, { status: Status.public });
        }
        else if (shareWith === 'private') {
            await ToDoList.findByIdAndUpdate(listId, { status: Status.private });

        }
        else {

            await ToDoList.findByIdAndUpdate(listId, { status: Status.onlyWith });
            const { userId } = req.body;
            const listShare = await ShareWith.findOne({ todoListId: listId });
            if (!listShare) {
                await new ShareWith({ todoListId: listId, usersId: [userId] }).save();
            }
            else {
                if (!listShare.usersId.includes(userId)) {

                    await ShareWith.findByIdAndUpdate(listShare._id,
                        {
                            $push: {
                                usersId: userId
                            }
                        });
                } else {
                    return res.status(400).json({
                        success: false,
                        message: 'User already added'
                    })
                }
            }
        }
        return res.status(200).json({
            success: true
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export { createNewTodoList, getAllTodoList, deleteTodoList, updateTodoList, changeShareWith };