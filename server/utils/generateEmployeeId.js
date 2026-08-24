import Card from '../models/Card.js';

export const generateEmployeeId = async () => {
  try {
    const totalCount = await Card.countDocuments();
    const nextNumber = totalCount + 1;
    const padded = String(nextNumber).padStart(6, '0');
    let empId = `EMP${padded}`;

    // Ensure uniqueness
    let exists = await Card.findOne({ employeeId: empId });
    let counter = nextNumber;
    while (exists) {
      counter += 1;
      empId = `EMP${String(counter).padStart(6, '0')}`;
      exists = await Card.findOne({ employeeId: empId });
    }

    return empId;
  } catch (error) {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    return `EMP${randomSuffix}`;
  }
};
