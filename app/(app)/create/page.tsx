"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useProject from '@/hooks/use-projects'
import axios from '@/lib/axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type FormInput = {
    repoUrl: string
    projectName: string
    githubToken?: string
}

const CreatePage = () => {
    const {register, handleSubmit, reset } = useForm<FormInput>()
    const [status, setStatus] = useState(false)
    const {reFetchProjects} = useProject()

    function onSubmit(data: FormInput){
        setStatus(true)
        axios
            .post('/api/projects',data)
            .then((response) => {
                setStatus(false)
                toast.info("Project created successfully")
                reFetchProjects()
                reset()
            }).catch((err)=>{
                toast.error(err.response.data.error)
                setStatus(false)
                toast.error(err.message)
            })
        
        
        return true
    }

  return (
    <div className='flex items-center gap-12 h-full justify-center'>
        <img alt='github' src='/undraw_github.svg' className='h-56 w-auto'/>
        <div>
            <div>
                <h1 className='font-semibold text-2xl'>
                    Link your GitHub Repository
                </h1>
                <p className='text-sm text-muted-foreground'>
                    Enter the URL of your repositoru to link it ot Doings
                </p>
            </div>
            <div className="h-4"></div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input 
                        {...register('projectName',{required:true})}
                        placeholder='Project Name'
                        required
                    />
                    <div className="h-2"></div>
                    <Input 
                        {...register('repoUrl',{required:true})}
                        placeholder='Github URL'
                        required
                    />
                    <div className="h-2"></div>
                    <Input 
                        {...register('githubToken')}
                        placeholder='Github Token (Optional)'
                    />
                    <div className="h-4"></div>
                    <Button type='submit' disabled={status}>
                        Create Project
                    </Button>

                </form>

            </div>
        </div>


    </div>
  )
}

export default CreatePage