const db = require('../../data/db-config');

module.exports = {
    findAll,
    findById,
    add,
    changeUser,
    remove,
}

function findAll() {
    return db('users');
};

function findById(id) {
    return db('users').where({ id }).first();
};

async function add(user) {
    const [id] = await db('users').insert(user);
    
    return findById(id);
};

async function changeUser(id, changes) {
    await db('users').where({ id }).update(changes);
    return findById(id);
};

function remove(id) {
    return db('users').where({ id }).del();
};
