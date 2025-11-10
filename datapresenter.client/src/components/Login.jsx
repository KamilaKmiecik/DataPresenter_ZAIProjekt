import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(credentials);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
            <div className="max-w-md w-full">
                <div className="card fade-in">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center mb-2">Measurement App</h2>
                    <p className="text-gray-600 text-center mb-8">
                        Zaloguj siê do swojego konta
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nazwa u¿ytkownika
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                value={credentials.username}
                                onChange={(e) =>
                                    setCredentials({ ...credentials, username: e.target.value })
                                }
                                onKeyPress={handleKeyPress}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Has³o
                            </label>
                            <input
                                type="password"
                                className="input-field"
                                value={credentials.password}
                                onChange={(e) =>
                                    setCredentials({ ...credentials, password: e.target.value })
                                }
                                onKeyPress={handleKeyPress}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Logowanie...' : 'Zaloguj siê'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Nie masz konta?{' '}
                            <Link
                                to="/register"
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Zarejestruj siê
                            </Link>
                        </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                        <p className="text-xs text-gray-500">
                            Domyœlne konto: <strong>admin</strong> / <strong>Admin123!</strong>
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link
                        to="/"
                        className="text-sm text-primary-600 hover:text-primary-700"
                    >
                        Przegl¹daj bez logowania ?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;