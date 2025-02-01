import { useAppSelector } from "../../hooks/useAppSelector";

const TOTAL_FREE_MESSAGES = 10;

const RemainingMessages = () => {

    const { messageCount} = useAppSelector((state) => state.app);
    const remainingMessages = TOTAL_FREE_MESSAGES - messageCount;
    const messageProgress = (messageCount / TOTAL_FREE_MESSAGES) * 100;
    
    return (
        <div className="p-8 bg-gray-100 rounded-lg space-y-4 my-12">
            <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium  dark:text-gray-300' text-gray-700">
                Free Messages Remaining
            </span>
            <span className="text-sm dark:text-gray-400' 'text-gray-500">
                {remainingMessages} / 10
            </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${messageProgress}%` }}
            />
          </div>
        </div>
  )
}

export default RemainingMessages