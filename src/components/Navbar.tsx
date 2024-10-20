import Link from "next/link";
import AuthModal from "./AuthModal";

function Navbar() {
  return (
    <div className="flex items-center justify-between">
      <Link href="/">
        <h1 className="text-3xl font-semibold">MyCalendar.com</h1>
      </Link>
      <AuthModal />
    </div>
  );
}

export default Navbar;
