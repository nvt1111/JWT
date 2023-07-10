const mongoose = require('mongoose')

const conn = mongoose.connect('mongodb://localhost:27017/test', { useUnifiedTopology: true });

conn.then(() => {
  const db = mongoose.connection;
  console.log(`Mongodb::: connected::: ${db.name}`);
}).catch((err) => {
  console.error('Mongodb::: connection error:', err);
});

module.exports = conn;