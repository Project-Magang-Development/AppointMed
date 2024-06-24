import { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface MyTokenPayload extends JwtPayload {
  merchantId: string;
  email: string;
  merchant_name: string;
  api_key: string;
  merchant_company: string;
}

export const login = (): boolean => {
  const token = Cookies.get("token");
  const adminToken = Cookies.get("adminToken");
  return !!token && !!adminToken;
};

export const getCompanyName = (token: string) => {
  const decoded = jwtDecode<MyTokenPayload>(token);
  return decoded.merchant_company;
};

export const getName = (token: string) => {
  const decoded = jwtDecode<MyTokenPayload>(token);
  return decoded.merchant_name;
};

export const getMerchantId = (token: string) => {
  const decoded = jwtDecode<MyTokenPayload>(token);
  return decoded.merchantId;
};

export const getEmail = (token: string) => {
  const decoded = jwtDecode<MyTokenPayload>(token);
  return decoded.email;
};

export const getApiKey = (token: string) => {
  const decoded = jwtDecode<MyTokenPayload>(token);
  return decoded.api_key;
};
