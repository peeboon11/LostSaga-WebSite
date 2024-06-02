require('dotenv').config();

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
        try {
            await sql.connect(config);
            const result = await sql.query`SELECT * FROM LosaGame.dbo.userMemberDB WHERE userID = ${username}`;
            const resultdata = result.recordset.map((user: any) => user.userID);
            if (resultdata.length === 1) {
                res.status(200).json({ message: 'Username found' });
            } else if (resultdata.length > 1){
                res.status(404).json({ message: 'Username มีมากกว่า 1 กรุณาแจ้ง Admin' });
            }else {
                res.status(404).json({ message: 'Username not found' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}