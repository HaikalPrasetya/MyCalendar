import Navbar from "@/components/Navbar";
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import { Hero } from "../components/Hero";

async function Home() {
  const session = await auth();

  if (session?.user) {
    return redirect("/dashboard");
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Navbar />
        <Hero />
      </div>
    </div>
  );
}

export default Home;
