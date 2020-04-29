const express = require('express')
const router = new express.Router();
const auth= require('../../middlewares/auth')
const Task = require('../../models/task/tasks')
router.post('/tasks',auth,async (req,res)=>{
    const task = new Task({...req.body,owner:req.user._id})
    try{
        await task.save()
        res.status(200).send(task)
    }
    catch(e){
        res.status(400).send({Error:e})
    }
})
router.patch('/tasks/:id',auth,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed', 'title']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    const task=await Task.findOne({owner:req.user._id,_id:req.params.id})
    if(!task)
    {
        res.status(400).send("INVALID REQUEST !")
    }
    updates.forEach((update) => task[update] = req.body[update])
    await task.save()
    res.status(200).send(task)
})
router.get('/tasks',auth,async(req,res)=>{
   try{ await req.user.populate({
                            path: 'tasks'
                        }).execPopulate()
    res.send({tasks:req.user.tasks,user:req.user,server:"FROM SERVER"})}
    catch(e)
    {
        res.status(400).send("INVALID")
    }
})
router.delete('/tasks/:id',auth,async(req,res)=>{
    console.log(req.params.id)
    const _id =req.params.id 
   const task= await Task.findOneAndDelete({_id,owner:req.user._id})
   if(!task)
   {
       res.status(400).send({Error:"ERROR !"})
   }
   res.status(200).send(task)
})
module.exports= router