const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Parsing middleware
app.use(bodyParser.json());

app.use(express.static('public'));

// DB configuration
const config = {
    user: 'todolistadmin',
    password: 'DG@a4r6w798',
    server: 'todolistsever.database.windows.net', 
    database: 'todolistdatabase',
    options: {
        encrypt: true,
        trustServerCertificate: false 
    }
};

// Connect to your database
sql.connect(config, function (err) {
    if (err) console.log(err);
});

// Get todo items
app.get('/todo', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM TodoItems');
        res.json(result.recordset);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

// Add a new todo item
app.post('/todo', async (req, res) => {
    try {
        let { description, isCompleted, dueDate } = req.body;
        let pool = await sql.connect(config);
        await pool.request()
            .input('Description', sql.NVarChar, description)
            .input('IsCompleted', sql.Bit, isCompleted)
            .input('DueDate', sql.DateTime, dueDate)
            .query('INSERT INTO TodoItems (Description, IsCompleted, DueDate) VALUES (@Description, @IsCompleted, @DueDate)');
        res.status(201).send('Item added');
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

// Update a todo item (mark as done/undone)
app.put('/todo/:id', async (req, res) => {
    try {
        const { isCompleted } = req.body;
        const { id } = req.params;
        let pool = await sql.connect(config);
        await pool.request()
            .input('ItemID', sql.Int, id)
            .input('IsCompleted', sql.Bit, isCompleted)
            .query('UPDATE TodoItems SET IsCompleted = @IsCompleted WHERE ItemID = @ItemID');
        res.status(200).send('Item updated');
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

// Delete a todo item
app.delete('/todo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let pool = await sql.connect(config);
        await pool.request()
            .input('ItemID', sql.Int, id)
            .query('DELETE FROM TodoItems WHERE ItemID = @ItemID');
        res.status(200).send('Item deleted');
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
