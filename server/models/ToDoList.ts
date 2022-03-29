import { Schema, model } from 'mongoose';
import Status from './StatusEnum';


const TodoListSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        default: Status.private
    }
})


const ToDoList = model('Todolist', TodoListSchema);
export default ToDoList;