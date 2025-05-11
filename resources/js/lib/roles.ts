export function hasRole(userRoles: string[], allowedRole: string): boolean {
  return userRoles.includes(allowedRole);
}

export function hasAnyRole(userRoles: string[], allowedRoles: string[]): boolean {
  return allowedRoles.some((r) => userRoles.includes(r));
}

export function hasEveryRole(userRoles: string[], allowedRoles: string[]): boolean {
  return allowedRoles.every((r) => userRoles.includes(r));
}
