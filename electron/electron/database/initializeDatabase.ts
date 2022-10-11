import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.db');

// Test IF Sqlite3 can work for this project
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS test (info TEXT)');
  const stmt = db.prepare('INSERT INTO test VALUES (?)');
  for (let i = 0; i < 10; i++) {
    stmt.run('Ipsum ' + i);
  }
  stmt.finalize();

  db.each('SELECT rowid AS id, info FROM test', (_err, row) => {
    console.log(row.id + ': ' + row.info);
  });

  db.run('DELETE FROM test WHERE rowid = 1');
});

export default db;
