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

export default async function handler(req: any, res: any) {

     if (req.method === 'POST') {
          const { username } = req.body;
          const { password } = req.body;

          try {
               await sql.connect(config);
               const result = await sql.query`SELECT * FROM LosaGame.dbo.userMemberDB WHERE userID = ${username}`;
               const resultdata = result.recordset.map((user: any) => user.accountIDX);
               if (resultdata.length === 1) {
                    const result2 = await sql.query`SELECT * FROM LosaGame.dbo.userMemberDB WHERE accountIDX = ${resultdata}`;
                    const resultdata2 = result2.recordset.map((user: any) => user.userPWD);
                    if (resultdata2[0] === password) {
                         const oldname = result2.recordset.map((user: any) => user.nickName);
                         res.status(200).json({ message: "login success" ,
                              username: username,
                              oldname: oldname[0]
                         });
                         return 1;
                    } else {
                         res.status(400).json({ message: "username หรือ password ไม่ถูกต้อง" });
                         return 1;
                    }
                    
               } else {
                    res.status(400).json({ message: "username หรือ password ไม่ถูกต้อง" });
                    return 1;
               }
          } catch (err) {
               res.status(500).json({ error: 'Internal server error' });
          }
     }
}