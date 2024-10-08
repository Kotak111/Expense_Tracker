const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Cash', 'Debit Card', 'Bank Transfer'],  
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
},{timestamps:true});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports=Expense;
