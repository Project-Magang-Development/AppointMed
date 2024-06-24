import { useState, useEffect } from "react";
import { useAuthToken } from "./useRedirectBasedOnToken";
import { getApiKey, getCompanyName, getEmail, getMerchantId, getName } from "../services/authServices";

export const useMerchantId = () => {
  const [merchantId, setMerchantId] = useState("");
  const { token } = useAuthToken();

  useEffect(() => {
    if (token) {
      setMerchantId(getMerchantId(token));
    }
  }, [token]);

  return merchantId;
};

export const useCompanyName = () => {
  const [companyName, setCompanyName] = useState("");
  const { token } = useAuthToken();

  useEffect(() => {
    if (token) {
      setCompanyName(getCompanyName(token));
    } else {
      router.push("/dashboard/login");
    }
  }, [token]);

  return companyName;
};

export const useMerchantName = () => {
  const [merchantName, setMerchantName] = useState("");
  const { token } = useAuthToken();

  useEffect(() => {
    if (token) {
      setMerchantName(getName(token));
    }
  }, [token]);

  return merchantName;
};

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState("");
  const { token } = useAuthToken();

  useEffect(() => {
    if (token) {
      setApiKey(getApiKey(token));
    }
  }, [token]);

  return apiKey;
};

export const useMerchantEmail = () => {
  const [merchantEmail, setMerchantEmail] = useState("");
  const { token } = useAuthToken();

  useEffect(() => {
    if (token) {
      setMerchantEmail(getEmail(token));
    }
  }, [token]);

  return merchantEmail;
};
