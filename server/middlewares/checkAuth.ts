import express from 'express';
import Status from '../models/StatusEnum';
import ToDoList from '../models/ToDoList';
import ShareWith from '../models/TodoShareWith';

const checkAuth = async (req: express.Request | any, res: express.Response, next: express.NextFunction) => {
    const { listId } = req.params;
    const { _id } = req.user;
  
    const todolist = await ToDoList.findById(listId);
    if (!todolist) {
        return res.status(404).send({
            success: false,
            message: 'List not found'
        });
    }
    
    if (todolist.status === Status.private && todolist.userId.toString() !== _id.toString()) {
        return res.status(401).send({
            success: false,
            message: 'Unauthorized'
        });
    }
    if (todolist.status === Status.public) {
        return next();
    }
    if (todolist === Status.onlyWith) {
        const shareWith: any = ShareWith.find({ todoListId: listId });
        if (!shareWith) {
            return next(new Error());
        }
        const userIds: any = shareWith.usersId.map((id: any) => id);
        if (userIds.includes(_id)) {
            return next();
        }
        return res.status(401).send({
            success: false,
            message: 'Unauthorized'
        });
    }
    next();
}
export default checkAuth;