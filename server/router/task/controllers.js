import mongoose from "mongoose";
import Task from "../../models/task.js";
import Session from "../../models/session.js";

// create new task
const createNewTask = async (req, res) => {
  try {
    const { title, description, startDate, targetDate, priority, duration } =
      req.body;

    if (!title || !startDate || !targetDate) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const newTask = new Task({
      user_id: req.userId,
      title,
      description,
      category: "General",
      start_date: startDate,
      end_date: targetDate,
      duration: Number(duration) || 25,
      priority: priority.toLowerCase(),
    });

    const savedTask = await newTask.save();

    res.status(201).json({
      message: "Task created successfully",
      task: savedTask,
    });
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(400).json({
      message: error.message,
    });
  }
};

// get all tasks
const getAllTasks = async (req, res) => {
  const { where } = req?.body ?? {};
  try {
    // find the session for today and return tasks accordingly
    const sessions = await Session.find({
      session_date: new Date().toISOString().split("T")[0],
    });

    const tasks = await Task.find({ ...where, user_id: req.userId }).sort({
      createdAt: -1,
    });
    const formattedTasks = tasks.map((task) => ({
      id: task._id,
      title: task.title,
      description: task.description,
      start_date: new Date(task.start_date).toISOString().split("T")[0],
      end_date: new Date(task.end_date).toISOString().split("T")[0],
      priority: task.priority,
      duration: task.duration,
    }));

    // add new field named session_status to each task from sessions if session exists for the task
    formattedTasks.forEach((task) => {
      const session = sessions.find(
        (s) => s.task_id.toString() === task.id.toString(),
      );
      task.session_status = session?.status ? session.status : "idle";
    });

    res.status(200).json(formattedTasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update existing task
const updateTask = async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      startDate,
      targetDate,
      priority,
      duration,
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Task id is required" });
    }

    const task = await Task.findOne({ _id: id, user_id: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (startDate !== undefined) task.start_date = startDate;
    if (targetDate !== undefined) task.end_date = targetDate;
    if (priority !== undefined) task.priority = priority.toLowerCase();
    if (duration !== undefined)
      task.duration = Number(duration) || task.duration;

    const updatedTask = await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export { createNewTask, getAllTasks, updateTask };
