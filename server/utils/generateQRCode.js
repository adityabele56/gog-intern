import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateQRCode = async (cardData, fallbackEmpId, fallbackName) => {
  try {
    let payloadObject = {};

    if (cardData && typeof cardData === 'object') {
      const raw = cardData.toObject ? cardData.toObject() : cardData;
      // Extract all card details cleanly, excluding password and internal mongoose flags
      const { password, __v, userId, photo, signature, companyLogo, qrCode, ...rest } = raw;

      payloadObject = {
        cardType: rest.cardType || 'Employee',
        id: rest._id ? rest._id.toString() : undefined,
        fullName: rest.fullName || fallbackName || '',
        fatherName: rest.fatherName || '',
        motherName: rest.motherName || '',
        dob: rest.dob || '',
        gender: rest.gender || '',
        bloodGroup: rest.bloodGroup || '',
        mobile: rest.mobile || '',
        email: rest.email || '',
        address: rest.address || '',
        city: rest.city || '',
        state: rest.state || '',
        country: rest.country || '',
        pincode: rest.pincode || '',
        // Employee details
        company: rest.company || '',
        department: rest.department || '',
        designation: rest.designation || '',
        employeeId: rest.employeeId || fallbackEmpId || '',
        joiningDate: rest.joiningDate || '',
        // Student details
        college: rest.college || '',
        course: rest.course || '',
        branch: rest.branch || '',
        semester: rest.semester || '',
        rollNumber: rest.rollNumber || ''
      };

      // Filter out empty properties for concise JSON QR scan output
      Object.keys(payloadObject).forEach((key) => {
        if (payloadObject[key] === undefined || payloadObject[key] === '') {
          delete payloadObject[key];
        }
      });
    } else {
      payloadObject = {
        employeeId: fallbackEmpId || 'ID-CREDENTIAL',
        fullName: fallbackName || 'CARDHOLDER'
      };
    }

    const payload = JSON.stringify(payloadObject, null, 2);

    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const identifier = payloadObject.employeeId || payloadObject.rollNumber || 'ID';
    const fileName = `qr-${identifier.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.png`;
    const filePath = path.join(uploadsDir, fileName);

    await QRCode.toFile(filePath, payload, {
      color: {
        dark: '#0F172A',
        light: '#FFFFFF'
      },
      width: 300,
      margin: 1
    });

    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('[QRCode Generator Error]:', error);
    return '';
  }
};
