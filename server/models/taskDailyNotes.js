import mongoose from "mongoose";

const taskDailyNotesSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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

// Indexes for query optimization
taskDailyNotesSchema.index({ user_id: 1, note_date: 1 });
taskDailyNotesSchema.index({ task_id: 1, note_date: 1 });

const TaskDailyNotes = mongoose.model("TaskDailyNotes", taskDailyNotesSchema);

export default TaskDailyNotes;
