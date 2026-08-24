import Card from '../models/Card.js';
import { generateEmployeeId } from '../utils/generateEmployeeId.js';
import { generateQRCode } from '../utils/generateQRCode.js';

// @desc    Create new ID Card (Employee or Student)
// @route   POST /api/cards
// @access  Private
export const createCard = async (req, res, next) => {
  try {
    const {
      cardType = 'Employee',
      fullName,
      fatherName,
      motherName,
      dob,
      gender,
      bloodGroup,
      mobile,
      email,
      address,
      city,
      state,
      country,
      pincode,
      company,
      department,
      designation,
      college,
      course,
      branch,
      semester,
      rollNumber,
      joiningDate
    } = req.body;

    if (!fullName || !dob || !mobile || !email || !address || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required personal and address fields',
        data: null
      });
    }

    if (cardType === 'Employee' && (!company || !department || !designation)) {
      return res.status(400).json({
        success: false,
        message: 'Please fill Company, Department, and Designation for Employee ID card',
        data: null
      });
    }

    if (cardType === 'Student' && (!college || !course || !rollNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please fill College, Course, and Roll Number for Student ID card',
        data: null
      });
    }

    // Auto-generate Unique Employee ID or use Roll Number
    let employeeId = req.body.employeeId || rollNumber || '';
    if (!employeeId) {
      employeeId = await generateEmployeeId();
    }

    // File Upload Paths
    let photo = '';
    let signature = '';
    let companyLogo = '';

    if (req.files) {
      if (req.files.photo && req.files.photo[0]) {
        photo = `/uploads/${req.files.photo[0].filename}`;
      }
      if (req.files.signature && req.files.signature[0]) {
        signature = `/uploads/${req.files.signature[0].filename}`;
      }
      if (req.files.companyLogo && req.files.companyLogo[0]) {
        companyLogo = `/uploads/${req.files.companyLogo[0].filename}`;
      }
    }

    if (!photo && req.body.photo) photo = req.body.photo;
    if (!signature && req.body.signature) signature = req.body.signature;
    if (!companyLogo && req.body.companyLogo) companyLogo = req.body.companyLogo;

    // Create Mongoose Document
    const card = new Card({
      userId: req.user._id,
      cardType,
      fullName,
      fatherName: fatherName || '',
      motherName: motherName || '',
      dob,
      gender: gender || 'Male',
      bloodGroup: bloodGroup || 'O+',
      mobile,
      email,
      address,
      city,
      state,
      country: country || 'USA',
      pincode,
      company: company || '',
      department: department || '',
      designation: designation || '',
      employeeId,
      college: college || '',
      course: course || '',
      branch: branch || '',
      semester: semester || '',
      rollNumber: rollNumber || '',
      joiningDate: joiningDate || '',
      photo,
      signature,
      companyLogo
    });

    // Auto-generate QR Code containing all card details except password
    const qrCodePath = await generateQRCode(card);
    card.qrCode = qrCodePath;

    await card.save();

    return res.status(201).json({
      success: true,
      message: 'ID Card created successfully',
      data: card
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all ID cards with multi-field search, filter, sort & pagination
// @route   GET /api/cards
// @access  Private
export const getCards = async (req, res, next) => {
  try {
    const {
      search,
      department,
      company,
      college,
      cardType,
      gender,
      bloodGroup,
      date,
      sort = 'latest',
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // Search by Name, Employee ID, Roll Number, Phone, Department, Company, College, Course, Branch
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { fullName: searchRegex },
        { employeeId: searchRegex },
        { rollNumber: searchRegex },
        { mobile: searchRegex },
        { email: searchRegex },
        { department: searchRegex },
        { company: searchRegex },
        { college: searchRegex },
        { course: searchRegex },
        { branch: searchRegex },
        { designation: searchRegex }
      ];
    }

    // Filter Controls
    if (cardType && cardType !== 'All') query.cardType = cardType;
    if (department && department !== 'All') query.department = department;
    if (company && company !== 'All') query.company = company;
    if (college && college !== 'All') query.college = college;
    if (gender && gender !== 'All') query.gender = gender;
    if (bloodGroup && bloodGroup !== 'All') query.bloodGroup = bloodGroup;

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }

    // Sort Options
    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'alphabetical') {
      sortOptions = { fullName: 1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalCards = await Card.countDocuments(query);
    const cards = await Card.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('userId', 'name email');

    return res.status(200).json({
      success: true,
      message: 'ID Cards retrieved successfully',
      data: {
        cards,
        pagination: {
          totalCards,
          currentPage: pageNum,
          totalPages: Math.ceil(totalCards / limitNum),
          limit: limitNum
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single ID Card by ID
// @route   GET /api/cards/:id
// @access  Private
export const getCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id).populate('userId', 'name email');
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'ID Card not found',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'ID Card retrieved successfully',
      data: card
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ID Card
// @route   PUT /api/cards/:id
// @access  Private
export const updateCard = async (req, res, next) => {
  try {
    let card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'ID Card not found',
        data: null
      });
    }

    // File Upload updates
    if (req.files) {
      if (req.files.photo && req.files.photo[0]) {
        req.body.photo = `/uploads/${req.files.photo[0].filename}`;
      }
      if (req.files.signature && req.files.signature[0]) {
        req.body.signature = `/uploads/${req.files.signature[0].filename}`;
      }
      if (req.files.companyLogo && req.files.companyLogo[0]) {
        req.body.companyLogo = `/uploads/${req.files.companyLogo[0].filename}`;
      }
    }

    card = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Re-generate QR Code with complete updated card attributes
    card.qrCode = await generateQRCode(card);
    await card.save();

    return res.status(200).json({
      success: true,
      message: 'ID Card updated successfully',
      data: card
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete ID Card
// @route   DELETE /api/cards/:id
// @access  Private
export const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'ID Card not found',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'ID Card deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
