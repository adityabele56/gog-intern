import jwt from 'jsonwebtoken';

export const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'id_card_generator_jwt_secret_key_2026_production_clean',
    { expiresIn: '30d' }
  );
};
