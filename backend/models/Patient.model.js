import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    nic: { type: String, required: true, trim: true, unique: true, index: true },
    phone: { type: String, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
    dob: { type: Date }, // store as Date
  },
  { timestamps: true }
);

// Helpful compound/text-ish indexes for quick search
PatientSchema.index({ name: "text", nic: "text", phone: "text" });

export default mongoose.model("Patient", PatientSchema);
