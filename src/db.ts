import sqlite3 from "sqlite3"; 
import { open } from "sqlite";
import { userinfo } from "./types";

// const db = new sqlite3.Database("db.db", sqlite3.OPEN_READWRITE, (err: any) => {
//   if (err && err.code == "SQLITE_CANTOPEN") {
//     createDatabase();
//   } else {
//     console.error(err);
//     return;
//   }

//   console.log("Connected to database");
// });

// function createDatabase() {
//   let newdb = new sqlite3.Database("db.db", (err) => {
//     if (err) {
//       console.error("Couldn't create database with the following error message:");
//       console.error(err);
//       return;
//     }

//     createTables(newdb);
//   })
// }

// function createTables(newdb: sqlite3.Database) {
//   newdb.exec(`
//   create table users (
//     username text UNIQUE not null,
//     id text UNIQUE not null,
//     email text not null
//   );`);

//   db.close();
// }

async function openDb() {
  return open({
    filename: "db.db",
    driver: sqlite3.Database
  });
}

export async function getUser(id: string) {
  const db = await openDb();
  const result: userinfo= await db.get("SELECT email FROM users WHERE email = '" + id + "'") as userinfo;
  db.exec("DELETE FROM users WHERE id = '" + id + "'");
  return result;
}

export async function addUser(user: userinfo) {
  const db = await openDb();
  db.exec(`INSERT INTO users VALUES ("${user.username}", "${user.id}", "${user.email}")`).catch((err) => {
    console.error(err);
  });
}