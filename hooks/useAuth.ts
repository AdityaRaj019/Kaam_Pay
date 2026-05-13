import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AuthService, LoginPayload, RegisterPayload } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (data: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(data);
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.token);
        toast.success('Logged in successfully!');
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      let message = 'Failed to login';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.register(data);
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.token);
        toast.success('Account created successfully!');
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      let message = 'Failed to register';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, register, isLoading, error };
};
