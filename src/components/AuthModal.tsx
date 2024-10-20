import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import GoogleLogo from "../../public/google.svg";
import GithubLogo from "../../public/github.svg";
import Image from "next/image";
import { signIn } from "@/utils/auth";

function AuthModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Try for free</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[400px] flex items-center justify-center rounded">
        <div className="flex flex-col gap-y-10">
          <DialogHeader>
            <DialogTitle className="text-3xl font-semibold">
              MyCalendar
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-y-3">
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <Button variant="outline">
                <Image
                  src={GoogleLogo}
                  alt="Google Logo"
                  width={4}
                  height={4}
                  className="size-5 mr-2"
                />{" "}
                Sign in with Google
              </Button>
            </form>
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <Button variant="outline">
                <Image
                  src={GithubLogo}
                  alt="Github Logo"
                  width={4}
                  height={4}
                  className="size-5 mr-2"
                />{" "}
                Sign in with Github
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
