"use client";

import { useParams } from "next/navigation";

function Calendar() {
  const query = useParams();
  const doctor_id = query.doctor_id;

}

export default Calendar;
