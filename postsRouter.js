const express = require('express')
const router = express.Router()
const Posts = require('./data/db.js')

router.post('/', (req, res) => {
    const body = req.body
    if(!body.title || !body.contents){
        res.status(400).json({ message: "Please provide title and contents for the post." });
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

router.post('/:id/comments', async (req,res) => {
    const { id } = req.params
    const { post_id, text } = req.body

    const post = await Posts.findById(id).first()
    if(post){
        console.log(post, 'posted')
        if(!post_id || !text){
            res.status(400).json({message: `Please provide text for the comment.`})
        }
        else{
            Posts.insertComment(req.body)
            .then(cId => {
                console.log('comment ID', cId.id)
                Posts.findCommentById(cId.id)
                    .then(newComment => {
                        res.status(201).json(newComment[0])
                    })
                    .catch(err => { res.status(500).json({error: "Error getting new comment"})})
            })
            .catch(err => { res.status(500).json({error: "Error posting comment"})})
        }
    }
    else{
        res.status(401).json({ message: `The post with the specified ID, ${id}, does not exist.` })
    }

})

router.get('/', (req,res) => {
    Posts.find()
        .then((posts) => res.status(200).json(posts))
        .catch(err => { res.status(500).json({error: "The posts information could not be retrieved."})})
})

router.get('/:id', async (req,res) => {
    const { id } = req.params
    const post = await Posts.findById(id).first()
    if(post){
        Posts.findById(id)
            .then(post => {
                res.status(200).json(post[0])
            })
            .catch(err => { res.status(500).json({error: "The post information could not be retrieved."})})
    }
    else{
        res.status(404).json({ message: `The post with the specified ID, ${id}, does not exist.` })
    }
})

module.exports = router;