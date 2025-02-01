import { DashboardInterface } from "./DashboardInterface";
import { SideBar } from "./SideBar"
import { Routes, Route} from 'react-router-dom';

function Layout({children}:{
    children: React.ReactNode
}) {

    return (

    <div className="grid md:grid-cols-12 font-inter min-h-screen grid-cols-1">
        <div className="md:col-span-4 lg:col-span-3 md:pl-6 md:border-r relative">
            <div className="md:fixed md:left-0 md:h-screen lg:w-[25%]">
                <SideBar />
            </div>
        </div>
        <div className="md:col-span-8 lg:col-span-9">{children}</div>
    </div>
    )
}

function Dashboard() {
  return (
    <Layout>
        <Routes>
            <Route path="/" element={<DashboardInterface /> } />
            <Route path="/chat" element={<h1>Dashboard</h1>} />
        </Routes>
    </Layout>
  )
}

export default Dashboard