const router = require('express').Router();
const User = require('./user-model');

router.get('/', (req, res, next) => {
    User.findAll()
    .then(users => {
        res.json(users);
    })
    .catch(err => next(err))
});

router.get('/:id', (req, res, next) => {
    User.findById(req.params.id)
    .then(user => {
        user
        ? res.json(user)
        : next({ status: 404, message: `No user with id ${req.params.id}` })
    })
    .catch(err => next(err))
});

router.post('/', (req, res, next) => {
    User.add(req.body)
    .then(newUser => {
        res.status(201).json(newUser);
    })
    .catch(err => next(err))
});

router.put('/:id', (req, res, next) => {
    User.changeUser(req.params.id, req.body)
    .then(mods => {
        res.json(mods);
    })
    .catch(err => next(err))
});

router.delete('/:id', (req, res, next) => {
    User.remove(req.params.id)
    .then(resp => {
        resp
        ? res.status(204).json(resp)
        : res.status(404).json({ message: `No user with id ${req.params.id}` })
    })
    .catch(err => next(err))
});

module.exports = router;
