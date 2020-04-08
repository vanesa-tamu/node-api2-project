const express = require('express')
const router = express.Router()
const Posts = require('./data/db.js')

router.post('/', (req, res) => {
    const body = req.body
    if(!body.title || !body.contents){
        res.status(400).json({ error: "Please provide title and contents for the post." });
    }
    Posts.insert(body)
        .then(post => {
            Posts.findById(post.id)
                .then(result => {
                    res.status(201).json(result[0])
                })
                .catch(err => {
                    console.error('Err in POST', err)
                    res.status(500).json({ error: "Err getting new post"})
                })
        })
        .catch(err => {
            console.error('Err in POST', err)
            res.status(500).json({ error: "There was an error while saving the post to the database" });
        })
})

module.exports = router;