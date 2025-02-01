import { Edit, Trash2, Users } from "lucide-react";
import { Relationship } from "../../types";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setSelectedRelationship } from "../../store/slices/appSlice";


interface PressableProps {
    children: React.ReactNode;
    onClick: () => void;
}


const Pressable = ({ children, onClick }:PressableProps) => {
    return   <button
    onClick={
        (e) => {
            e.stopPropagation();
            onClick();
        }
    }   
    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
  >
    {children}
</button>
}

    


export const RelationshipButton = ({
   relationship
}:{
    relationship:Relationship}) => {
    const { name } = relationship;
    const dispatch = useAppDispatch();
    
    const handleRelationshipClick = () => {
        dispatch(setSelectedRelationship(relationship));
    }

    return (
        <div 
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white cursor-pointer transition-all duration-200 group p-3 rounded-lg mb-1 justify-between"
            onClick={handleRelationshipClick}
        >
            <span className="flex items-center space-x-6">
                <Users className="w-5 h-5" />
                <span>{name}</span>
            </span>

            <span className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Pressable onClick={() => console.log('Edit')}>
                    <Edit className="w-4 h-4" />
                </Pressable>
                <Pressable onClick={() => console.log('Delete')}>
                    <Trash2 className="w-5 h-5" />
                </Pressable>
            </span>
        </div>
  )
}
