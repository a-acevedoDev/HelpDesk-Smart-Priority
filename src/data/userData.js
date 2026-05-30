const path = require('path');
const { readJsonFile } = require('./jsonFileStore');

const usersPath = path.join(__dirname, 'users.json');

async function getUsers() {
  return await readJsonFile(usersPath);
}

module.exports = {
  getUsers,
};
