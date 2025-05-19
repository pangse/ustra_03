import users from '../../mock/users.json';

export default function handler(req, res) {
  res.status(200).json(users);
} 