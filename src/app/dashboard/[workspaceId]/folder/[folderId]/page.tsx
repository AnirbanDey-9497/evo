import { getAllUserVideos, getFolderInfo, getWorkspaceFolders } from '@/actions/workspace'
import FolderInfo from '@/components/global/folders/folder-info'
import Videos from '@/components/global/videos'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'

type Props = {
    params: {
        workspaceId: string
        folderId: string
    }
}

const page =async({params: {workspaceId, folderId}}: Props) => {
    const query = new QueryClient()
    await query.prefetchQuery({
        queryKey: ['folder-videos'],
        queryFn: () => getAllUserVideos(folderId)
    })

    await query.prefetchQuery({
        queryKey: ['folder-info'],
        queryFn: () => getFolderInfo(folderId)
    })
  return (
    <HydrationBoundary state={dehydrate(query)}>
        <FolderInfo folderId={folderId} />
        <Videos workspaceId={workspaceId} folderId={folderId} videosKey='folder-videos' />
    </HydrationBoundary>
  )
}

export default page