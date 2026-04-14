"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { PolicyListItem } from "@/lib/types/api";

export function usePolicies() {
  return useQuery({
    queryKey: ["policies"],
    queryFn: async () => {
      const response = await apiClient.get<PolicyListItem[]>(
        ENDPOINTS.POLICIES
      );
      return response.data;
    },
  });
}
