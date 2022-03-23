import { Schema, model } from 'mongoose';


const TodoListSchema = new Schema({
    title: {
        type: String,
        required: true
    }
})


const ToDoList = model('Todolist', TodoListSchema);
export default ToDoList;