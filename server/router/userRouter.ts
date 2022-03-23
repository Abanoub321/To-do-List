import { Router } from 'express';
import { createUser, loginUser } from '../controller/userController';



const userRouter = Router();


userRouter.post('/create', createUser);
userRouter.post('/login',loginUser);
//userRouter.get('/',);




export default userRouter;