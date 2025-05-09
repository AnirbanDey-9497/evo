'use client'
import React, { useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import Loader from '../loader'
import FolderDuotone from '@/components/icons/folder-duotone'
import { useMutationData, useMutationDataState } from '@/hooks/useMutationData'
import { renameFolders } from '@/actions/workspace'
import { Input } from '@/components/ui/input'

type Props = {
    name: string
    id: string
    optimistic?: boolean
    count?: number
    workspaceId: string
}

const Folder = ({ id, name, optimistic, count, workspaceId }: Props) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const folderCardRef = useRef<HTMLDivElement | null>(null)
    const pathName = usePathname()
    const router = useRouter()
    const [onRename, setOnRename] = useState(false)

    const Rename = () => setOnRename(true)
    const Renamed = () => setOnRename(false)

    const { mutate, isPending } = useMutationData(
        ['rename-folders'],
        async (data: { name: string }) => {
            console.log('renameFolders mutation triggered')
            const response = await renameFolders(id, data.name)
            console.log('renameFolders response:', response)
            return response
        },
        ['workspace-folders', workspaceId],
        Renamed
    )

    const { latestVariables } = useMutationDataState(['rename-folders'])

    const handleFolderClick = () => {
        if(onRename) return
        router.push(`${pathName}/folder/${id}`)
    }

    const handleNameDoubleClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
        e.stopPropagation()
        Rename()
    }

    const updateFolderName = (e: React.FocusEvent<HTMLInputElement>) => {
        if(inputRef.current) {
            if(inputRef.current.value) {
                mutate({name: inputRef.current.value})
            } else {
                Renamed()
            }
        }
    }

    return (
        <div 
        onClick={handleFolderClick}
        ref={folderCardRef}
        className={cn(optimistic && 'opacity-60',
            'flex hover:bg-neutral-800 cursor-pointer transition duration-150 items-center gap-2 justify-between min-w-[250px] py-4 px-4 rounded-lg  border-[1px]')}
        >
            <Loader state={isPending}>
                <div className="flex flex-col gap-[1px]">
                    {onRename ? (
                        <Input 
                            onBlur={updateFolderName}
                            autoFocus
                            defaultValue={name}
                            className="border-none text-base w-full outline-none text-neutral-300 bg-transparent p-0"
                            ref={inputRef}
                        />
                    ) : (
                        <p 
                            onClick={(e) => e.stopPropagation()}
                            className="text-neutral-300"
                            onDoubleClick={handleNameDoubleClick}
                        >
                            {name}
                        </p>
                    )}
                    <span className="text-sm text-neutral-500">{count || 0} videos</span>
                </div>
            </Loader>
            <FolderDuotone />
        </div>
    )
}

export default Folder