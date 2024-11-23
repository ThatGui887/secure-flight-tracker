import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decryptData } from '../utils/auth';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const encryptedData = localStorage.getItem('userData');
      if (!encryptedData) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Account not found.",
        });
        return;
      }

      const userData = decryptData(encryptedData);
      
      if (userData.email === formData.email && userData.password === formData.password) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate('/home');
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid credentials.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="input-field"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Log In
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-primary hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;