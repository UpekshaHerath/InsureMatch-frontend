"use client";

import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ExplainRequest, PolicyExplanation } from "@/lib/types/api";

export function useExplain() {
  return useMutation({
    mutationFn: async (data: ExplainRequest) => {
      const response = await apiClient.post<PolicyExplanation>(
        ENDPOINTS.EXPLAIN,
        data
      );
      return response.data;
    },
  });
}
