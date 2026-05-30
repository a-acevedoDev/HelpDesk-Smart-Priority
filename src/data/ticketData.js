const path = require('path');
const { readJsonFile, writeJsonFile } = require('./jsonFileStore');

const ticketsPath = path.join(__dirname, 'tickets.json');

async function getTickets() {
  return await readJsonFile(ticketsPath);
}

async function saveTickets(tickets) {
  await writeJsonFile(ticketsPath, tickets);
}

module.exports = {
  getTickets,
  saveTickets,
};
