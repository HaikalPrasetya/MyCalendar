import { redirect } from "next/navigation";
import { auth } from "./auth";

export const requiredUser = async () => {
  const authenticatedUser = await auth();

  if (!authenticatedUser) {
    return redirect("/");
  }

  return authenticatedUser.user;
};
