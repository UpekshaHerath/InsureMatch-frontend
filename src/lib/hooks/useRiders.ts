"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { RiderMetadata } from "@/lib/types/api";

export function useRiders() {
  return useQuery({
    queryKey: ["riders"],
    queryFn: async () => {
      const response = await apiClient.get<RiderMetadata[]>(ENDPOINTS.RIDERS);
      return response.data;
    },
  });
}
