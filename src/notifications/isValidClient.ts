interface VendorAuth {
  clientType: 'vendor';
  clientId: string;
  username: string;
  slug: string;
}

interface UserAuth {
  clientType: 'user';
  clientId: string;
}

export type SocketAuthPayload = VendorAuth | UserAuth;

export function isValidClient(
  auth: Partial<SocketAuthPayload>,
): auth is SocketAuthPayload {
  if (auth.clientType === 'vendor') {
    return !!auth.clientId && !!auth.username && !!auth.slug;
  }

  if (auth.clientType === 'user') {
    return !!auth.clientId;
  }

  return false;
}
