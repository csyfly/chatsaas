import { FaCheckCircle, FaCircle, FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { Goal } from "@/lib/prisma";

const StatusIcon = ({ status, onClick }: { status: Goal['status']; onClick: () => void }) => {
    const iconClass = "cursor-pointer";
    switch (status) {
      case 'notStarted':
        return <FaCircle className={`text-gray-400 ${iconClass} min-w-4 min-h-4`} onClick={onClick} size={16} />;
      case 'inProgress':
        return <FaPlayCircle className={`text-blue-500 ${iconClass} min-w-4 min-h-4`} onClick={onClick} size={16} />;
      case 'completed':
        return <FaCheckCircle className={`text-green-500 ${iconClass} min-w-4 min-h-4`} onClick={onClick} size={16} />;
      case 'suspended':
        return <FaPauseCircle className={`text-yellow-500 ${iconClass} min-w-4 min-h-4`} onClick={onClick} size={16} />;
    }
  };

  export default StatusIcon;