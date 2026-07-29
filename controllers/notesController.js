const Note = require('../model/Note')
const User = require('../model/User')

const getAllNotes = async (req,res) =>{

    const foundUser = await User.findOne({username: req.user})

    if(!foundUser) return  res.status(401).json({message : 'user not found'})

        const notes = await Note.find({user : foundUser._id})
        
    if(!notes?.length){
       return  res.status(400).json({message : 'No Notes Found'})
    }
    res.json(notes)
}

const getByIdNote = async(req,res) =>{
    const {id} = req.params

    if(!id){
     return res.status(400).json({message : 'Note ID is required'})
    }

    const note = await Note.findById(id).exec()

    if(!note){
     return res.status(400).json({message : 'Note not found'})
    }

    res.json(note)
}


const createNewNote = async(req,res) =>{
    const {user,title,text} = req.body

    if(!user||!title,!text){
      return res.status(400).json({message:'All fields are required' })
    }
    const note = await Note.create({user,title,text})
    res.status(201).json({message: 'New note created'})
}

const updateNote = async(req,res) =>{
    const {id ,title ,text}  = req.body

    if(!id||!title||!text){
      return res.status(400).json({message : 'All fields are required'})
    }
    const note = await Note.findById(id).exec()
    if(!note){
     return res.status(400).json({message : 'Note not found'})
    }
    note.title = title
    note.text = text

    const updatedNote = await note.save()

    res.json({message:`Note updated`})
}


const deletedNote = async(req,res) =>{
    const {id} = req.body

    if(!id){
     return res.status(400).json({message : 'Note ID required'})
    }

    const note = await Note.findById(id).exec()
    if(!note){
      return res.status(400).json({message : 'Note not found'})
    }

    await note.deleteOne()
    res.json({message : 'Note deleted'})
}

module.exports = {getAllNotes , getByIdNote , createNewNote ,updateNote,deletedNote}