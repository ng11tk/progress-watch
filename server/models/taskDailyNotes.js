import mongoose from "mongoose";

const taskDailyNotesSchema = new mongoose.Schema(
  {
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    note_date: {
      type: Date,
      required: true,
    },
    today_learnings: {
      type: String,
      required: true,
      default: "",
    },
    tomorrow_plans: {
      type: String,
      required: false,
      default: "",
    },
    blockers: {
      type: String,
      required: false,
      default: "",
    },
  },
  { timestamps: true }
);

const TaskDailyNotes = mongoose.model("TaskDailyNotes", taskDailyNotesSchema);

export default TaskDailyNotes;
