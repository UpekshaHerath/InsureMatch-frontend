"use client";

import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type {
  RecommendationRequest,
  RecommendationResponse,
} from "@/lib/types/api";

export function useRecommendation() {
  return useMutation({
    mutationFn: async (data: RecommendationRequest) => {
      const response = await apiClient.post<RecommendationResponse>(
        ENDPOINTS.RECOMMEND,
        data
      );
      return response.data;
    },
  });
}
