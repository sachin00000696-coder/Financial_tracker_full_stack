import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      return setError('Password must contain at least 8 characters.');
    }
    if (form.password !== form.confirm) {
      return setError('Passwords do not match.');
    }
    try {
      await signup(form);
      navigate('/settings?setup=1');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to create account');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="back-home">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <div className="auth-art">
          <div className="auth-art-circle">✦</div>
          <span className="eyebrow">A LITTLE MORE CLARITY</span>
          <h2>Start building a<br /><em>brighter</em> money story.</h2>
          <p>Know what comes in, see what goes out, and make a plan for what comes next.</p>
          <div className="auth-benefits">
            <span><CheckCircle2 /> Understand your spending</span>
            <span><CheckCircle2 /> Set goals that matter</span>
            <span><CheckCircle2 /> Celebrate your progress</span>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap">
          <Logo />
          <span className="eyebrow auth-eyebrow">YOUR FINANCIAL RESET</span>
          <h1>Create your account</h1>
          <p className="auth-sub">A few details and you're on your way.</p>
          {error && <div className="alert-error">{error}</div>}
          <form onSubmit={submit} className="auth-form">
            <label className="field">
              Full name
              <input
                placeholder="Alex Morgan"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label className="field">
              Email address
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>
            <label className="field">
              Password
              <div className="password-wrap">
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShow(!show)}>
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>
            <label className="field">
              Confirm password
              <input
                type="password"
                placeholder="Enter password again"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                required
              />
            </label>
            <label className="check-label terms-check">
              <input type="checkbox" required /> I agree to the Terms of Service and Privacy Policy.
            </label>
            <button className="btn btn-primary auth-submit">
              Create account <ArrowRight size={17} />
            </button>
          </form>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
          <p className="auth-legal">Your account is yours. Your financial data should stay private.</p>
        </div>
      </div>
    </div>
  );
}
