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

    try {
      await sql.connect(config);
      const result = await sql.query`SELECT * FROM LosaGame.dbo.userMemberDB WHERE email = ${email}`;
      console.log(result.recordset.map((user: any) => user.email));
      const resultdata = result.recordset.map((user: any) => user.email);
      console.log(resultdata.length + ' Email exists');

      if (resultdata.length === 0) {
        res.status(200).json({ message: "Email สามารถใช้ได้" });
      } else {
        res.status(400).json({ error: "Email นี้ถูกใช้ไปแล้ว" });
      }
    } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
