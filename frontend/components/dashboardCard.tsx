export default function DashboardCard({ title, value }: { title: string; value: string | number }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    );
  }
  