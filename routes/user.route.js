const Usercontroller=require("../controller/user.controller")

const router=require("express").Router();
/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     description: Sign up a new user with username, email, and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid data
 */
router.post("/signup",Usercontroller.create)

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     description: Log in a user and return a JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post("/login",Usercontroller.login)

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: User logout
 *     description: Log out the currently authenticated user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post("/logout",Usercontroller.logout)

module.exports=router;