import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../app/api/axiosInstance";

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const data = await axiosInstance.get("/user/getCurentUser");
      return data.data;
    },
  });

  return {...query, data: query.data?.data};
};
