import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://hospital-management-backend-zlyb.onrender.com/auth/login', {
        email,
        password,
      });

      const { token, role } = response.data;

      // Store token and role
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Redirect based on role
      if (role === 'manager') {
        navigate('/manager-dashboard');
      } else if (role === 'pantry') {
        navigate('/pantry-dashboard');
      } else if (role === 'delivery') {
        navigate('/delivery-dashboard');
      } else {
        navigate('/'); // Default fallback
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="w-80 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className='ml-24'>Login</Button>
      </form>
      <div className=' mt-2 items-center ml-12'>
      <div>Dont have an Account?</div>
      <div className='items-center ml-14 text-blue-700'>
      <a  className='cursor-pointer' onClick={() => navigate('/signup')} >Signup</a>

      </div>
      
      </div>
        
      
    </div>
  );
};

export default Login;
