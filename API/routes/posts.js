const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = require('express').Router();
const passport = require('passport');

router.get('/', async (req, res) => {
    const posts = await prisma.post.findMany({
        where: {
            published: true,
        }
    });
    res.json(JSON.stringify(posts));
})

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const post = await prisma.post.create({
        data: {
            title: req.body.title,
            content: req.body.content,
            published: req.body.published ? true : false,
            authorId: req.user.id,
        }
    })
    if (post) {
        res.sendStatus(200);
    } else {
        res.sendStatus(501);
    }
})

router.get('/:postId', async (req, res) => {
    const post = await prisma.post.findUnique({
        where: {
            id: +req.params.postId,
            published: true,
        }
    })
    res.json(post);
})

router.get('/:postId/comments', async (req, res) => {
    const comments = await prisma.comment.findMany({
        where: {
            postId: +req.params.postId,
            post: {
                published: true,
            }
        }
    })
    res.json(JSON.stringify(comments))
})

router.post('/:postId/comments', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const comment = await prisma.comment.create({
        data: {
            content: req.body.content,
            authorId: req.user.id,
            postId: +req.params.postId,
        }
    })
    if (comment) {
        res.sendStatus(200);
    } else {
        res.sendStatus(501);
    }
})

module.exports = router;