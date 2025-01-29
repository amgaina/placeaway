// pages/api/location.ts
import { NextApiRequest, NextApiResponse } from 'next';

interface LocationData {
  latitude: number;
  longitude: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { latitude, longitude } = req.body as LocationData;

    res.status(200).json({
      message: 'Location received successfully!',
      latitude,
      longitude,
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
