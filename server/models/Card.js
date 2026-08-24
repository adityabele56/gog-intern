import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    cardType: {
      type: String,
      enum: ['Employee', 'Student'],
      default: 'Employee'
    },
    fullName: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true
    },
    fatherName: {
      type: String,
      default: ''
    },
    motherName: {
      type: String,
      default: ''
    },
    dob: {
      type: String,
      required: [true, 'Date of Birth is required']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male'
    },
    bloodGroup: {
      type: String,
      default: 'O+'
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    country: {
      type: String,
      default: 'USA'
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required']
    },
    // Employee Specific Fields
    company: {
      type: String,
      default: ''
    },
    department: {
      type: String,
      default: ''
    },
    designation: {
      type: String,
      default: ''
    },
    employeeId: {
      type: String,
      default: ''
    },
    // Student Specific Fields
    college: {
      type: String,
      default: ''
    },
    course: {
      type: String,
      default: ''
    },
    branch: {
      type: String,
      default: ''
    },
    semester: {
      type: String,
      default: ''
    },
    rollNumber: {
      type: String,
      default: ''
    },
    joiningDate: {
      type: String,
      default: ''
    },
    photo: {
      type: String,
      default: ''
    },
    signature: {
      type: String,
      default: ''
    },
    companyLogo: {
      type: String,
      default: ''
    },
    qrCode: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const Card = mongoose.model('Card', cardSchema);
export default Card;
