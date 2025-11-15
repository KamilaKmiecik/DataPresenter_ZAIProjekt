import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Printer, User, Sparkles } from 'lucide-react';

const Header = ({ onAddClick }) => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handlePrint = () => {
        window.print();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="no-print" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
        }}>
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                        }}>
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 style={{
                                fontSize: '28px',
                                fontWeight: '800',
                                color: 'white',
                                margin: 0,
                                lineHeight: 1.2
                            }}>
                                Data Presenter
                            </h1>
                            <p style={{
                                fontSize: '14px',
                                color: 'rgba(255, 255, 255, 0.9)',
                                margin: 0
                            }}>
                                Collection and data analisys website
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="btn-secondary flex items-center gap-2"
                            title="Drukuj"
                        >
                            <Printer className="w-4 h-4" />
                            <span className="hidden sm:inline">Print graph</span>
                        </button>

                        {isAuthenticated ? (
                            <>
                                <button
                                    onClick={onAddClick}
                                    className="btn-primary flex items-center gap-2"
                                    style={{
                                        background: 'white',
                                        color: '#667eea',
                                        boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)'
                                    }}
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="hidden sm:inline">Dodaj pomiar</span>
                                </button>

                                <div className="flex items-center gap-3 ml-3 pl-3" style={{
                                    borderLeft: '2px solid rgba(255, 255, 255, 0.3)'
                                }}>
                                    <div className="flex items-center gap-2" style={{
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        padding: '8px 16px',
                                        borderRadius: '12px',
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                        <User className="w-4 h-4 text-white" />
                                        <span className="text-sm font-medium text-white hidden sm:inline">
                                            {user?.username}
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="btn-secondary flex items-center gap-2"
                                        title="Wyloguj"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="hidden sm:inline">Wyloguj</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="btn-primary"
                                style={{
                                    background: 'white',
                                    color: '#667eea',
                                    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)'
                                }}
                            >
                                Log In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;