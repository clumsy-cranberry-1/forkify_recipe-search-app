import { TIMEOUT_MS } from "./config.js";

const timeout = function (ms) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(
          `Connection request time-out. The requested site did not respond to a connection request. Please wait a few minutes and try again.`
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
      throw new Error('Sorry, something went wrong. Please wait a few minutes and try again.');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// POST data (new recipe) to API
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
      throw new Error('Sorry, something went wrong. Please wait a few minutes and try again.');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// DELETE data (recipe) associated with provided API key
export const deleteUserRecipe = async function (url) {
  try {
    const fetchURL = fetch(url, {
      method: 'DELETE'
    });
    const response = await Promise.race([fetchURL, timeout(TIMEOUT_MS)]);
    if (!response.ok && response.status === 400) {
      throw new Error('Sorry, something went wrong. Please wait a few minutes and try again.');
    }
  } catch (error) {
    throw error;
  }
};
