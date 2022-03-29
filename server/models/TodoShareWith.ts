import { Schema, model } from 'mongoose';



const TodoShareWithSchema = new Schema({
    todoListId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'TodoList'
    },
    usersId: {
        type: Schema.Types.Array,
        required: true
    },

})


const ShareWith = model('ShareWith', TodoShareWithSchema);
export default ShareWith;