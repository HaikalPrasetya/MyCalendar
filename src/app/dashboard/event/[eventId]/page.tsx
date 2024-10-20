import EditEventCard from "@/components/card/EditEventCard";
import { requiredUser } from "@/utils/hook";
import { prisma } from "@/utils/prisma";
import { notFound } from "next/navigation";

const getData = async (eventId: string, userId: string) => {
  const data = await prisma.event.findFirst({
    where: {
      id: eventId,
      userId,
    },
    select: {
      id: true,
      title: true,
      url: true,
      description: true,
      duration: true,
      videoCallSoftware: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
};

async function EditEventPage({ params }: { params: { eventId: string } }) {
  const session = await requiredUser();

  const data = await getData(params.eventId, session?.id!);

  return (
    <EditEventCard
      id={data.id}
      description={data.description}
      duration={data.duration}
      title={data.title}
      url={data.url}
      VcSoftware={data.videoCallSoftware}
    />
  );
}

export default EditEventPage;
