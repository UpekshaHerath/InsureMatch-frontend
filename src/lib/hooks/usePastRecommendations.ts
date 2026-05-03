"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";

import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { SavedRecommendation } from "@/components/organisms/SavedRecommendationCard";

export interface PastRecommendationsPage {
  items: SavedRecommendation[];
  total: number;
  page: number;
  page_size: number;
}

export function usePastRecommendations(
  page: number,
  pageSize: number,
  enabled: boolean
) {
  return useQuery<PastRecommendationsPage>({
    queryKey: ["past-recommendations", page, pageSize],
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await apiClient.get<PastRecommendationsPage>(
        ENDPOINTS.RECOMMENDATIONS,
        { params: { page, page_size: pageSize } }
      );
      return res.data;
    },
  });
}
