import React, { useEffect, useState } from "react";
import Schedules from "../(user)/page";


export interface SchedulerProps {
  apiKey?: string;
}

const SchedulerComponent: React.FC<SchedulerProps> = ({
  apiKey: propApiKey,
}) => {
  const [apiKey, setApiKey] = useState<string | undefined>(propApiKey);

  useEffect(() => {
    if (!propApiKey) {
      const key = document
        .querySelector("script[apiKey]")
        ?.getAttribute("apiKey");
      if (key) {
        setApiKey(key);
      }
    }
  }, [propApiKey]);

  return apiKey ? <Schedules apiKey={apiKey} /> : null;
};

export default SchedulerComponent;
