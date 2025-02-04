import { motion } from "framer-motion";
interface DashboardCardProps{
    title : string, 
    value : number
}
export function DashboardCard({ title, value } : DashboardCardProps) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg text-center"
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </motion.div>
    );
  }
  