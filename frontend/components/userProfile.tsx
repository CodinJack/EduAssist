export default function UserProfile({ username, rank }: { username: string; rank: number }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 text-black">
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl">
          {username[0].toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{username}</h2>
          <p className="text-gray-500">Rank: #{rank}</p>
        </div>
      </div>
    );
  }
  