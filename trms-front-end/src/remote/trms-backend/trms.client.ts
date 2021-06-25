import axios from 'axios';
import User from '../../models/user';

export const common = {
  baseURL: process.env.REACT_APP_ENVIRONMENT === 'local' ? 'http://localhost:4000' : process.env.TRMS_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

const client = axios.create({
  ...common,
});

export const sendLogin = async (username: string, password: string): Promise<User> => {
  const {data: user} = await client.post<User>('/login', {
    username,
    password,
  });

  return user;
};

export default client;