import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";

export const dashboardKeys = {
    all: ["dashboard"],
    stats: () => ["dashboard", "stats"],
};

export const fetchDashboardStats = async () => {
    const res = await API.get("/dashboard/stats");
    return res.data;
};

export const useDashboardStats = () => {
    return useQuery({
        queryKey: dashboardKeys.stats(),
        queryFn: fetchDashboardStats,
    });
};
