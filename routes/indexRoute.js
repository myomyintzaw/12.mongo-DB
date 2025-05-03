const express = require('express');
const router = express.Router();
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();


async function getSearchPosts(req, res) {
    const { title } = req.query;
    if (!title) {
        return res.redirect('/');
    }
    try {
        const posts = await prisma.post.findMany({
            where: {
                title: {
                    contains: title,
                    mode: 'insensitive',
                },
            },
        });
        res.render('index', { posts, title: 'Search Results' });
    } catch (error) {
        console.error('Error searching for posts:', error);
        res.status(500).send('An error occurred while searching for posts.');
    }
}



async function getAllPosts(req, res) {
    try {
        const posts = await prisma.post.findMany();
        res.render('index', { title: 'Home', posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('An error occurred while fetching posts.');
    }
}

// router.get('/', async (req, res) => {
//     // res.send("hello")
//     try {
//         const posts = await prisma.post.findMany();
//         res.render('index', { title: 'Home', posts });
//     } catch (error) {
//         console.error('Error fetching posts:', error);
//         res.status(500).send('An error occurred while fetching posts.');
//     }
// });

//Route handlers
router.get('/', getAllPosts);
router.get('/search', getSearchPosts);

module.exports = router;
