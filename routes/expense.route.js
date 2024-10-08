const ExpenseController=require("../controller/expense.contoller");
const { auth, IsUser, IsAdmin } = require("../utils/auth");
const router=require("express").Router();
const upload=require("../utils/multer")

/**
 * @swagger
 * /expenses/createExpense:
 *   post:
 *     summary: Create a new expense
 *     description: Create a new expense entry for a user
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 50
 *               date:
 *                 type: string
 *                 example: "2024-10-09"
 *               category:
 *                 type: string
 *                 example: "Groceries"
 *               paymentMethod:
 *                 type: string
 *                 enum: ['Credit Card', 'Cash', 'Debit Card', 'Bank Transfer']
 *                 example: "Credit Card"
 *               description:
 *                 type: string
 *                 example: "Shopping for groceries"
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/createExpense",auth,IsUser,ExpenseController.createExpense)

/**
 * @swagger
 * /expenses/bulk-upload:
 *   post:
 *     summary: Bulk upload expenses from CSV
 *     description: Upload multiple expenses via a CSV file
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Expenses uploaded successfully
 *       400:
 *         description: Bad Request
 */

//bulk data upload 
router.post('/bulk-upload', auth,IsUser,upload.single('file'), ExpenseController.bulkUploadExpenses);


/**
 * @swagger
 * /expenses/getall:
 *   get:
 *     summary: Get all expenses
 *     description: Retrieve all expenses without filtering or sorting.
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: Successfully retrieved all expenses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 *       401:
 *         description: Unauthorized
 */
//get all data without any filtering and sorting
router.get("/getall",auth,IsUser,ExpenseController.GetAllData)

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get filtered and sorted expenses
 *     description: Retrieve expenses with optional filtering by category, date, and payment method. Supports sorting by amount and date.
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (e.g., Groceries, Transport)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter expenses from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter expenses up to this date
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *         description: Filter by payment method (e.g., Credit Card, Cash)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [amount, date]
 *         description: Sort expenses by amount or date
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered and sorted expenses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 *       401:
 *         description: Unauthorized
 */
//get with sorting and filtering 
router.get("/",auth,IsUser,ExpenseController.getExpenses)

/**
 * @swagger
 * /expenses/{id}:
 *   patch:
 *     summary: Update an expense
 *     description: Update a specific expense by providing partial or full data.
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Expense ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               paymentMethod:
 *                 type: string
 *                 enum: [Credit Card, Cash, Debit Card, Bank Transfer]
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated the expense.
 *       400:
 *         description: Invalid data.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Expense not found
 */
//update a document
router.patch("/:id",auth,IsUser,ExpenseController.updateExpense)

/**
 * @swagger
 * /expenses/bulk-delete:
 *   delete:
 *     summary: Bulk delete expenses
 *     description: Delete multiple expenses by their IDs.
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of expense IDs to delete
 *     responses:
 *       200:
 *         description: Successfully deleted expenses.
 *       400:
 *         description: Invalid data.
 *       401:
 *         description: Unauthorized
 */
//bulk data delete
router.delete('/expenses/bulk-delete', auth,IsUser,ExpenseController.bulkDeleteExpenses);

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete a single expense
 *     description: Delete a specific expense by its ID.
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Expense ID to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the expense.
 *       404:
 *         description: Expense not found.
 *       401:
 *         description: Unauthorized
 */
//single data deleted
router.delete("/:id",auth,IsUser,ExpenseController.SingleDelete);


module.exports=router;