import rentals from '../../mock/rentals.json';

export default function handler(req, res) {
  res.status(200).json(rentals);
} 