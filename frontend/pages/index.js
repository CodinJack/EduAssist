import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-5xl font-bold mb-4">Welcome to EduTA</h1>
        <p className="text-lg text-gray-700 mb-6">
          Your AI-powered Teaching Assistant for Personalized Learning
        </p>
        <div className="space-x-4">
          <a href="/login" className="px-6 py-2 bg-blue-600 text-white rounded-md">Get Started</a>
          <a href="/leaderboard" className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md">View Leaderboard</a>
        </div>
      </div>
    </>
  );
}
