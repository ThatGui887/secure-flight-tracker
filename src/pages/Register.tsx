import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validatePassword, encryptData } from '../utils/auth';
import { toast } from '@/components/ui/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, message } = validatePassword(formData.password);
    
    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description: message,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Don't Match",
        description: "Please ensure both passwords match.",
      });
      return;
    }

    try {
      const encryptedData = encryptData({
        email: formData.email,
        password: formData.password,
      });

      // In a real app, you'd send this to a server
      localStorage.setItem('userData', encryptedData);
      
      toast({
        title: "Registration Successful",
        description: "Please log in with your credentials.",
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
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
          <div className="form-group">
            <label htmlFor="confirmPassword" className="block text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="input-field"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-primary hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;