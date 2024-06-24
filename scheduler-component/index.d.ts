// index.d.ts
declare module "schedules-appointmed" {
  import { FC } from "react";

  export interface SchedulerProps {
    apiKey: string;
  }

  const Scheduler: FC<SchedulerProps>;
  export default Scheduler;
}
