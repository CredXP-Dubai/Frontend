import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { listUsers, getUser } from "@/lib/api/users";
import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { getUserPermissions, resolveUserRole } from "@/lib/auth/permissions";
import { queryKeys } from "@/lib/query/keys";
import { asRecord, readString } from "@/utils/record";

export function usePermissions() {
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const accessToken = getAccessToken();
  const userId = readString(asRecord(currentUser), "id");

  const roleFromSession = useMemo(
    () => resolveUserRole(currentUser, accessToken),
    [currentUser, accessToken],
  );

  const { data: userDetail } = useQuery({
    queryKey: [...queryKeys.users.detail(userId), "permissions"],
    queryFn: () => getUser(userId),
    enabled: Boolean(isAuthenticated && userId && !roleFromSession),
    staleTime: 5 * 60_000,
    retry: false,
  });

  const roleFromDetail = useMemo(
    () => (userDetail ? resolveUserRole(userDetail, accessToken) : null),
    [userDetail, accessToken],
  );

  const needsUsersProbe = isAuthenticated && !roleFromSession && !roleFromDetail;

  const { data: canListUsers, isPending: usersProbePending } = useQuery({
    queryKey: ["auth", "users-probe"],
    queryFn: async () => {
      try {
        await listUsers({ page: 1, limit: 1 });
        return true;
      } catch (error) {
        if (error instanceof ApiError && error.isForbidden) return false;
        return false;
      }
    },
    enabled: needsUsersProbe,
    staleTime: 5 * 60_000,
    retry: false,
  });

  const permissionsLoading = authLoading || (needsUsersProbe && usersProbePending);

  const permissions = useMemo(() => {
    if (permissionsLoading) {
      return getUserPermissions(currentUser, false);
    }

    return getUserPermissions(currentUser, isAuthenticated, {
      accessToken,
      enrichedUser: userDetail,
      canListUsers:
        needsUsersProbe && canListUsers === true ? true : undefined,
    });
  }, [
    permissionsLoading,
    currentUser,
    isAuthenticated,
    accessToken,
    userDetail,
    needsUsersProbe,
    canListUsers,
  ]);

  return { permissions, loading: permissionsLoading, currentUser, isAuthenticated };
}
