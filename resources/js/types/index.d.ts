import type { Config } from "ziggy-js";

export interface Auth {
  user: UserType;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface MenuItem {
  key: string;
  children?: MenuItem[];
}

export interface SharedData {
  // default from handle inertia
  companyName: string;
  appName: string;
  locale: string;
  roles: string[];
  permissions: string[];
  quote: { message: string; author: string };
  auth: Auth;
  ziggy: Config & { location: string };
  [key: string]: unknown;
}

export interface QueryResultType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  column: string | null;
  page: number;
  size: number;
  search: string | null;
  sort: string | null;
  total: number;
}

export interface UserType {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles: RoleType[];
  permissions: PermissionType[];
  [key: string]: unknown; // This allows for additional properties...
}

export interface ActivityLogType {
  id: string;
  log_name: string;
  description: string;
  event: string;
  subject_type: string;
  subject_id: string;
  causer_type: string;
  causer_id: string;
  url: string;
  method: string;
  ip: string;
  agent: string;
  causer: {
    name: string;
  };
  properties: {
    old?: object;
    attributes?: object;
  };
  [key: string]: unknown; // This allows for additional properties...
}

export interface SessionType {
  id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  payload: string;
  last_activity: number;
}

export interface RoleType {
  id: string;
  name: string;
  description: string;
  guard: string;
  created_at: string;
  updated_at: string;
  permissions: PermissionType[];
}

export interface PermissionType {
  id: string;
  name: string;
  description: string;
  guard: string;
  created_at: string;
  updated_at: string;
}
