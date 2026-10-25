const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");


// CREATE patient
exports.createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);

    // Get all patients
    const patients = await Patient.find();

    // Appointment number
    const appointment_number = patient?._id.toString() || patient?.id.toString();

    // Virtual queue number
    const your_virtual_queue_number = patients.length;

    // Get today's date (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    // Count patients attended today
    const attendedPatients = await Patient.countDocuments({
      Status: "Attended",
      Date: today,
    });

    // Current queue number
    const current_queue_number = attendedPatients + 1;

    // Send response with additional keys
    res.status(201).json({
      ...patient.toObject(),
      appointment_number,
      your_virtual_queue_number,
      current_queue_number,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ all patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ single patient
exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE patient
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE patient
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
