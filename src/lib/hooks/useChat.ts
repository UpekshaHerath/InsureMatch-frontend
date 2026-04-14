"use client";

import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ChatRequest, ChatResponse } from "@/lib/types/api";

export function useChat() {
  return useMutation({
    mutationFn: async (data: ChatRequest) => {
      const response = await apiClient.post<ChatResponse>(
        ENDPOINTS.CHAT,
        data
      );
      return response.data;
    },
  });
}
