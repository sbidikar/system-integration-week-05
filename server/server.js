const express = require('express');
const app = express();
app.use(express.json());
const axios = require('axios');
const port = 3000;

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const options = {
      swaggerDefinition: {
        info: {
          title: 'Siddharth Application',
          info: '1.0.0',
          description: 'Application to perform CRUD operation with Database',
        },
        host: '137.184.143.79:3000',
        basePath: '/',
      },
      apis: ['./server.js'],
};

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

const {check, validationResult} = require('express-validator');
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sample',
    port: 3306,
    connectionLimit: 5
});


app.get('/', (req, res) => {
    res.header('Content-type', 'text/html');
    return res.end('<h1>application page</h1>');
});

/**
* @swagger
* /agents:
*    get:
*      description: Return all agents
*      produces:
*          - application/json
*      responses:
*          200:
*              description: Contains array of agents
*/
app.get('/agents', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        var query = 'SELECT * FROM agents';
        var rows = await conn.query(query);
        res.end(JSON.stringify(rows));
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200);
    } catch (err) {
        res.status(404).json({ err });
    } finally {
        if (conn) return conn.release();
    }
});

/**
* @swagger
* /agents/{agentCode}:
*   get:
*     description: Retrieve a single agent.
*     parameters:
*       - in: path
*         name: agentCode
*         required: true
*         description: string agent code.
*         schema:
*           type: string
*     responses:
*       200:
*         description: Contains agent data
*/
app.get('/agents/:agentCode', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        var query = 'SELECT * FROM agents where AGENT_CODE=?';
        var rows = await conn.query(query, [req.params.agentCode]);
        res.end(JSON.stringify(rows));
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200);
    } catch (err) {
        res.status(404).json({ err });
    } finally {
        if (conn) return conn.release();
    }
});

/**
* @swagger
* /customer:
*    get:
*      description: Return all customer
*      produces:
*          - application/json
*      responses:
*          200:
*              description: Contains array of customer
*/
app.get('/customer', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        var query = 'SELECT * FROM customer';
        var rows = await conn.query(query);
        res.end(JSON.stringify(rows));
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200);
    } catch (err) {
        res.status(404).json({ err });
    } finally {
        if (conn) return conn.release();
    }
});

/**
* @swagger
* /agents:
*   post:
*     description: Retrieve a single agent.
*     parameters:
*       - in: body
*         type: object
*         properties:
*           agentCode:
*               type: string
*           agentName:
*               type: string
*           workingArea:
*               type: string
*           commission:
*               type: string
*           phoneNo:
*               type: string
*           country:
*               type: string
*     responses:
*       200:
*         description: Contains agent data
*/
app.post('/agents', [
  check('agentCode').isLength({ min: 3 }),
check('phoneNo').isLength({ min: 10 })
], async (req, res) => {
    let conn;
    const errors = validationResult(req);
   if(!errors.isEmpty()){
    return res.status(422).json({ errors: errors.array() });
   }
 else{
    try {
        conn = await pool.getConnection();
        var agentCode = req.body.agentCode;
        var agentName = req.body.agentName;
        var workingArea = req.body.workingArea;
        var commission = req.body.commission;
        var phoneNo = req.body.phoneNo;
        var country = req.body.country;
        var query = `INSERT INTO agents values ('${agentCode}','${agentName}','${workingArea}','${commission}','${phoneNo}','${country}')`;
        var rows = await conn.query(query);
        res.end(JSON.stringify(rows));
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200);
    } catch (err) {
        res.status(404).json({ err });
    } finally {
        if (conn) return conn.release();
    }
}
});

//{"agentCode":"A098","agentName":"Ankur","workingArea":"Atlanta","commission":0.11,"phoneNo":"077-25814763","country":""}

/**
* @swagger
* /agents:
*   put:
*     description: Retrieve a single agent.
*     parameters:
*       - in: body
*         type: object
*         properties:
*           agentCode:
*               type: string
*           agentName:
*               type: string
*           workingArea:
*               type: string
*           commission:
*               type: string
*           phoneNo:
*               type: string
*           country:
*               type: string
*     responses:
*       200:
*         description: Contains agent data
*/
app.put('/agents',[
  check('agentCode').isLength({ min: 3 }),
check('phoneNo').isLength({ min: 10 })
], async (req, res) => {
    let conn;
    try {
        var agentCode = req.body.agentCode;
        var agentName = req.body.agentName;
        var workingArea = req.body.workingArea;
        var commission = req.body.commission;
        var phoneNo = req.body.phoneNo;
        var country = req.body.country;
        conn = await pool.getConnection();
        var query = `UPDATE agents SET AGENT_NAME='${agentName}', WORKING_AREA='${workingArea}', COMMISSION='${commission}',PHONE_NO='${phoneNo}',COUNTRY='${country}' where AGENT_CODE='${agentCode}'`;
        var rows = await conn.query(query, agentName, workingArea, commission, phoneNo, country, agentCode);
        res.end(JSON.stringify(rows));
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200);
    } catch (err) {
        res.status(404).json({ err });
    } finally {
        if (conn) return conn.release();
    }
});

/**
* @swagger
* /agents:
*   patch:
*     description: Retrieve a single agent.
*     parameters:
*       - in: body
*         type: object
*         properties:
*           agentCode:
*               type: string
*           agentName:
*               type: string
*           workingArea:
*               type: string
*           commission:
*               type: string
*           phoneNo:
*               type: string
*           country:
*               type: string
*     responses:
*       200:
*         description: Contains agent data
*/
app.patch('/agents',[
  check('agentCode').isLength({ min: 3 }),
check('phoneNo').isLength({ min: 10 })
], async (req, res) => {
    let conn;
    try {
        var agentCode = req.body.agentCode;
        var agentName = req.body.agentName;
        var workingArea = req.body.workingArea;
        var commission = req.body.commission;
        var phoneNo = req.body.phoneNo;
        var country = req.body.country;
        conn = await pool.getConnection();
        var query = `UPDATE agents SET AGENT_NAME='${agentName}', WORKING_AREA='${workingArea}', COMMISSION='${commission}',PHONE_NO='${phoneNo}',COUNTRY='${country}' where AGENT_CODE='${agentCode}'`;
        var rows = await conn.query(query, agentName, workingArea, commission, phoneNo, country, agentCode);
        res.end(JSON.stringify(rows));
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200);
    } catch (err) {
        res.status(404).json({ err });
    } finally {
        if (conn) return conn.release();
    }
});

/**
* @swagger
* /agents/{agentCode}:
*   delete:
*     description: Deletes a single agent.
*     parameters:
*       - in: path
*         name: agentCode
*         required: true
*         description: string agent code.
*         schema:
*           type: string
*     responses:
*       200:
*         description: deletes agent data
*/
app.delete('/agents/:agentCode', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        var agentCode = req.params.agentCode;
        var query = `DELETE FROM agents WHERE AGENT_CODE='${agentCode}'`;
        const result = await conn.query(query, agentCode);
        console.log('query executed');
        if(result.affectedRows) {
       
        console.log(`${result.affectedRows} Records deleted successfully`);
        res.end(`${result.affectedRows} Records deleted successfully`);
        }
        res.end('No matching records to delete');
    } catch (err) {
	res.status(404).json({err});
   }
     finally {
       if (conn) return conn.release();
     }
});

app.get('/say', (req, res) => {
    let keyword = req.query.keyword;
    axios
  .get('https://us-central1-handy-droplet-342518.cloudfunctions.net/my-function?keyword='+keyword)
  .then(functionResponse => {
    console.log(functionResponse.data);
    res.status(200).send(functionResponse.data);
  })
  .catch(error => {
    console.error(error)
  });
});


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});
