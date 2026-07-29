import { useQuery, keepPreviousData } from "@tanstack/react-query";
import API from "../api/axios";

export const guestsKeys = {
    all: ["guests"],
    list: (page, search) => ["guests", "list", { page, search }],
    detail: (id) => ["guests", "detail", id],
};

export const fetchGuests = async (page, search) => {
    const res = await API.get("/guests", { params: { search, page, limit: 10 } });
    return res.data;
};

export const fetchGuestById = async (id) => {
    const res = await API.get(`/guests/${id}`);
    return res.data;
};

export const useGuests = (page, search) => {
    return useQuery({
        queryKey: guestsKeys.list(page, search),
        queryFn: () => fetchGuests(page, search),
        placeholderData: keepPreviousData,
    });
};

export const useGuest = (id) => {
    return useQuery({
        queryKey: guestsKeys.detail(id),
        queryFn: () => fetchGuestById(id),
        enabled: !!id,
    });
};
