import { TIMEOUT_MS } from "./config.js";

const timeout = function (ms) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(
          `Connection Request Time-out. The requested site did not respond to a connection request. Please wait a few moments and try again.`
        )
      );
    }, ms);
  });
};

// GET data from API
export const getJSON = async function (url) {
  try {
    const fetchURL = fetch(url);
    const response = await Promise.race([fetchURL, timeout(TIMEOUT_MS)]);
    if (!response.ok && response.status === 400) {
      throw new Error('Something went wrong!');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// POST data to API
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchURL = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const response = await Promise.race([fetchURL, timeout(TIMEOUT_MS)]);
    if (!response.ok && response.status === 400) {
      throw new Error('Something went wrong!');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};