import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@bl_test_user';
const USERS_KEY = '@bl_test_users';

export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    return true;
  } catch (e) {
    console.log('Error saving user:', e);
    return false;
  }
};

export const getStoredUser = async () => {
  try {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.log('Error getting user:', e);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    return true;
  } catch (e) {
    console.log('Error removing user:', e);
    return false;
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const existingData = await AsyncStorage.getItem(USERS_KEY);
    const users = existingData ? JSON.parse(existingData) : [];

    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

    const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    await saveUser(safeUser);

    return { success: true, user: safeUser };
  } catch (e) {
    console.log('Error registering user:', e);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
};

export const loginUser = async (email, password) => {
  try {
    const existingData = await AsyncStorage.getItem(USERS_KEY);
    const users = existingData ? JSON.parse(existingData) : [];

    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (!found) {
      return { success: false, error: 'Invalid email or password' };
    }

    const safeUser = { id: found.id, name: found.name, email: found.email };
    await saveUser(safeUser);

    return { success: true, user: safeUser };
  } catch (e) {
    console.log('Error logging in:', e);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
};
