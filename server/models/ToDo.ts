import { Schema, model } from 'mongoose';


const TodoSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    },
    TodoListId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Todolist'
    }
})


const ToDo = model('todo', TodoSchema);
export default ToDo;