import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
    const [searchCriteria, setSearchCriteria] = useState(() => {
        const saved = sessionStorage.getItem('1tiket_search');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        // Default tomorrow & return 3 days after
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');

        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 4);
        const rYyyy = returnDate.getFullYear();
        const rMm = String(returnDate.getMonth() + 1).padStart(2, '0');
        const rDd = String(returnDate.getDate()).padStart(2, '0');

        return {
            trip: 'one_way', // 'one_way' | 'round_trip'
            origin: 'CGK',
            destination: 'DPS',
            date: `${yyyy}-${mm}-${dd}`,
            return_date: `${rYyyy}-${rMm}-${rDd}`,
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

    const [returnFlight, setReturnFlight] = useState(() => {
        const saved = sessionStorage.getItem('1tiket_return_flight');
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
        return [{ title: 'Tn', full_name: '', id_number: '', seat_number: null, return_seat_number: null }];
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
        if (returnFlight) {
            sessionStorage.setItem('1tiket_return_flight', JSON.stringify(returnFlight));
        } else {
            sessionStorage.removeItem('1tiket_return_flight');
        }
    }, [returnFlight]);

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
                next.push({ title: 'Tn', full_name: '', id_number: '', seat_number: null, return_seat_number: null });
            }
            return next.slice(0, count);
        });
    };

    const resetBookingFlow = () => {
        setSelectedFlight(null);
        setReturnFlight(null);
        setPassengers([{ title: 'Tn', full_name: '', id_number: '', seat_number: null, return_seat_number: null }]);
        setCurrentBooking(null);
        setAppliedVoucher(null);
        setAddons({ baggage_kg: 0, meals: [], insurance: false });
        sessionStorage.removeItem('1tiket_flight');
        sessionStorage.removeItem('1tiket_return_flight');
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
                returnFlight,
                setReturnFlight,
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
