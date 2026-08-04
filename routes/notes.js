const express = require('express')
const router = express.Router()
const notesController = require('../controllers/notesController')



router.route('/')
         .get(notesController.getAllNotes)
         .post(notesController.createNewNote)
         .put(notesController.updateNote)
         .delete(notesController.deletedNote)

router.route('/:id')
        .get(notesController.getByIdNote)
         module.exports = router