import useSWR from "swr";

import { fetcher } from "@/lib/utils";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
};

export const useUsers = () => {
  const { data, error, isLoading } = useSWR<User[]>("/api/users", fetcher);

  return {
    teams: data,
    error,
    isLoading,
  };
};
