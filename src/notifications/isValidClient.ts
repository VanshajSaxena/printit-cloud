interface VendorAuth {
  clientType: 'vendor';
  token: string;
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
    return !!auth.token;
  }

  if (auth.clientType === 'user') {
    return !!auth.clientId;
  }

  return false;
}
