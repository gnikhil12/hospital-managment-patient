const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");


exports.createPatient = async (req, res) => {
  try {
    // Get today's date (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    // Generate appointment number
    const appointment_number = Date.now().toString();

    // Count today's appointments before creating the patient
    const existingPatients = await Patient.countDocuments({
      Date: today,
    });

    // Assign the next virtual queue number
    const your_virtual_queue_number = existingPatients + 1;

    // Create patient
    const patient = await Patient.create({
      ...req.body,
      appointment_number,
      your_virtual_queue_number,
    });

    // Send response
    return res.status(201).json({
      ...patient.toObject(),
      appointment_number,
      your_virtual_queue_number,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
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


// READ single patient - today's appointment
exports.getPatient_todays_appointment = async (req, res) => {
  try {
    const number = req.body.number;
    console.log(number)

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Find today's appointment for this patient
    const patient = await Patient.findOne({
      contact: number,
      Date: today,
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found for today's appointment",
      });
    }

    // Count patients attended today
    const attendedPatients = await Patient.countDocuments({
      Status: "Attended",
      Date: today,
    });

    // Current queue number
    const current_queue_number = attendedPatients + 1;

    // Return patient details and queue information
    return res.status(200).json({
      ...patient.toObject(),
      appointment_number: patient.appointment_number,
      your_virtual_queue_number: patient.your_virtual_queue_number,
      current_queue_number,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
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
