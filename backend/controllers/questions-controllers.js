const { validationResult } = require("express-validator");
const mongoose = require('mongoose');

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Question = require("../models/question");

const getQuestions = async (req, res, next) => {
  let questions;
  try {
    // Populate the userId field with the username from the User model
    questions = await Question.find().populate('userId', 'username'); 
  } catch (err) {
    const error = new HttpError(
      "Fetching questions failed, please try again later.",
      500
    );
    return next(error);
  }

  // Map through the questions and convert to plain objects
  res.json({
    questions: questions.map((question) => 
      question.toObject({ getters: true })
    ).map(q => ({
      ...q, // Spread the original question properties
      userId: q.userId.username // Replace userId with the actual username
    })),
  });
};

const getUserQuestions = async (req, res, next) => {
  const username = req.params.username;
  console.log(username);

  let questions;

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      res.json({ error: "User does not exist" });
      return;
    }

    questions = await Question.find({ userId: user._id });
  } catch (err) {
    const error = new HttpError(
      "Fetching user's questions failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    questions: questions.map((question) =>
      question.toObject({ getters: true })
    ),
  });
};

const createUserQuestion = async (req, res, next) => {
  const { question, category, answer } = req.body;
  console.log(req.body);
  const username = req.params.username;

  if(category==="Error"){
    return res.status(404).json({ error: "Enter valid Mathematics Question!!!" });
  }

  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(404).json({ error: "User does not exist" });
  }

  if (!question || !category) {
    return res.status(400).json({ error: "Question and category are required" });
  }

  const createdQuestion = new Question({
    userId: user._id,
    question,
    category,
    answer: answer || null, // Include answer if provided
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  try {
    await createdQuestion.save();
  } catch (err) {
    const error = new HttpError("Creating question failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ question: createdQuestion.toObject({ getters: true }) });
};

const getQuestionById = async (req, res) => {
  const questionId = req.params.id;

  // Validate ObjectId to avoid CastError 500s
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({ error: 'Invalid question id.' });
  }

  try {
    // Find the question by ID
    const question = await Question.findById(questionId).populate('userId', 'username');

    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    const questionObj = question.toObject({ getters: true });
    questionObj.userId = questionObj.userId.username;

    res.json({ 
      question: questionObj, 
      answers: question.answers 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching question.' });
  }
};

exports.getQuestionById = getQuestionById;
exports.getQuestions = getQuestions;
exports.getUserQuestions = getUserQuestions;
exports.createUserQuestion = createUserQuestion;
/**
 * Delete question by id, only if the requester owns it.
 * Expects auth cookie (users-controllers.isAuth already used on other routes),
 * but since questions routes are not protected here, do a server-side ownership check via username param if provided later.
 */
exports.deleteQuestion = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid question id.' });
  }
  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    // Identify current user from JWT cookie if available
    // This controller doesn't have direct access to decoded user; fetch via request email from token handled elsewhere.
    // Instead, accept a query param ?username=<owner> to verify ownership minimally.
    const username = req.query.username;
    if (!username) {
      return res.status(401).json({ error: 'Unauthorized: username required' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (String(question.userId) !== String(user._id)) {
      return res.status(403).json({ error: 'Forbidden: not owner' });
    }

    await Question.findByIdAndDelete(id);
    return res.json({ message: 'Question removed.' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error while deleting question.' });
  }
};