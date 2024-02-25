const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const Note = require("../models/Note");
const { body, validationResult } = require('express-validator');

// ROUTE - 1 : Get all the notes using GET "/api/notes/fetchallnotes",  require authentication
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }

})

// ROUTE - 2 : Send the notes using POST "/api/notes/addnote",  require authentication
router.post('/addnote', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', "Enter a valid description").isLength({ min: 5 }),
], async (req, res) => {
    try {
        // const { title, description, tag } = req.body
        // If there are errors, it returns Bad Request and displays the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title: req.body.title,
            description: req.body.description,
            tag: req.body.tag,
            user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }

})


// ROUTE - 3 : Update the notes using PUT "/api/notes/updatenote",  require authentication
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    try {
        
        const{title,description,tag}=req.body
        // Create a new node object
        const newNote={}
        if(title){newNote.title=title}
        if(description){newNote.description=description}
        if(tag){newNote.tag=tag}
    
        // Find the note to be updated and uppdate it
    
        let note=await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
    
        if(note.user.toString()!== req.user.id){
            return res.status(401).send("Not Allowed")
        }
        note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.json(note)
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }

})


// ROUTE - 4 : Delete the notes using Delete "/api/notes/deletenote",  require authentication
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        
        const{title,description,tag}=req.body
        // Find the note to be updated and uppdate it
    
        let note=await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
    
        if(note.user.toString()!== req.user.id){
            return res.status(401).send("Not Allowed")
        }
        note=await Note.findByIdAndDelete(req.params.id)
        res.json({"Success" : "Note has been Deleted",note:note})
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }

})
    
    module.exports = router