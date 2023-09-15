const express=require('express');
const {getallauthors,getbyid,createauthor,updateauthor,deleteauthorbyid}=require('../controllers/authController')
const router= express.Router()

router.get('/findall',getallauthors);

router.get('/:id',getbyid);

router.post('/reg',createauthor);

router.patch('/:id',updateauthor);

router.delete('/:id',deleteauthorbyid);

module.exports=router;