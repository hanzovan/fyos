import * as joseJwt from "jose";
import CryptoJS from "crypto-js";
import { nanoid } from "nanoid";


// Ensure user have strong password that have at least 8 characters including alphabet, uppercase, number, special character
export function strongPassword(password: string): boolean {
    const specialCharPattern = /[~!@#$%^&*()_+\[\]{}?]/;
    const hasSpecialChar = specialCharPattern.test(password);
    const hasNumber = /\d/.test(password);
    const hasAlphabet = /[a-zA-Z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const isLongEnough = password.length >= 8;
  
    const isValid =
      hasSpecialChar && hasNumber && hasAlphabet && hasUpperCase && isLongEnough;
  
    return isValid;
}


// Get user profile from providers like Github, Google, return info that matter
export const standardizeProfile = (profile: any, tokens: any) => {
    const id = profile?.id
        ? profile.id
        : profile?.sub
        ? profile.sub
        : "profile id not found";
    const isBlocked = profile?.hasOwnProperty("isBlocked")
        ? profile.isBlocked
        : false;
    const role = profile?.hasOwnProperty("role")
        ? profile.role
        : "user";
    const emailIsVerified = profile?.hasOwnProperty("email_verified")
        ? profile.email_verified
        : false;
    const avatar = profile?.avatar_url
        ? profile.avatar_url
        : profile?.picture
        ? profile.picture
        : "avatar not found"
    const createdAt = profile?.hasOwnProperty("created_at")
        ? profile?.created_at
        : new Date().toISOString();
    const updatedAt = profile?.hasOwnProperty("updated_at")
        ? profile?.updated_at
        : new Date().toISOString();

    return {
        id,
        name: profile?.name,
        email: profile?.email,
        role,
        isBlocked,
        emailIsVerified,
        avatar,
        createdAt,
        updatedAt
    }
}

export const verifyJwtToken = async(token: string) => {
    try {
        const privateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
        const result = await joseJwt.jwtVerify(token, new TextEncoder().encode(privateKey));

        return { data: result.payload, isError: false, message: "Verify Jwt Token successfully" }
    } catch (error) {
        return {
            data: null,
            isError: true,
            message: error instanceof Error
                ? error.message
                : "An unknown error occurred"
        }
    }
}

export const encryptString = (str: string) => {
    const secretKey = CryptoJS.enc.Utf8.parse(process.env.CRYPTO_ENCRYPTION_KEY ?? "Crypto encryption key not found");
    const iv = CryptoJS.enc.Utf8.parse(process.env.CRYPTO_IV_KEY ?? "Crypto iv key not found");
    const encrypted = CryptoJS.AES.encrypt(str, secretKey, {iv})
    const hexString = CryptoJS.enc.Hex.stringify(encrypted.ciphertext)

    return hexString;
}

export const decryptString = (hexString: string) => {
    const secretKey = CryptoJS.enc.Utf8.parse(process.env.CRYPTO_ENCRYPTION_KEY ?? "Crypto encryption key not found");
    const iv = CryptoJS.enc.Utf8.parse(process.env.CRYPTO_IV_KEY ?? "Crypto iv key not found");

    try {
        const ciphertext = CryptoJS.enc.Hex.parse(hexString);
        const decrypted = CryptoJS.AES.decrypt({ciphertext} as any, secretKey, {iv}).toString(CryptoJS.enc.Utf8);

        return JSON.parse(decrypted)
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
}

export const signJwtToken = async(payload: any) => {
    const privateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY
    const expiresIn = "5m";
    const token = await new joseJwt.SignJWT(payload)
        .setProtectedHeader({alg: "HS256"})
        .setJti(nanoid())
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(new TextEncoder().encode(privateKey))

    return token;
}

export const checkUserRole = (role: string | undefined) => {
    return {
        isAdminRole: role === "admin",
        isUserRole: role === "user"
    }
}

export const formatDate = (date: any) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return "Invalid date";
    }
    return new Intl.DateTimeFormat(undefined, { dateStyle: "short", timeStyle: "short" }).format(parsedDate)
}

export const getErrorMessage = (error: any) => {
    if (error.message) {
        return error.message;
    } else if (error?.response?.data) {
        return error.response.data;
    } else {
        return "An unknown error occurred";
    }
}

export const isValidJson = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };