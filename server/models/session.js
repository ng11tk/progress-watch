import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
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
      enum: ["completed", "finished", "interrupted", "paused"],
      default: "finished",
    },
  },
  { timestamps: true }
);

// Indexes for query optimization
sessionSchema.index({ user_id: 1, session_date: 1 });
sessionSchema.index({ task_id: 1, session_date: 1 });

const Session = mongoose.model("Session", sessionSchema);

export default Session;
