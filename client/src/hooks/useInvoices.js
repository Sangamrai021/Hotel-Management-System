import { useQuery, keepPreviousData } from "@tanstack/react-query";
import API from "../api/axios";

export const invoicesKeys = {
    all: ["invoices"],
    list: (page, search) => ["invoices", "list", { page, search }],
    byBooking: (bookingId) => ["invoices", "booking", bookingId],
};

export const fetchInvoices = async (page, search) => {
    const res = await API.get("/invoices", { params: { search, page, limit: 10 } });
    return res.data;
};

export const fetchInvoiceByBooking = async (bookingId) => {
    const res = await API.get(`/invoices/booking/${bookingId}`);
    return res.data;
};

export const useInvoices = (page, search) => {
    return useQuery({
        queryKey: invoicesKeys.list(page, search),
        queryFn: () => fetchInvoices(page, search),
        placeholderData: keepPreviousData,
    });
};

export const useInvoiceByBooking = (bookingId) => {
    return useQuery({
        queryKey: invoicesKeys.byBooking(bookingId),
        queryFn: () => fetchInvoiceByBooking(bookingId),
        enabled: !!bookingId,
    });
};
