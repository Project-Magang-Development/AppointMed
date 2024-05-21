import { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface MyTokenPayload extends JwtPayload {
  tenantId: number;
  email: string;
  tenant_company: string;
}
export const login = () => {
  const token = Cookies.get("token");
  if (token) {
    return true;
  } else {
    return false;
  }
};

export const getCompanyName = (token: string) => {
  const decoded = jwtDecode<MyTokenPayload>(token);
  return decoded.merchant_company;
};

export const getName = (token: string) => {
  const decoded = jwtDecode<MyTokenPayload>(token);
  return decoded.merchant_name;
};
