const express = require('express')
const app = express()
require("dotenv").config();
const cookieParser=require("cookie-parser")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
require("./config/db")
const port = process.env.PORT
const UserRoute=require("./routes/user.route")
const ExpenseRoute=require("./routes/expense.route")
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Expense Tracker API',
        version: '1.0.0',
        description: 'API for managing expenses',
    },
    servers: [
        {
            url: 'http://localhost:2000/api', // Replace with your API base URL
        },
    ],
};

// Options for Swagger JSDoc
const options = {
    swaggerDefinition,
    // Path to the API docs
    apis: ['./routes/user.route.js', './routes/expense.route.js'], // Path where API routes are defined
};

// Initialize SwaggerJSDoc
const swaggerSpec = swaggerJsdoc(options);

// Use Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/auth",UserRoute)
app.use("/api/v2/expense",ExpenseRoute)


app.get("/",(req,res)=>{
    res.send("<center><h1>Expense_Tracker_App All apis</h1><br>Get All Apis Use My Link <a href=https://github.com/Kotak111/Expense_Tracker target=_blank>Repository :- Expense_Tracker</a></center>")
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))