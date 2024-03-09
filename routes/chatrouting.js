const express =require('express');
const router=express.Router();
const tockenCheck=require('../middlewares/tockenckeck');


const {postingchat}=require('../controllers/chat.controller');
const {usermessages}=require('../controllers/chat.controller');
const {allusermessages}=require('../controllers/chat.controller');
const {getsingleusrchat}=require('../controllers/chat.controller');


router.get('/usermessages', tockenCheck, usermessages);
router.get('/allmessages', tockenCheck, allusermessages);
router.get('/getsingleusrchat/:name', tockenCheck, getsingleusrchat);
router.post('/postingchat', tockenCheck, postingchat);

module.exports=router;
