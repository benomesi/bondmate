import { LogOut, CircleUser} from 'lucide-react';

export const AuthUserDetails = () => {
  
    const userDetails = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'realjohndoe@example.com'
    }
    return (
    <div className="flex items-start justify-between space-x-3 p-1 py-6 border-t border-[#EAECF0] md:w-[110%] lg:w-full">
    <div className='space-y-3'>
        <span className="text-[0.875rem] font-semibold flex items-center space-x-3 cursor-pointer">
            <CircleUser />
            <span>
                {userDetails?.first_name} {userDetails?.last_name}
            </span>
        </span>
        <p className="text-[#475467] text-[0.875rem]">
            {userDetails?.email}
        </p>
    </div>
    <LogOut />
</div>
  )
}
