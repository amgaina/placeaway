// components/LocationComponent.tsx
'use client'; // Mark this component as a Client Component

import { useState, useEffect } from 'react';

interface Location {
  latitude: number;
  longitude: number;
}

const LocationComponent = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  // Fetch the user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setError(error.message);
        },
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Reverse geocode latitude and longitude to get city and country
  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location;

      // Use OpenStreetMap Nominatim API for reverse geocoding
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.address) {
            const city =
              data.address.city || data.address.town || data.address.village;
            const country = data.address.country;
            if (city && country) {
              setAddress(`${city}, ${country}`);
            } else {
              setError('City or country not found in the response.');
            }
          } else {
            setError('No address found in the response.');
          }
        })
        .catch((err) => {
          setError('Error fetching address data.');
          console.error(err);
        });
    }
  }, [location]);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : address ? (
        <>{address}</>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
};

export default LocationComponent;
