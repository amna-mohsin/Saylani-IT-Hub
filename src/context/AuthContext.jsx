import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        toast.error('Invalid email or password');
        return false;
      }

      // Simple password check
      if (data.password !== password) {
        toast.error('Invalid email or password');
        return false;
      }

      // Remove password before storing
      const { password: _, ...userWithoutPassword } = data;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', userData.email)
        .maybeSingle();

      if (existingUser) {
        toast.error('Email already registered');
        return false;
      }

      // Insert new user with correct column names
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          full_name: userData.username,
          email: userData.email,
          password: userData.password,
          roll_no: userData.rollNo,
          course: userData.course,
          phone: userData.phone || null,
          role: 'student',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        toast.error(error.message || 'Signup failed');
        return false;
      }

      // Remove password before storing
      const { password: _, ...userWithoutPassword } = data;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed: ' + error.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};