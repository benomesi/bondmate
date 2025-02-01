import { MessageSquare } from 'lucide-react';
import {AuthUserDetails}from './AuthUserDetails';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RelationshipButton } from './RelationshipButton';
import RemainingMessages from './RemainingMessages';
import { useAppSelector } from '../../hooks/useAppSelector';


const Navigation = () => {
    const [isPremium, relationships] = useAppSelector((state) => [state.app.isPremium, state.app.relationships]);
    return (
        <div className="space-y-[1rem] mt-[3rem]">
            {!isPremium && <RemainingMessages />}
            {
                relationships.length > 0 && (
                    relationships.map((relationship) => (
                        <RelationshipButton key={relationship.id} relationship={relationship} />
                    ))  
                )
            }
        </div>
    );
};

const SiteLogo = () => {
    return (
        <Link to="/" className="flex space-x-3 items-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-poppins">
              BondMate
            </span>
        </Link>
    );
};

export const SideBar = () => {
    const [showMobileSideBar, setShowMobileSideBar] = useState(false);
    const {pathname} = useLocation()

    useEffect(() => {
        // close sidebar when route changes
        setShowMobileSideBar(false);
    }, [pathname, setShowMobileSideBar]);

    return (
        <>
            {showMobileSideBar ? (
                <MobileSideBar setShowMobileSideBar={setShowMobileSideBar} />
            ) : (
                <DesktopSideBar setShowMobileSideBar={setShowMobileSideBar} />
            )}
        </>
    );
};

const MobileSideBar = ({
    setShowMobileSideBar,
}: {
    setShowMobileSideBar: (show: boolean) => void;
}) => {
    // full screen mobile sidebar
    return (
        <div className="min-w-screen min-h-screen z-50 backdrop-blur-md fixed left-0 top-0 flex backdrop:bg-black backdrop-brightness-50">
            <div className="w-[80vw] bg-white p-6 flex flex-col space-y-3">
                <div className="flex-1">
                    <SiteLogo />
                    <div>
                        <Navigation />
                    </div>
                </div>
                <AuthUserDetails />
            </div>
            <div
                onClick={() => setShowMobileSideBar(false)}
                className="w-[20vw] flex justify-end items-start p-6"
            >
                <button onClick={() => setShowMobileSideBar(false)}>
                    <img
                        src="/icons/x-close.svg"
                        width={24}
                        height={24}
                        alt="Close"
                    />
                </button>
            </div>
        </div>
    );
};

const DesktopSideBar = ({
    setShowMobileSideBar,
}: {
    setShowMobileSideBar: (show: boolean) => void;
}) => {
    return (
        <div className="p-4 py-6 relative h-full w-full">
            <div className="flex items-center space-x-3 justify-between px-2">
                <SiteLogo />
                <button
                    onClick={() => setShowMobileSideBar(true)}
                    className="md:hidden"
                >
                    <img
                        src="/icons/menu-02.svg"
                        width={24}
                        height={24}
                        alt="open sidebar"
                    />
                </button>
            </div>

            <div className="hidden md:block">
                <Navigation />
            </div>

            <div className="bottom-0 absolute w-full right-0 p-4 hidden md:block">
                <AuthUserDetails />
            </div>
        </div>
    );
};