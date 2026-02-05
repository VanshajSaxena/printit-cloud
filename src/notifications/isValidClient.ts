export interface SocketAuthPayload {
  clientType: string;
  clientId: string;
}

export function isValidClient(
  auth: Partial<SocketAuthPayload>,
): auth is SocketAuthPayload & { clientType: 'vendor' | 'user' } {
  return (
    // auth.clientId !== undefined &&
    auth.clientType === 'vendor' || auth.clientType === 'user'
  );
}
