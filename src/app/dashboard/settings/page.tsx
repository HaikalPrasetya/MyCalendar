import SettingsCard from "@/components/card/SettingsCard";
import { requiredUser } from "@/utils/hook";
import { prisma } from "@/utils/prisma";
import { notFound } from "next/navigation";

async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      image: true,
    },
  });

  if (!user) {
    return notFound();
  }

  return user;
}

async function SettingPage() {
  const session = await requiredUser();

  const user = await getUser(session?.id!);

  return (
    <SettingsCard email={user.email} name={user.name!} image={user.image!} />
  );
}

export default SettingPage;
