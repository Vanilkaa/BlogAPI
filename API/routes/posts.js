const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = require('express').Router();
const passport = require('passport');

router.get('/', async (req, res) => {
    const posts = await prisma.post.findMany();
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
        }
    })
    res.json(post);
})

router.get('/:postId/comments', async (req, res) => {
    const comments = prisma.comments.findMany({
        where: {
            postId: +req.params.postId,
        }
    })
})

module.exports = router;