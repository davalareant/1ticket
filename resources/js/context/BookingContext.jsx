import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
    const [searchCriteria, setSearchCriteria] = useState(() => {
        const saved = sessionStorage.getItem('1tiket_search');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        // Default tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');

        return {
            origin: 'CGK',
            destination: 'DPS',
            date: `${yyyy}-${mm}-${dd}`,
            passengers: 1,
            cabin: 'economy',
        };
    });

    const [selectedFlight, setSelectedFlight] = useState(() => {
        const saved = sessionStorage.getItem('1tiket_flight');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return null;
    });

    const [passengers, setPassengers] = useState(() => {
        const saved = sessionStorage.getItem('1tiket_passengers');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return [{ title: 'Tn', full_name: '', id_number: '', seat_number: null }];
    });

    const [contact, setContact] = useState(() => {
        const saved = sessionStorage.getItem('1tiket_contact');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return { name: '', email: '', phone: '' };
    });

    const [currentBooking, setCurrentBooking] = useState(() => {
        const saved = sessionStorage.getItem('1tiket_current_booking');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return null;
    });

    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [addons, setAddons] = useState({
        baggage_kg: 0,
        meals: [],
        insurance: false,
    });

    // Sync to sessionStorage
    useEffect(() => {
        sessionStorage.setItem('1tiket_search', JSON.stringify(searchCriteria));
    }, [searchCriteria]);

    useEffect(() => {
        if (selectedFlight) {
            sessionStorage.setItem('1tiket_flight', JSON.stringify(selectedFlight));
        } else {
            sessionStorage.removeItem('1tiket_flight');
        }
    }, [selectedFlight]);

    useEffect(() => {
        sessionStorage.setItem('1tiket_passengers', JSON.stringify(passengers));
    }, [passengers]);

    useEffect(() => {
        sessionStorage.setItem('1tiket_contact', JSON.stringify(contact));
    }, [contact]);

    useEffect(() => {
        if (currentBooking) {
            sessionStorage.setItem('1tiket_current_booking', JSON.stringify(currentBooking));
        } else {
            sessionStorage.removeItem('1tiket_current_booking');
        }
    }, [currentBooking]);

    const updatePassengersCount = (count) => {
        setPassengers((prev) => {
            const next = [...prev];
            while (next.length < count) {
                next.push({ title: 'Tn', full_name: '', id_number: '', seat_number: null });
            }
            return next.slice(0, count);
        });
    };

    const resetBookingFlow = () => {
        setSelectedFlight(null);
        setPassengers([{ title: 'Tn', full_name: '', id_number: '', seat_number: null }]);
        setCurrentBooking(null);
        sessionStorage.removeItem('1tiket_flight');
        sessionStorage.removeItem('1tiket_passengers');
        sessionStorage.removeItem('1tiket_current_booking');
    };

    return (
        <BookingContext.Provider
            value={{
                searchCriteria,
                setSearchCriteria,
                selectedFlight,
                setSelectedFlight,
                passengers,
                setPassengers,
                updatePassengersCount,
                contact,
                setContact,
                currentBooking,
                setCurrentBooking,
                appliedVoucher,
                setAppliedVoucher,
                addons,
                setAddons,
                resetBookingFlow,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
}

export const useBooking = () => useContext(BookingContext);
