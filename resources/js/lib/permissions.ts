export function can(userPermissions: string[], allowedPermission: string): boolean {
  return userPermissions.includes(allowedPermission);
}

export function canAny(userPermissions: string[], allowedPermissions: string[]): boolean {
  return allowedPermissions.some((p) => userPermissions.includes(p));
}

export function canAll(userPermissions: string[], allowedPermissions: string[]): boolean {
  return allowedPermissions.every((p) => userPermissions.includes(p));
}
