import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';

const secret = process.env.NEXTAUTH_SECRET || 'your_secret_key_change_this_in_production';

interface TokenPayload {
  uid: string;
  email: string;
  googleId?: string;
}

export function jwtSign(payload: TokenPayload, expiresIn: string = '7d'): string {
  const options: SignOptions = { expiresIn } as any;
  return jwt.sign(payload, secret, options);
}

export function jwtVerify(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}
