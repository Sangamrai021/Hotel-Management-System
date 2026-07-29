import { useQuery, keepPreviousData } from "@tanstack/react-query";
import API from "../api/axios";

export const hotelsKeys = {
    all: ["hotels"],
    list: (page, search) => ["hotels", "list", { page, search }],
    detail: (id) => ["hotels", "detail", id],
};

export const fetchHotels = async (page, search) => {
    const res = await API.get("/hotels", { params: { search, page, limit: 10 } });
    return res.data;
};

export const fetchAllHotels = async () => {
    const res = await API.get("/hotels", { params: { limit: 100 } });
    return res.data;
};

export const fetchHotelById = async (id) => {
    const res = await API.get(`/hotels/${id}`);
    return res.data;
};

export const useHotels = (page, search) => {
    return useQuery({
        queryKey: hotelsKeys.list(page, search),
        queryFn: () => fetchHotels(page, search),
        placeholderData: keepPreviousData,
    });
};

export const useHotel = (id) => {
    return useQuery({
        queryKey: hotelsKeys.detail(id),
        queryFn: () => fetchHotelById(id),
        enabled: !!id,
    });
};

export const useAllHotels = () => {
    return useQuery({
        queryKey: hotelsKeys.all,
        queryFn: fetchAllHotels,
        staleTime: 5 * 60 * 1000,
    });
};
