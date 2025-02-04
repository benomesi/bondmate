import { LogOut, CircleUser} from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { clearAuth } from '../../store/slices/authSlice';
import { useState } from 'react';
import { ProfileModal } from '../ProfileModal';

export const AuthUserDetails = () => {
    const profile = useAppSelector((state) => state.app.profile);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            dispatch(clearAuth());
            navigate('/auth/sign-in');
        } catch (error) {
            console.error('Sign out error:', error);
            dispatch(clearAuth());
            navigate('/auth/sign-in');
        }
    };

    if (!profile) return null;

    return (
        <>
            <div className="flex items-start justify-between space-x-3 p-1 py-6 border-t border-[#EAECF0] md:w-[100%] lg:w-full">
                <div 
                    className='space-y-3 cursor-pointer hover:opacity-80 transition-opacity'
                    onClick={() => setIsProfileModalOpen(true)}
                >
                    <span className="text-[0.875rem] font-semibold flex items-center space-x-3">
                        <CircleUser />
                        <span>{profile.name}</span>
                    </span>
                    <p className="text-[#475467] text-[0.875rem]">
                        Click to edit profile
                    </p>
                </div>
                <button 
                    onClick={handleSignOut}
                    className="hover:text-red-500 transition-colors"
                >
                    <LogOut />
                </button>
            </div>

            <ProfileModal 
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </>
    );
}