import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    session_date: {
      type: Date,
      required: true,
    },
    session_time: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["completed", "interrupted", "paused"],
      default: "completed",
    },
  },
  { timestamps: true }
);
const Session = mongoose.model("Session", sessionSchema);

export default Session;
