interface VendorAuth {
  clientType: 'vendor';
  clientId: number;
  username: string;
  slug: string;
}

interface UserAuth {
  clientType: 'user';
  clientId: number;
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
