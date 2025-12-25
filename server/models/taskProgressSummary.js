import { TopologyDescriptionChangedEvent } from "mongodb";
import mongoose from "mongoose";

const taskProgressSummarySchema = new mongoose.Schema(
  {
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    total_planed_minutes: {
      type: Number,
      required: true,
      default: 0,
    },
    total_actual_minutes: {
      type: Number,
      required: true,
      default: 0,
    },
    total_sessions: {
      type: Number,
      required: true,
      default: 0,
    },
    completed_sessions: {
      type: Number,
      required: true,
      default: 0,
    },
    days_worked: {
      type: Number,
      required: true,
      default: 0,
    },
    last_worked_date: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

const TaskProgressSummary = mongoose.model(
  "TaskProgressSummary",
  taskProgressSummarySchema
);
export default TaskProgressSummary;
