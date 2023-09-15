const express=require('express');
const {getbyid,getalllib, createlib, updatelib, deletelibbyid}=require('../controllers/libController')
const router= express.Router()

router.get('/findall',getalllib);

router.get('/:id',getbyid);

router.post('/reg',createlib);

router.patch('/:id',updatelib);

router.delete('/:id',deletelibbyid);

module.exports=router;