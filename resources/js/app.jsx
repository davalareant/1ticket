import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PassengerPage from './pages/PassengerPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import SummaryPage from './pages/SummaryPage';
import PaymentPage from './pages/PaymentPage';
import TicketPage from './pages/TicketPage';
import MyBookingsPage from './pages/MyBookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import { ToastProvider } from './components/ui/Toast';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <BookingProvider>
                    <ToastProvider>
                        <div className="flex flex-col min-h-screen bg-[#F6F8FA] text-[#0E2A47]">
                            <Navbar />
                            <main className="flex-1">
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/cari" element={<SearchPage />} />
                                    <Route path="/pesan/penumpang" element={<PassengerPage />} />
                                    <Route path="/pesan/kursi" element={<SeatSelectionPage />} />
                                    <Route path="/pesan/ringkasan" element={<SummaryPage />} />
                                    <Route path="/bayar/:kode" element={<PaymentPage />} />
                                    <Route path="/tiket/:kode" element={<TicketPage />} />
                                    <Route path="/tiket-saya" element={<MyBookingsPage />} />
                                    <Route path="/masuk" element={<LoginPage />} />
                                    <Route path="/daftar" element={<RegisterPage />} />
                                </Routes>
                            </main>
                            <Footer />
                        </div>
                    </ToastProvider>
                </BookingProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

const rootElement = document.getElementById('root');
if (rootElement) {
    createRoot(rootElement).render(<App />);
}
