import { useQuery, keepPreviousData } from "@tanstack/react-query";
import API from "../api/axios";

export const usersKeys = {
    all: ["users"],
    list: (page, search, role) => ["users", "list", { page, search, role }],
    detail: (id) => ["users", "detail", id],
};

export const fetchUsers = async (page, search, role) => {
    const res = await API.get("/users", { params: { search, role, page, limit: 10 } });
    return res.data;
};

export const fetchUserById = async (id) => {
    const res = await API.get(`/users/${id}`);
    return res.data;
};

export const useUsers = (page, search, role) => {
    return useQuery({
        queryKey: usersKeys.list(page, search, role),
        queryFn: () => fetchUsers(page, search, role),
        placeholderData: keepPreviousData,
    });
};

export const useUser = (id) => {
    return useQuery({
        queryKey: usersKeys.detail(id),
        queryFn: () => fetchUserById(id),
        enabled: !!id,
    });
};
