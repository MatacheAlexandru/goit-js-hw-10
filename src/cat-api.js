import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_vLZPs1htFpxFA6sIZ0DiQV2DLwX0EBPGJbNXBu8XBIFDFbawQAL9xTMNugdTta1b';

export async function fetchBreeds() {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    return response.data;
  } catch (error) {
    console.error('Error fetching breeds:', error);
    throw error;
  }
}

export async function fetchCatByBreed(breedId) {
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
    );
    return response.data[0];
  } catch (error) {
    console.error('Error fetching cat by breed:', error);
    throw error;
  }
}
