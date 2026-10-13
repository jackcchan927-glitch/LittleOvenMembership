import { prisma } from "@/lib/prisma";
import EventManager from "./EventManager";

export default async function MerchantEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { startDate: "desc" } });
  return <EventManager events={events} />;
}
