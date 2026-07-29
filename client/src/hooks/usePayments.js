import { useQuery, keepPreviousData } from "@tanstack/react-query";
import API from "../api/axios";

export const paymentsKeys = {
    all: ["payments"],
    list: (page) => ["payments", "list", { page }],
    summary: () => ["payments", "summary"],
};

export const fetchPayments = async (page) => {
    const res = await API.get("/payments", { params: { page, limit: 10 } });
    return res.data;
};

export const fetchPaymentSummary = async () => {
    const res = await API.get("/payments/summary");
    return res.data;
};

export const usePayments = (page) => {
    return useQuery({
        queryKey: paymentsKeys.list(page),
        queryFn: () => fetchPayments(page),
        placeholderData: keepPreviousData,
    });
};

export const usePaymentSummary = () => {
    return useQuery({
        queryKey: paymentsKeys.summary(),
        queryFn: fetchPaymentSummary,
    });
};
