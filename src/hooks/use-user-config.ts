import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserConfig, updateUserConfig, type UserConfig } from "@/lib/api";

export function useUserConfig() {
  return useQuery<UserConfig | null>({
    queryKey: ["userConfig"],
    queryFn: fetchUserConfig,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: false,
  });
}

export function useUpdateUserConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partial: Record<string, unknown>) => updateUserConfig(partial),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userConfig"] });
    },
  });
}