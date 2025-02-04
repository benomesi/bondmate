import { DashboardInterface } from "./DashboardInterface";
import { SideBar } from "./SideBar";
import { useAppSelector } from '../../hooks/useAppSelector';
import { OnboardingWizard } from '../onboarding/OnboardingWizard';

function Layout({children}:{
    children: React.ReactNode
}) {
    return (
        <div className="md:grid md:grid-cols-12 font-inter min-h-screen">
            <div className="md:col-span-4 lg:col-span-3 md:pl-6 md:border-r relative z-10">
                <div className="md:fixed md:left-0 md:h-screen lg:w-[25%]">
                    <SideBar />
                </div>
            </div>
            <div className="md:col-span-8 lg:col-span-9 flex flex-col">
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