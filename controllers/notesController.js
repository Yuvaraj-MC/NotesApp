const Note = require('../model/Note')
const User = require('../model/User')

const getAllNotes = async (req,res,next) =>{

    try{
         console.log('req.user:', req.user);

  const foundUser = await User.findOne({username:req.user}).exec()

  console.log('foundUser:', foundUser);

  if(!foundUser) return res.sendStatus(401).json({message: 'User not found'})

    const {search,page,limit} = req.query
    const filter = {user:foundUser._id}
    console.log('filter:', filter);

    if(search){
        filter.title = {    $regex: search, $options: 'i'}
    }

    const pageNumber = parseInt(page) || 1
    const pageLimit = parseInt(limit) || 10
    const skip = (pageNumber - 1) * pageLimit

    const total = await Note.countDocuments(filter)
    console.log('total:', total);
    const notes = await Note.find(filter).skip(skip).limit(pageLimit)
    console.log('filter:', filter);
    console.log('skip:', skip);
    console.log('pageLimit:', pageLimit);

    console.log('notes:', notes);

    if(!notes?.length){
        return res.status(400).json({message : 'No notes found'})
    }

    res.json({
        notes,
        currentPage: pageNumber,
        totalPages: Math.ceil(total / pageLimit),
        totalNotes: total
    })
     }catch(err){
         next(err)
    }
    }


const getByIdNote = async(req,res,next) =>{

    try{
         const {id} = req.params

    if(!id){
     return res.status(400).json({message : 'Note ID is required'})
    }

    const note = await Note.findById(id).exec()

    if(!note){
     return res.status(400).json({message : 'Note not found'})
    }

    res.json(note)

    }catch(err){
        next(err)
    }
   
}


const createNewNote = async(req,res,next) =>{

    try{
        const {user,title,text} = req.body
        
    if(!user||!title,!text){
      return res.status(400).json({message:'All fields are required' })
    }
    const note = await Note.create({user,title,text})
    res.status(201).json({message: 'New note created'})

    }catch(err){
        next(err)
    }
}

const updateNote = async(req,res,next) =>{
    try{
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

    }catch( err){
        next(err)
    }
    
}


const deletedNote = async(req,res) =>{
    try{
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

    }catch(err){
        next(err)
    }
  
}

module.exports = {getAllNotes , getByIdNote , createNewNote ,updateNote,deletedNote}