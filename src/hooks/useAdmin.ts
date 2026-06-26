import { useQuery } from "@tanstack/react-query";
import {
  getAdminHealth,
  getAdminStatistics,
  getPermissionMatrix,
  listRoles,
} from "@/lib/api/admin";
import { queryKeys } from "@/lib/query/keys";

export function useAdminRoles(enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.roles,
    queryFn: listRoles,
    enabled,
    retry: false,
  });
}

export function usePermissionMatrix(enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.matrix,
    queryFn: getPermissionMatrix,
    enabled,
    retry: false,
  });
}

export function useAdminStatistics(enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.statistics,
    queryFn: getAdminStatistics,
    enabled,
    retry: false,
  });
}

export function useAdminHealth(enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.health,
    queryFn: getAdminHealth,
    enabled,
    retry: false,
  });
}
