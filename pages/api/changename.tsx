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
          const { newname } = req.body;
          try {
               await sql.connect(config);
               const result = await sql.query`SELECT * FROM LosaGame.dbo.userMemberDB WHERE userID = ${username}`;
               const resultdata = result.recordset.map((user: any) => user.accountIDX);


               if (resultdata.length === 1) {
                    const result2 = await sql.query`SELECT * FROM LosaGame.dbo.userMemberDB WHERE nickName = ${newname}`;
                    const resultdata2 = result2.recordset.map((user: any) => user.nickName);
                    if (resultdata2.length === 0) {
                         const result3 = await sql.query`SELECT * FROM LosaGame.dbo.changename_log WHERE Id_User = ${resultdata[0]}`;
                         const resultdata3 = result3.recordset.map((user: any) => user.Id_User);
                         const resultdata4 = result3.recordset.map((user: any) => user.datechange);
                         if (resultdata3.length === 0) {
                              const updateQuery = `UPDATE LosaGame.dbo.userMemberDB SET nickName = '${newname}' WHERE accountIDX = ${resultdata[0]}`;
                              await sql.query(updateQuery);
                              const updateQuery2 = `INSERT INTO LosaGame.dbo.changename_log (username, NewName, datechange,Id_User) VALUES ('${username}', '${newname}', getdate() ,${resultdata[0]})`;
                              await sql.query(updateQuery2);
                              res.status(200).json({ message: "Change Name Success" });
                         } else {
                              const lastChangeDate = resultdata4[0];
                              const date = new Date();
                              const date2 = new Date(lastChangeDate);
                              const cooldownDays = 14;
                              const cooldownPeriod = cooldownDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds
                              if (date.getTime() - date2.getTime() >= cooldownPeriod) {
                                   const updateQuery = `UPDATE LosaGame.dbo.userMemberDB SET nickName = '${newname}' WHERE accountIDX = ${resultdata[0]}`;
                                   await sql.query(updateQuery);
                                   const updateQuery2 = `INSERT INTO LosaGame.dbo.changename_log (username, NewName, datechange,Id_User) VALUES ('${username}', '${newname}', getdate() ,${resultdata[0]})`;
                                   await sql.query(updateQuery2);
                                   res.status(200).json({ message: "Change Name Success" });
                              } else {
                                   const remainingCooldown = Math.ceil((cooldownPeriod - (date.getTime() - date2.getTime())) / (24 * 60 * 60 * 1000));
                                   res.status(400).json({ message: `คุณสามารถเปลี่ยนชื่อได้อีกครั้งในอีก ${remainingCooldown} วัน` });
                                   return 1;
                              }
                         }
                    } else {
                         res.status(400).json({ message: "ชื่อในเกม นี้มีคนใช้แล้ว" });
                         return 1;
                    }

               } else {
                    res.status(400).json({ message: "username นี้ไม่มีอยู่" });
                    return 1;
               }
          } catch (err) {
               res.status(500).json({ error: 'Internal server error' });
          }
     }
}