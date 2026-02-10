import { createAccessControl } from "better-auth/plugins";

export const statement = {
  user: ["create", "read", "update", "delete"],
  medicine: ["create", "read", "update", "delete"],
  order: ["create", "read", "update", "delete"],
  category: ["create", "read", "update", "delete"],
  review: ["create", "read", "update", "delete"],
  cart: ["create", "read", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

export const customerRole = ac.newRole({
  user: ["read", "update"],
  medicine: ["read"],
  order: ["create", "read", "update", "delete"],
  category: ["read"],
  review: ["create", "read", "update", "delete"],
  cart: ["create", "read", "update", "delete"],
});

export const sellerRole = ac.newRole({
  user: ["read", "update"],
  medicine: ["create", "read", "update", "delete"],
  order: ["read", "update", "delete"],
  category: ["read"],
  review: ["read"],
});

export const adminRole = ac.newRole({
  user: ["create", "read", "update", "delete"],
  medicine: ["create", "read", "update", "delete"],
  order: ["create", "read", "update", "delete"],
  category: ["create", "read", "update", "delete"],
  review: ["create", "read", "update", "delete"],
  cart: ["create", "read", "update", "delete"],
});
