const Expense = require("../model/expense.model");
const fs=require("fs")
const csv=require("csv-parser")

//create a single Expense 
exports.createExpense = async (req, res) => {
    try {
        const { amount, date, category, paymentMethod, description } = req.body;

        const newExpense = new Expense({
            amount,
            date,
            category,
            paymentMethod,
            description
        });

        await newExpense.save();
        return res.status(201).json({ success: true, message: 'Expense added successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};
// Handle bulk upload of expenses via CSV
exports.bulkUploadExpenses = async (req, res) => {
    try {
      const file = req.file;
  
      if (!file) {
        return res.status(400).json({ success: false, message: 'Please upload a CSV file' });
      }
  
      const expenses = [];
      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (row) => {
          expenses.push(row);
        })
        .on('end', async () => {
          try {
            const insertedExpenses = await Expense.insertMany(expenses);
            return res.status(201).json({
              success: true,
              message: 'Expenses uploaded successfully',
              insertedExpenses,
            });
          } catch (error) {
            console.error('Error inserting expenses:', error);
            return res.status(500).json({ success: false, message: 'Error inserting expenses' });
          }
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

  //get all data without any filtering and sorting

  exports.GetAllData=async(req,res)=>{
    const find=await Expense.find();
    if(find){
        res.json({
            success:true,
            find:find
        })
    }
  }

// - Fetch all expenses with support for: advanced filter //pagination // sorting

exports.getExpenses = async (req, res) => {
    try {
        const { category, startDate, endDate, paymentMethod, sortBy, sortOrder, page, limit } = req.query;

        
        const filter = {};

       
        if (category) {
            filter.category = category;
        }

       
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);  
            if (endDate) filter.date.$lte = new Date(endDate);      
        }

        
        if (paymentMethod) {
            filter.paymentMethod = paymentMethod;
        }

        // Pagination defaults (if not provided in query)
        const currentPage = parseInt(page, 10) || 1;  
        const perPage = parseInt(limit, 10) || 10;    
        const skip = (currentPage - 1) * perPage;

        
        const sortField = sortBy || 'date';  
        const order = sortOrder === 'desc' ? -1 : 1;  

        // Fetch the expenses with filters, sorting, and pagination
        const expenses = await Expense.find(filter)
            .sort({ [sortField]: order })  
            .skip(skip)                    
            .limit(perPage);            

        // Get the total number of expenses
        const totalExpenses = await Expense.countDocuments(filter);

        return res.status(200).json({
            success: true,
            expenses,
            pagination: {
                currentPage,
                perPage,
                totalItems: totalExpenses,
                totalPages: Math.ceil(totalExpenses / perPage),
            },
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;  

       
        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        
        if (updates.amount !== undefined) expense.amount = updates.amount;
        if (updates.date !== undefined) expense.date = updates.date;
        if (updates.category !== undefined) expense.category = updates.category;
        if (updates.paymentMethod !== undefined) expense.paymentMethod = updates.paymentMethod;
        if (updates.description !== undefined) expense.description = updates.description;

        // Save the updated expense
        const updatedExpense = await expense.save();

        return res.status(200).json({
            success: true,
            message: 'Expense updated successfully',
            updatedExpense,
        });
    } catch (error) {
        console.error('Error updating expense:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
exports.bulkDeleteExpenses = async (req, res) => {
    try {
        const { ids } = req.body; 

        
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide an array of expense IDs' });
        }

       
        const result = await Expense.deleteMany({ _id: { $in: ids } });

        return res.status(200).json({
            success: true,
            message: `${result.deletedCount} expenses deleted successfully`,
        });
    } catch (error) {
        console.error('Error deleting expenses:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

//delete a single data
exports.SingleDelete = async(req,res)=>{
    try {
        const id=req.params.id;
        const find= await Expense.findByIdAndDelete(id);
        if(!find){
            res.status(404).json({
                success:false,
                message:"No Id and data found"
            })
        }
        res.status(200).json({
            success:true,
            message:"Data Is Deleted"
        })
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            success:false,
            message:"Internal Serever Error"
        })
    }
}