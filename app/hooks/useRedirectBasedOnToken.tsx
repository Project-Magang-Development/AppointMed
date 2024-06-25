import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";

const useAuthToken = () => {
  const token = Cookies.get("token");
  const adminToken = Cookies.get("adminToken");
  return { token, adminToken };
};

const useRedirectBasedOnToken = () => {
  const router = useRouter();
  const { token, adminToken } = useAuthToken();
  const pathname = usePathname();

  const disableToken = ["/dashboard-admin/register"];
  const shouldHideToken = disableToken.some((route) =>
    pathname.includes(route)
  );

  useEffect(() => {
    if (shouldHideToken) {
      return;
    }

    if (!token && !adminToken) {
      // router.push("/dashboard/login")
    } else if (!adminToken) {
      // router.push("/dashboard-admin/login");
    }
  }, [router, token, adminToken, shouldHideToken, pathname]);
};

export { useAuthToken, useRedirectBasedOnToken };
