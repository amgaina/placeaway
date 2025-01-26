'use server';
import { Client } from '@googlemaps/google-maps-services-js';

const client = new Client({});

const autocomplete = async (input: string) => {
  try {
    // Ensure the environment variable is properly loaded
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('Google API key is missing');
    }

    const response = await client.placeAutocomplete({
      params: {
        input,
        key: process.env.GOOGLE_API_KEY!,
      },
    });
    return response.data.predictions;
  } catch (error) {
    console.error('Error fetching autocomplete results:', error);
    throw new Error('Error fetching autocomplete results');
  }
};

export default autocomplete;
