import { Router } from 'express';
import messageModel from "../dao/models/message.model.js";

const router = Router();

router.get('/', async(req, res) => {
    const chat = await messageModel.find()
    res.render('chat', {})
})

export default router