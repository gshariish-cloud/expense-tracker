const Expense = require("../models/Expense");

// Add Expense
exports.addExpense = async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Expense
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      message: "Expense Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dashboard Summary
exports.getSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user.id,
    });

    const totalExpense = expenses.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    res.json({
      totalExpense,
      totalTransactions: expenses.length,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};