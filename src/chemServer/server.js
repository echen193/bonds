// server.js
const express = require('express');
const db = require('./drizzle.config.ts');
const CompoundRecord = require('./models/compoundRecord');

const app = express();
const port = 4000;

app.get('/api/compound_records', async (req, res) => {
  try {
    const records = await db.select().from(CompoundRecord);
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});