import { get } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
require('dotenv').config();

type Data = {
  name: string;
};

const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || "1433"),
  options: {
    encrypt: process.env.DB_OPTIONS_ENCRYPT === 'true'
  }
};

export default async function handler(req:any, res:any) {
  
  if (req.method === 'POST') {
    const { email } = req.body;
    const { username } = req.body;
    const { name } = req.body;

    try {
      await sql.connect(config);
      const result = await sql.query`SELECT * FROM LosaGame.dbo.userMemberDB WHERE email = ${email}`;
      const resultdata = result.recordset.map((user: any) => user.email);

      const result2 = await sql.query`SELECT * FROM LosaGame.dbo.userMemberDB WHERE userID = ${username}`;
      const resultdata2 = result2.recordset.map((user: any) => user.userID);

      const result3 = await sql.query`SELECT * FROM LosaGame.dbo.userMemberDB WHERE nickName = ${name}`;
      const resultdata3 = result3.recordset.map((user: any) => user.name);

      if (resultdata.length === 0) {
        if (resultdata2.length === 0) {
          if (resultdata3.length === 0) {
            res.status(200).json({ message: "ชื่อในเกมสามารถใช้ได้" });
          } else {
            res.status(130).json(alert("ชื่อในเกมนี้ถูกใช้ไปแล้ว") );
          }
        } else {
          res.status(120).json( alert("username นี้ถูกใช้ไปแล้ว") );
        }
      } else {
        res.status(110).json( alert("Email นี้ถูกใช้ไปแล้ว") );
        return 1;
      }
    } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
