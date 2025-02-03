import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="text-2xl font-bold">EduTA</Link>
        <div className="space-x-4">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/leaderboard" className="hover:underline">Leaderboard</Link>
          <Link href="/practice" className="hover:underline">Practice</Link>
          <Link href="/chatbot" className="hover:underline">Chatbot</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
