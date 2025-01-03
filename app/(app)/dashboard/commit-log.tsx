'use client'

import useProject from '@/hooks/use-projects'
import axios from '@/lib/axios'
import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const CommitLog = () => {

    const {project} = useProject()
    const [commitLogs, setCommitLogs] = useState([])

    useEffect(()=>{ 
        axios.get(`/api/projects/${project?.id}/commitlogs`)
        .then((response)=>{
            setCommitLogs(response.data)
        })

    },[project])

  return (

    <div>
        <ul className='space-y-6'>
            {commitLogs?.map((commit, commitIndex) => {
                return <li key={commit.id} className='relative flex gap-x-4'>
                    <div className={cn(
                        commitIndex === commitLogs.length -1 ? 'h-0' : '-bottom-6',
                        'absolute left-0 top-0 flex w-6 justify-center'
                    )}>
                        <div className='w-px translate-x-1 bg-gray-200'></div>
                    </div>
                    <>
                        <img src={commit.authorAvatar} alt="author avatar"  className='relative mt-4 size-8 flex-none rounded-full bg-gray-50'/>
                        <div className="flex-auto rounded-md bg-white p-3 ring-1 ring-inset ring-gray-200">
                            <div className="flex justify-between gap-x-4">
                                <Link target='_blank' href={`${project.repoUrl}/commits/${commit.hash}`} className='py-0.5 text-xs leading-5 text-gray-500'>
                                    <span className="font-medium text-gray-900">
                                        {commit.authorName}
                                    </span> {" "}
                                    <span className="inline-flex items-center">
                                        commited
                                        <ExternalLink className='ml-1 size-4'/>
                                    </span>
                                </Link>
                            </div>
                            <span className="font-semibold">
                                {commit.message}
                            </span>
                            <pre className='mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-500'>
                                {commit.summary}
                            </pre>
                        </div>
                    </>

                </li>
            })}
        </ul>
    </div>
  )
}

export default CommitLog