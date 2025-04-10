import { getNotifications, onAuthenticateUser } from "@/actions/user"
import { getAllUserVideos, getWorkspaceFolders, getWorkSpaces, verifyAccessToWorkspace } from "@/actions/workspace"
import { redirect } from "next/navigation"
import React from "react"
import { dehydrate, HydrationBoundary,QueryClient } from "@tanstack/react-query"
import Sidebar from "@/components/global/sidebar"
type Props = {
    params: { workspaceId: string }
    children: React.ReactNode
}

const Layout = async ({params: {workspaceId},children}: Props) => {
    
    const auth = await onAuthenticateUser()

    //Check if user is authenticated and has a workspace
    if(!auth.user?.workspace) {
        return redirect('/auth/sign-in')
    }

    if(!auth.user.workspace.length) {
        return redirect('/auth/sign-in')
    }

    //Check if users have access to the workspace
    const hasAccess = await verifyAccessToWorkspace(workspaceId)

    if(hasAccess.status !== 200) {
        redirect(`/dashboard/${auth.user?.workspace[0].id}`)
    }

    if(!hasAccess.data?.workspace) {
        return null
    }

    const query= new QueryClient()
    await query.prefetchQuery({
        queryKey: ['workspace-folders'],
        queryFn: () => getWorkspaceFolders(workspaceId),
    })

    await query.prefetchQuery({
        queryKey: ['user-videos'],
        queryFn: () => getAllUserVideos(workspaceId),
    })

    await query.prefetchQuery({
        queryKey: ['user-workspaces'],
        queryFn: () => getWorkSpaces(),
    })

    await query.prefetchQuery({
        queryKey: ['user-notifications'],
        queryFn: () => getNotifications(),
    })

    return <HydrationBoundary state={dehydrate(query)}>
        <div className="flex h-screen w-screen">
            <Sidebar actionWorkspaceId = {workspaceId}/>
            
        </div>
    </HydrationBoundary>
}

export default Layout
