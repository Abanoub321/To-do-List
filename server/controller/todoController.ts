import express from 'express';
import Status from '../models/StatusEnum';
import ToDo from '../models/ToDo';
import ToDoList from '../models/ToDoList';
import ShareWith from '../models/TodoShareWith';


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

export { createNewToDO, getTodos, updateTodo, deleteTodo, changeShareWith };