// pages/api/location.ts
import { NextApiRequest, NextApiResponse } from 'next';

interface LocationData {
  latitude: number;
  longitude: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { latitude, longitude } = req.body as LocationData;

    // You can process the location data here (e.g., save to a database)
    console.log('Received location:', { latitude, longitude });

    // Send a response back to the client
    res
      .status(200)
      .json({
        message: 'Location received successfully!',
        latitude,
        longitude,
      });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
