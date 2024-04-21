const express = require('express');

const AuthorModel = require('../models/author');


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const authors = await AuthorModel.find()
        res.json(authors);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

router.get('/:id', getAuthor, (req, res) => {
    res.json(res.author)
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.name || !req.body.age) {
            return res.status(400).json({ message: 'name and age is required' });
        }

        const existingAuthor = await AuthorModel.findOne({ name: req.body.name })
        if (existingAuthor) {
            return res.status(400).json({ message: 'author already exist!!!' })
        }

        const author = new AuthorModel(req.body);
        const newAuthor = await author.save();
        res.status(201).json({ message: 'author created successfully', author: newAuthor });
    } catch (error) {
        res.status(400).json({ message: err.message })
    }
});

//update an author
router.patch('/:id', getAuthor, async (req, res) => {
    try {
        if (req.body.name === null) {
            res.author.name = req.body.name;
        }
        const updateAuthor = await res.author.save();
        res.json(updateAuthor);
    } catch (error) {
        res.status(400).json({message: err.message})
    }
})

router.put('/:id', getAuthor, async (req, res) => {
    try {
        const updateAuthor = await AuthorModel.findByIdAndUpdate(
            req.params.id,
            req.body,
        );
        
        res.json(updateAuthor);
    } catch (error) {
        res.status(400).json({message: err.message})
    }
})

//delete an author
router.delete('/:id', getAuthor, async (req, res) => {
    try {
        await AuthorModel.findByIdAndDelete(req.params.id)
        res.json({message: 'Author Deleted'})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

async function getAuthor(req, res, next) {
    try {
        const author = await AuthorModel.findById(req.params.id);
        if (!author) {
            return res.status(404).json({message: 'Author Not Found'})
        }
        res.author = author;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = router;
