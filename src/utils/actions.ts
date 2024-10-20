"use server";

import { parseWithZod } from "@conform-to/zod";
import { requiredUser } from "./hook";
import {
  NewEventValidationSchema,
  OnboardingAsyncValidationSchema,
  SettingsValidationSchema,
} from "./zodSchemas";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nylas } from "./nylas";

export const OnboardingAction = async (prevState: any, formData: FormData) => {
  const session = await requiredUser();

  const submission = await parseWithZod(formData, {
    schema: OnboardingAsyncValidationSchema({
      async isUsernameIsUnique() {
        const existingUsername = await prisma.user.findUnique({
          where: {
            username: formData.get("username") as string,
          },
        });

        return !existingUsername;
      },
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.user.update({
    where: {
      id: session?.id,
    },
    data: {
      name: submission.value.fullName,
      username: submission.value.username,
      availability: {
        createMany: {
          data: [
            {
              day: "Monday",
              fromTime: "08:00",
              tillTime: "17:00",
            },
            {
              day: "Tuesday",
              fromTime: "08:00",
              tillTime: "17:00",
            },
            {
              day: "Wednesday",
              fromTime: "08:00",
              tillTime: "17:00",
            },
            {
              day: "Thursday",
              fromTime: "08:00",
              tillTime: "17:00",
            },
            {
              day: "Friday",
              fromTime: "08:00",
              tillTime: "17:00",
            },
            {
              day: "Saturday",
              fromTime: "08:00",
              tillTime: "17:00",
            },
            {
              day: "Sunday",
              fromTime: "08:00",
              tillTime: "17:00",
            },
          ],
        },
      },
    },
  });

  return redirect("/onboarding/grant-id");
};

export const SettingsAction = async (prevState: any, formData: FormData) => {
  const session = await requiredUser();

  const submission = parseWithZod(formData, {
    schema: SettingsValidationSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.user.update({
    where: {
      id: session?.id,
    },
    data: {
      name: submission.value.fullName,
      image: submission.value.imageUrl,
    },
  });

  revalidatePath("/dashboard/settings");
};

export const AvailabilityAction = async (formData: FormData) => {
  const rowData = Object.fromEntries(formData);

  const filteringData = Object.keys(rowData)
    .filter((data) => data.startsWith("id-"))
    .map((data) => {
      const id = data.replace("id-", "");

      return {
        id,
        isActive: rowData[`isActive-${id}`] === "on",
        fromTime: rowData[`fromTime-${id}`] as string,
        tillTime: rowData[`tillTime-${id}`] as string,
      };
    });

  await prisma.$transaction(
    filteringData.map((data) => {
      return prisma.availability.update({
        where: {
          id: data.id,
        },
        data: {
          isActive: data.isActive,
          fromTime: data.fromTime,
          tillTime: data.tillTime,
        },
      });
    })
  );

  revalidatePath("/dashboard/availability");
};

export const NewEventAction = async (prevState: any, formData: FormData) => {
  const session = await requiredUser();

  const submission = parseWithZod(formData, {
    schema: NewEventValidationSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.event.create({
    data: {
      User: {
        connect: {
          id: session?.id,
        },
      },
      title: submission.value.title,
      description: submission.value.description,
      duration: submission.value.duration,
      url: submission.value.url,
      videoCallSoftware: submission.value.videoCallProviders,
    },
  });

  return redirect("/dashboard");
};

export const NewBookingEventAction = async (formData: FormData) => {
  const getUserData = await prisma.user.findFirst({
    where: {
      username: formData.get("username") as string,
    },
    select: {
      grantId: true,
      grantEmail: true,
    },
  });

  if (!getUserData) {
    throw new Error("User not found");
  }

  const eventData = await prisma.event.findUnique({
    where: {
      id: formData.get("eventId") as string,
    },
    select: {
      title: true,
      description: true,
    },
  });

  const fromTime = formData.get("fromTime") as string;
  const eventDate = formData.get("eventDate") as string;
  const durationOfMeeting = Number(formData.get("durationOfMeeting"));

  const startDateTime = new Date(`${eventDate}T${fromTime}`);
  const endDateTime = new Date(
    startDateTime.getTime() + durationOfMeeting * 60000
  );

  await nylas.events.create({
    identifier: getUserData.grantId as string,
    requestBody: {
      title: eventData?.title,
      description: eventData?.description,
      when: {
        startTime: Math.floor(startDateTime.getTime() / 1000),
        endTime: Math.floor(endDateTime.getTime() / 1000),
      },
      conferencing: {
        autocreate: {},
        provider: "Google Meet",
      },
      participants: [
        {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          status: "yes",
        },
      ],
    },
    queryParams: {
      calendarId: getUserData.grantEmail as string,
      notifyParticipants: true,
    },
  });

  return redirect("/success");
};

export const CancelBooking = async (formData: FormData) => {
  const session = await requiredUser();

  const userData = await prisma.user.findUnique({
    where: {
      id: session?.id,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  await nylas.events.destroy({
    eventId: formData.get("eventId") as string,
    identifier: userData.grantId as string,
    queryParams: {
      calendarId: userData.grantEmail as string,
    },
  });

  revalidatePath("/dashboard/meetings");
};

export const EditEventAction = async (prevState: any, formData: FormData) => {
  const session = await requiredUser();

  const submission = parseWithZod(formData, {
    schema: NewEventValidationSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.event.update({
    where: {
      id: formData.get("eventId") as string,
      userId: session?.id,
    },
    data: {
      title: submission.value.title,
      description: submission.value.description,
      duration: submission.value.duration,
      url: submission.value.url,
      videoCallSoftware: submission.value.videoCallProviders,
    },
  });

  return redirect("/dashboard");
};

export const DeleteEventAction = async (formData: FormData) => {
  const session = await requiredUser();

  await prisma.event.delete({
    where: {
      id: formData.get("id") as string,
      userId: session?.id,
    },
  });

  return redirect("/dashboard");
};

export const ChangeStatusEvent = async ({
  eventId,
  checked,
}: {
  eventId: string;
  checked: boolean;
}) => {
  const session = await requiredUser();

  await prisma.event.update({
    where: {
      id: eventId,
      userId: session?.id,
    },
    data: {
      active: checked,
    },
  });

  return revalidatePath("/dashboard");
};
