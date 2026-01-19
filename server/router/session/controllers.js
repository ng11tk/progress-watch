import Session from "../../models/session.js";

const createNewSession = async (req, res) => {
  const { task_id, session_date, session_time, status } = req.body;

  if (!task_id || !session_date || !session_time || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const newSession = new Session({
      user_id: req.userId,
      task_id,
      session_date,
      session_time,
      status,
    });

    // check if session is already present for the task_id and session_date and status is not completed
    const existingSession = await Session.findOne({
      user_id: req.userId,
      task_id,
      session_date,
      status: { $ne: "completed" },
    });
    if (existingSession) {
      // update the existing session
      existingSession.session_time = session_time;
      existingSession.status = status;
      const updatedSession = await existingSession.save();
      return res.status(200).json({
        message: "Session updated successfully",
        session: updatedSession,
      });
    }

    const savedSession = await newSession.save();

    res
      .status(201)
      .json({ message: "Session created successfully", session: savedSession });
  } catch (error) {
    console.error("Create Session Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// get sessions by task_id
const getSessionsByTaskId = async (req, res) => {
  const { task_id } = req.query;
  try {
    const sessions = await Session.find({ task_id, user_id: req.userId });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get all sessions for user
const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.userId }).sort({
      session_date: -1,
    });
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Get All Sessions Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// update session
const updateSession = async (req, res) => {
  const { task_id, session_date, status } = req.body;

  if (!task_id || !session_date || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const session = await Session.findOne({
      user_id: req.userId,
      task_id,
      session_date,
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    session.status = status;
    const updatedSession = await session.save();
    res.status(200).json({
      message: "Session updated successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Update Session Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export { createNewSession, getSessionsByTaskId, getAllSessions, updateSession };
