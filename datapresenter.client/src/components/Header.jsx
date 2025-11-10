/// <reference path="../hooks/useAuth.jsx" />
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Printer, User } from 'lucide-react';

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
        <header className="bg-white shadow-sm no-print">
            <div className="container mx-auto px-4 py-4 max-w-7xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Measurement App
                        </h1>
                        <p className="text-sm text-gray-600">
                            System zbierania i analizy pomiarów
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="btn-secondary flex items-center gap-2"
                            title="Drukuj"
                        >
                            <Printer className="w-4 h-4" />
                            <span className="hidden sm:inline">Drukuj</span>
                        </button>

                        {isAuthenticated ? (
                            <>
                                <button
                                    onClick={onAddClick}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="hidden sm:inline">Dodaj pomiar</span>
                                </button>

                                <div className="flex items-center gap-3 ml-3 pl-3 border-l border-gray-300">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm font-medium hidden sm:inline">
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
                            >
                                Zaloguj siê
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;