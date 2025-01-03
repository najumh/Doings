'use client'

import { SidebarProvider } from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/auth'
import React from 'react'
import UserButton from './UserButton'
import { AppSidebar } from './dashboard/app-sidebar'

type Props = {
    children : React.ReactNode
}

const SidbarLayout = ({children}:Props) => {
    const { user } = useAuth({ middleware: 'auth' })

  return (
    <SidebarProvider>
        <AppSidebar />
        <main className='w-full m-2'>
            <div className='flex items-center gap-2 border-sidebar bg-sidebar border shadow rounded-md p-2 px-4'>
                {/* <SearchBar /> */}
                <div className='ml-auto'></div>
                <UserButton user={user}/>
            </div>
            <div className='h-4'></div>
            <div className='border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-scroll h-[calc(100vh-6rem)] p-4'>
                {children}
            </div>
            

        </main>
    </SidebarProvider>
    
  )
}

export default SidbarLayout