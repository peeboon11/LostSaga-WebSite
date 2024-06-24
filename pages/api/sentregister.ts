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

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        const { name } = req.body;
        const { username } = req.body;
        const { password } = req.body;
        const { email } = req.body;

        try {
            await sql.connect(config);
            console.log('DB Connected');

            const request = new sql.Request();
            const result2 = await sql.query`SELECT * FROM LosaGame.dbo.userMemberDB_old WHERE userID = ${username}`;
            const resultdata2 = result2.recordset.map((user: any) => user.userID);
            console.log(resultdata2.length);

            try {
                const query = `
                    INSERT INTO LosaGame.dbo.userMemberDB (userID, nickName, userPWD, EMail, mailling, userType, joinType, limitType, limitDate, trackingcode, regDate, makeType, verified)
                    VALUES (@userID, @nickName, @userPWD, @EMail, @mailling, @userType, @joinType, 0, '1999-01-01', @trackingcode, getdate(), @makeType, 0)
                `;
                request.input('userID', sql.VarChar, username);
                request.input('nickName', sql.VarChar, name);
                request.input('userPWD', sql.VarChar, password);
                request.input('EMail', sql.VarChar, email);
                request.input('mailling', sql.Bit, false);
                request.input('userType', sql.Int, 0);
                request.input('joinType', sql.Int, 0);
                request.input('trackingcode', sql.Int, 0);
                request.input('makeType', sql.Int, 0);
                await request.query(query);

                console.log(username + 'query Pass');


                const accountIDXQuery = `
                    SELECT accountIDX FROM LosaGame.dbo.userMemberDB with(nolock) WHERE userID='${username}'
                `;
                console.log(username + 'accountIDXQuery Pass');

                const result = await request.query(accountIDXQuery);
                const accountIDX = result.recordset[0].accountIDX;

                if (resultdata2.length === 1) {
                    const userCashQuery = `
                    INSERT INTO LosaGame.dbo.userCashDB (accountIDX, amtCash, amtBonus, amtLimit, amtSum, chgDate, regDate)
                    VALUES (${accountIDX}, 0, 200000, 99900, 0, getdate(), getdate())
                `;
                    await request.query(userCashQuery);
                } else {
                    const userCashQuery = `
                    INSERT INTO LosaGame.dbo.userCashDB (accountIDX, amtCash, amtBonus, amtLimit, amtSum, chgDate, regDate)
                    VALUES (${accountIDX}, 0, 10000, 99900, 0, getdate(), getdate())
                `;
                    await request.query(userCashQuery);
                }


                const userInfoQuery = `
                    INSERT INTO LosaGame.dbo.userInfoDB (accountIDX, visit_count, rec_index, rec_inc, rec_dec, checkDate, cnnDate, userIP, regDate)
                    VALUES (${accountIDX}, 0, 0, 0, 0, getdate()-1, '2000-01-01', '', getdate())
                `;
                await request.query(userInfoQuery);

                console.log(accountIDX + 'userInfoQuery Pass');


                const userGameQuery = `
                    INSERT INTO LosaGame.dbo.userGameDB (accountIDX, userState, gameMoney, playTime, conn_count, userLevel, userEXP, rencpoint, renspoint, relateLevel, regionType, refillData, connDate, regDate)
                    VALUES (${accountIDX}, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, '2000-01-01', getdate())
                `;
                await request.query(userGameQuery);

                console.log(accountIDX + 'userGameQuery Pass');


                const userNameQuery = `
                    INSERT INTO LosaGame.dbo.userNameDB (accountIDX, userName, userBirthday, userJumin1, userJumin2, userEnCode, userNumber, userGender, returnValue, userIP, regDate)
                    VALUES (${accountIDX}, '', '010101', '', '','111111111111111', 1, 0, 1, '0.0.0.0', GETDATE())
                `;
                await request.query(userNameQuery);

                console.log(accountIDX + 'userNameQuery Pass');

                const userRecordBattleQuery = `
                    INSERT INTO LosaGame.dbo.userRecordBattleDB (accountIDX, type1_win, type1_lose, type1_kill, type1_death, type2_win, type2_lose, type2_kill, type2_death, type3_win, type3_lose, type3_kill, type3_death, type4_win, type4_lose, type4_kill, type4_death, regDate)
                    VALUES (${accountIDX}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, getdate())
                `;
                await request.query(userRecordBattleQuery);

                console.log(accountIDX + 'userRecordBattleQuery Pass');

                if (resultdata2.length === 1) {
                    const userPresentQuery = `
                    INSERT INTO LosaGame.dbo.userPresentDB (sendIDX, receiveIDX, presentType, value1, value2, value3, value4, msgType, flag, limitDate, regDate)
                    VALUES (1105, ${accountIDX}, 3, 3003139, 1, 0, 0, 3, 1, DATEADD(day, 28, GETDATE()), GETDATE())
                `;
                    await request.query(userPresentQuery);

                    console.log(accountIDX + 'userPresentQuery Pass Old User');
                } else {
                    const userPresentQuery = `
                    INSERT INTO LosaGame.dbo.userPresentDB (sendIDX, receiveIDX, presentType, value1, value2, value3, value4, msgType, flag, limitDate, regDate)
                    VALUES (1105, ${accountIDX}, 3, 3003192, 1, 0, 0, 3, 1, DATEADD(day, 28, GETDATE()), GETDATE())
                `;
                    await request.query(userPresentQuery);

                    console.log(accountIDX + 'userPresentQuery Pass New User');
                }

                const userLoginQuery = `
                    INSERT INTO LosaGame.dbo.userLoginDB (accountIDX, encodeKey, gameServerID, connDate)
                    VALUES (${accountIDX}, '111111111111111', 0, getdate())
                `;
                await request.query(userLoginQuery);

                res.status(200).json({ message: 'User registered successfully' });
            } catch (error) {
                res.status(500).json({ message: 'Failed to register user' });
            }

            await sql.query('IF (@@ERROR = 0) COMMIT TRAN ELSE ROLLBACK TRAN');

            res.status(200).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to register user' });
        }
    }
}


