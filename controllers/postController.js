
const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();

// import { PrismaClient } from "@prisma/client"
// const prisma = new PrismaClient()

async function main() {

    exports.getPosts = async (req, res) => {
        const posts = await prisma.post.findMany(
            {
                where: { authorId: req.session.userId }  //condition (post authorId=login userId)
            }
        );
        res.render('posts/list', { posts, title: 'posts' });  //view
    };

    exports.getCreatePost = (req, res) => {
        res.render('posts/create', { title: 'create post' });
    };

    exports.postCreatPost = async (req, res) => {
        const { title, content } = req.body;
        await prisma.post.create({
            data: {
                title, content, authorId: req.session.userId,
            },
        });
        res.redirect('/posts');
    };



    exports.getEditPost = async (req, res) => {
        const post = await prisma.post.findUnique({
            where: { id: req.params.id, authorId: req.session.userId },
        });
        if (!post) return res.redirect('/posts');
        res.render('posts/edit', { post, title: 'post edit' });
    };


    exports.postEditPost = async (req, res) => {
        const { tilte, content } = req.body;
        await prisma.post.update({
            where: { id: req.params.id, authorId: req.session.userId },
            data: { title, content },
        });
        res.redirect('/posts');
    };


    exports.postDeletePost = async (req, res) => {
        await prisma.post.delete({
            where: { id: req.params.id, authorId: req.session.userId },
        });
        res.redirect('/posts');
    };

}


main()
    .catch(async (e) => {
        console.error(e)
        process.exit(1)
    })

    .finally(async () => {
        await prisma.$disconnect()
    })

