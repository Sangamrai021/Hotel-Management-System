import { useQuery, keepPreviousData } from "@tanstack/react-query";
import API from "../api/axios";

export const roomsKeys = {
    all: ["rooms"],
    list: (page, search, roomType, status) => ["rooms", "list", { page, search, roomType, status }],
    detail: (id) => ["rooms", "detail", id],
};

export const fetchRooms = async (page, search, roomType, status) => {
    const res = await API.get("/rooms", { params: { search, roomType, status, page, limit: 10 } });
    return res.data;
};

export const fetchRoomById = async (id) => {
    const res = await API.get(`/rooms/${id}`);
    return res.data;
};

export const useRooms = (page, search, roomType, status) => {
    return useQuery({
        queryKey: roomsKeys.list(page, search, roomType, status),
        queryFn: () => fetchRooms(page, search, roomType, status),
        placeholderData: keepPreviousData,
    });
};

export const useRoom = (id) => {
    return useQuery({
        queryKey: roomsKeys.detail(id),
        queryFn: () => fetchRoomById(id),
        enabled: !!id,
    });
};
