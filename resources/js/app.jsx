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
import AdminPage from './pages/AdminPage';

import { ToastProvider } from './components/ui/Toast';

import BottomNav from './components/BottomNav';

import ScrollFlightProgress from './components/ScrollFlightProgress';
import ScrollToTopPlane from './components/ScrollToTopPlane';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <BookingProvider>
                    <ToastProvider>
                        <div className="flex flex-col min-h-screen bg-[#F6F8FA] text-[#0E2A47] relative">
                            {/* Scroll Flight Progress Bar at Top */}
                            <ScrollFlightProgress />

                            <Navbar />
                            <main className="flex-1 pb-16 md:pb-0">
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
                                    <Route path="/admin" element={<AdminPage />} />
                                </Routes>
                            </main>
                            <Footer />
                            <BottomNav />

                            {/* Floating Action Plane: Smooth Fly Back to Top */}
                            <ScrollToTopPlane />
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
