/**
 * Get MySQL database
 */

import mysql from 'mysql'

const gPool: mysql.Pool =  mysql.createPool({
                                    host:       "localhost",
                                    user:       "root",
                                    password:   "",
                                    database:   "krypton",
                                })

function get(): mysql.Pool {
    return gPool
}

async function query(query: string, data: Array<any>): Promise<any> {
    return new Promise(resolve => {
        gPool.query(
            query, data, (err, res) => resolve(
                { err: err, res: res }
            )
        )
    })
}

export = {
    pool: gPool,
    get: get,
    query: query,
}