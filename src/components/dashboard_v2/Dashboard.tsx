import { DashboardInterface } from "./DashboardInterface";
import { SideBar } from "./SideBar";
import { useAppSelector } from '../../hooks/useAppSelector';
import { OnboardingWizard } from '../onboarding/OnboardingWizard';

function Layout({children}:{
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col md:flex-row font-inter min-h-screen">
            <div className="md:col-span-4 md:border-r z-10 md:w-[35%] lg:w-[25%] relative">
                <div className="md:h-screen fixed md:sticky top-0 z-10 bg-white border-r border-gray-200 w-full">
                    <SideBar />
                </div>
            </div>
            <div className="flex flex-col flex-1">
                {children}
            </div>
        </div>
    );
}

function Dashboard() {
    const { hasCompletedOnboarding, isLoading } = useAppSelector((state) => state.app);

    // Show loading state while checking onboarding status
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                </div>
            </div>
        );
    }

    // Show onboarding wizard for new users
    if (!hasCompletedOnboarding) {
        return <OnboardingWizard />;
    }

    return (
        <Layout>
            <DashboardInterface />
        </Layout>
    );
}

export default Dashboard;