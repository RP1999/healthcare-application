import Patient from "../models/Patient.model.js";

// GET /api/patients?search=&page=1&limit=10&sort=createdAt&order=desc
export const listPatients = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || "10", 10)));
    const skip = (page - 1) * limit;

    const search = (req.query.search || "").trim();

    // optional sort params (default: createdAt desc)
    const sortField = (req.query.sort || "createdAt").toString();
    const sortOrderRaw = (req.query.order || "desc").toString().toLowerCase();
    const sortOrder = sortOrderRaw === "asc" ? 1 : -1; // only 1 or -1

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { nic: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      Patient.find(query)
        .sort({ [sortField]: sortOrder }) // ✅ valid sort
        .skip(skip)
        .limit(limit),
      Patient.countDocuments(query),
    ]);

    res.json({ data, total, page, limit });
  } catch (err) {
    console.error("listPatients error:", err);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

// GET /api/patients/:id
export const getPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json({ data: patient });
  } catch (err) {
    console.error("getPatient error:", err);
    res.status(500).json({ message: "Failed to fetch patient" });
  }
};

// POST /api/patients
export const createPatient = async (req, res) => {
  try {
    const { name, nic, phone, gender, dob } = req.body;

    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
    if (!nic?.trim()) return res.status(400).json({ message: "NIC is required" });

    const existing = await Patient.findOne({ nic: nic.trim() });
    if (existing) return res.status(409).json({ message: "NIC already exists" });

    const patient = await Patient.create({
      name: name.trim(),
      nic: nic.trim(),
      phone: phone?.trim() || "",
      gender: gender || "Male",
      dob: dob ? new Date(dob) : undefined,
    });

    res.status(201).json({ data: patient });
  } catch (err) {
    console.error("createPatient error:", err);
    res.status(500).json({ message: "Failed to create patient" });
  }
};

// PUT /api/patients/:id
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nic, phone, gender, dob } = req.body;

    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    if (nic && nic.trim() !== patient.nic) {
      const exists = await Patient.findOne({ nic: nic.trim() });
      if (exists) return res.status(409).json({ message: "NIC already exists" });
    }

    patient.name = name !== undefined ? name.trim() : patient.name;
    patient.nic = nic !== undefined ? nic.trim() : patient.nic;
    patient.phone = phone !== undefined ? phone.trim() : patient.phone;
    patient.gender = gender !== undefined ? gender : patient.gender;
    patient.dob = dob !== undefined ? (dob ? new Date(dob) : undefined) : patient.dob;

    await patient.save();
    res.json({ data: patient });
  } catch (err) {
    console.error("updatePatient error:", err);
    res.status(500).json({ message: "Failed to update patient" });
  }
};

// DELETE /api/patients/:id
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("deletePatient error:", err);
    res.status(500).json({ message: "Failed to delete patient" });
  }
};
