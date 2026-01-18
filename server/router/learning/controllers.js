import TaskDailyNotes from "../../models/taskDailyNotes.js";

const createDailyNotes = async (req, res) => {
  try {
    const { task_id, note_date, today_learnings, tomorrow_plans, blockers } =
      req.body;
    if (!task_id || !note_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newNotes = new TaskDailyNotes({
      user_id: req.userId,
      task_id,
      note_date,
      today_learnings,
      tomorrow_plans,
      blockers,
    });

    const savedNotes = await newNotes.save();

    res.status(201).json({
      message: "Daily notes created successfully",
      notes: savedNotes,
    });
  } catch (error) {
    console.error("Create Daily Notes Error:", error);
    res.status(400).json({ message: error.message });
  }
};

const getAllDailyNotes = async (req, res) => {
  try {
    const notes = await TaskDailyNotes.find({ user_id: req.userId }).sort({
      note_date: -1,
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Get Daily Notes Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export { createDailyNotes, getAllDailyNotes };
