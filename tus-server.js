const express = require('express');
const { Server } = require('tus-node-server');
const path = require('path');

const app = express();

const server = new Server({
  path: '/uploads',
  datastore: path.resolve(__dirname, 'tus-uploads'),
});

app.all('*', server.handle.bind(server));

app.listen(3001, () => {
  console.log('tus server listening on port 3001');
});