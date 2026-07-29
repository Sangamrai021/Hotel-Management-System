import { useQuery, keepPreviousData } from "@tanstack/react-query";
import API from "../api/axios";

export const bookingsKeys = {
    all: ["bookings"],
    list: (page, status) => ["bookings", "list", { page, status }],
};

export const fetchBookings = async (page, status) => {
    const res = await API.get("/bookings", { params: { status, page, limit: 10 } });
    return res.data;
};

export const useBookings = (page, status) => {
    return useQuery({
        queryKey: bookingsKeys.list(page, status),
        queryFn: () => fetchBookings(page, status),
        placeholderData: keepPreviousData,
    });
};
