import Card from '../models/Card.js';
import User from '../models/User.js';

// @desc    Get complete dynamic dashboard statistics & aggregations
// @route   GET /api/dashboard
// @access  Private
export const getDashboardData = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    // Dynamic Counts from MongoDB
    const totalUsers = await User.countDocuments();
    const totalCards = await Card.countDocuments();
    const todayCards = await Card.countDocuments({ createdAt: { $gte: todayStart } });
    const thisMonthCards = await Card.countDocuments({ createdAt: { $gte: monthStart } });

    // Recent Lists
    const recentCards = await Card.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Aggregations: Department Distribution
    const departmentDistribution = await Card.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Aggregations: Gender Distribution
    const genderDistribution = await Card.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);

    // Aggregations: Cards Per Month (Last 12 Months)
    const cardsPerMonth = await Card.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Aggregations: Users Per Month
    const usersPerMonth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return res.status(200).json({
      success: true,
      message: 'Dynamic dashboard data retrieved successfully from MongoDB',
      data: {
        summary: {
          totalUsers,
          totalCards,
          todayCards,
          thisMonthCards
        },
        distributions: {
          department: departmentDistribution,
          gender: genderDistribution
        },
        monthlyTrends: {
          cardsPerMonth,
          usersPerMonth
        },
        recent: {
          cards: recentCards,
          users: recentUsers
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const totalUsers = await User.countDocuments();
    const totalCards = await Card.countDocuments();
    const todayCards = await Card.countDocuments({ createdAt: { $gte: todayStart } });
    const thisMonthCards = await Card.countDocuments({ createdAt: { $gte: monthStart } });

    return res.status(200).json({
      success: true,
      message: 'Dashboard metrics retrieved',
      data: {
        totalUsers,
        totalCards,
        todayCards,
        thisMonthCards
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent activities (cards & users)
// @route   GET /api/dashboard/recent
// @access  Private
export const getRecentActivities = async (req, res, next) => {
  try {
    const recentCards = await Card.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email');

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      message: 'Recent activities retrieved',
      data: {
        cards: recentCards,
        users: recentUsers
      }
    });
  } catch (error) {
    next(error);
  }
};
