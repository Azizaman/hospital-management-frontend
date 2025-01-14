import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      email,
      password,
      role,
    }

    try {
      const response = await axios.post('https://hospital-management-backend-zlyb.onrender.com/auth/register', payload)
      
      if (response.status === 201) {
        setSuccessMessage('User registered successfully')
        setErrorMessage('')
      } else {
        setErrorMessage('Registration failed, please try again')
      }
    } catch (error) {
      console.error('Error during registration:', error)
      setErrorMessage('Error while registering the user')
      setSuccessMessage('')
    }
  }

  return (
    <div className="w-80 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl text-center mb-4">Register</h2>
      
      {errorMessage && <p className="text-red-500 text-center mb-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-center mb-2">{successMessage}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <Input
            type="text"
            placeholder="Role (manager, pantry, delivery)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className='items-center ml-20'>Register</Button>
      </form>
    </div>
  )
}

export default Register
