/* eslint-disable no-useless-catch */
export const API_URL = import.meta.env.VITE_API_URL;

export const setGamePreference = async (userId, preferences) => {
  try {
    await fetch(`${API_URL}/setGamePreference`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, preferences }),
    });
  } catch (error) {
    throw error;
  }
};

export const haveGamePreference = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/haveGamePreference?userId=${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data['preference'];
    }
  } catch (error) {
    throw error;
  }
};


export const getUserGameRating = async (userId, gameId) => {
  try {
    const response = await fetch(`${API_URL}/getUserGameRating?userId=${userId}&gameId=${gameId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const setUserGameRating = async (userId, gameId, rating) => {
  try {
    const response = await fetch(`${API_URL}/setUserGameRating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, gameId, rating }),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const searchGame = async (gameName) => {
  try {
    const response = await fetch(`${API_URL}/searchGame?gameName=${gameName}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};


export const getGameInfo = async (gameId) => {
  try {
    const response = await fetch(`${API_URL}/getGameInfo?gameId=${gameId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const getGameId = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/getGameId?userId=${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/verify`, {
      headers: {
        Authorization: token,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.userId;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const login = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const signup = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const getUserName = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/getUserName?userId=${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const uploadAvatar = async (file, userId) => {
  const formData = new FormData();
  formData.append("avatar", file);
  formData.append("userId", userId);

  try {
    const response = await fetch(`${API_URL}/upload-avatar`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const getAvatar = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/avatar`);
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      return url;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const getUserInfo = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/getUserInfo?userId=${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const modifyUserInfo = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/modifyUserInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

