import { Router } from 'express'
import {
    getAllContact,
    getContactForDMList,
    searchContact
} from '../controllers/ContactController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';

const contactRoute = Router();

contactRoute.post(`/search`, verifyToken, searchContact)
contactRoute.get(`/get-contact-for-dm`, verifyToken, getContactForDMList)
contactRoute.get(`/get-all-contact`, verifyToken, getAllContact)



export default contactRoute