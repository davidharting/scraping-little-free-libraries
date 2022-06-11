import axios from 'axios';

// https://appapi.littlefreelibrary.org/library/pin.json?page_size=50&distance=50&near=indiana

export const getLibraryIndex = async () => {
  const response = await axios.get(
    'https://appapi.littlefreelibrary.org/library/pin.json',
    { params: { page_size: 500, distance: 50, near: 'indiana' } }
  );
  console.log(JSON.stringify(response));
};
