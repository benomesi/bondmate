import { Edit, Trash2, Users } from "lucide-react";
import { Relationship } from "../../types";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setSelectedRelationship, deleteRelationship } from "../../store/slices/appSlice";
import { useState } from "react";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { RelationshipModal } from "../RelationshipModal";
import { relationshipService } from "../../services/relationships";

interface RelationshipButtonProps {
    relationship: Relationship;
}

export const RelationshipButton = ({ relationship }: RelationshipButtonProps) => {
    const { name } = relationship;
    const dispatch = useAppDispatch();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    
    const handleRelationshipClick = () => {
        dispatch(setSelectedRelationship(relationship));
    };

    const handleDelete = async () => {
        try {
            const { error } = await relationshipService.deleteRelationship(relationship.id);
            if (error) throw error;
            dispatch(deleteRelationship(relationship.id));
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error('Failed to delete relationship:', error);
        }
    };

    return (
        <>
            <div 
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white cursor-pointer transition-all duration-200 group p-3 rounded-lg mb-1 justify-between"
                onClick={handleRelationshipClick}
            >
                <span className="flex items-center space-x-6">
                    <Users className="w-5 h-5" />
                    <span>{name}</span>
                </span>

                <span className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowEditModal(true);
                        }}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(true);
                        }}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </span>
            </div>

            <DeleteConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                name={name}
            />

            <RelationshipModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                relationship={relationship}
            />
        </>
    );
};