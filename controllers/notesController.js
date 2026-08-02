const Note = require('../model/Note')
const User = require('../model/User')

const getAllNotes = async (req,res) =>{

  const foundUser = await User.findOne({username:req.user}).exec()

  if(!foundUser) return res.sendStatus(401).json({message: 'User not found'})

    const {search,page,limit} = req.query
    const filter = {user:foundUser._id}

    if(search){
        filter.title = {    $regex: search, $options: 'i'}
    }

    const pageNumber = parseInt(page) || 1
    const pageLimit = parseInt(limit) || 10
    const skip = (pageNumber - 1) * pageLimit

    const total = await Note.countDocuments(filter)
    const notes = await Note.find(filter).skip(skip).limit(pageLimit)

    if(!notes?.length){
        return res.status(400).json({message : 'No notes found'})
    }

    res.json({
        notes,
        currentPage: pageNumber,
        totalPages: Math.ceil(total / pageLimit),
        totalNotes: total
    })
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