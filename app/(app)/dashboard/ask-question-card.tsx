'use client'
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-projects'

import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'sonner';
import CodeRefrenes from './code-refrences';

const AskQuestionCard = () => {
    const {project} = useProject()
    const [question, setQuestion] = useState<string>()
    const [open, setOpen] = useState(false)
    const [loading,setLoading] = useState(false)
    const [files, setFiles] = useState([])
    const [answer, setAnswer] = useState("")

    const onSubmit = async(e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        setAnswer("")
        setFiles([])
        if(!project?.id) return

        setLoading(true)


        const stream = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ask-question?project_id=${project.id}&question=${encodeURIComponent(question)}`, { withCredentials: true })
        stream.addEventListener("stop",(event)=>{
            
            stream.close()
            setLoading(false)
            console.log("steam closed")
        })
        stream.onmessage = function(event) {
            try {
                const msg = JSON.parse(event.data)
                if ( msg.hasOwnProperty('files') ) {
                    setFiles(msg.files);
                }
                if(msg.hasOwnProperty('candidates')){
                    setAnswer(prev => prev += msg.candidates[0].content.parts[0].text)
                }
            } catch (error) {
                toast(error.message)
            }
            
            // console.log(event.data)
            if ('stop' == event.data) {
                stream.close(); // stop retry
            }
        };
            

        setOpen(true)
        console.log(question)
    }

    const closeDialog = (e) => {
        setOpen(false);
        setQuestion("")
        setAnswer("")
        setFiles([])
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='sm:max-w-[80vw]'>
                    <DialogHeader>
                        <DialogTitle>
                            <Image src={"/logo.svg"} alt='doings' width={40} height={40}/>
                        </DialogTitle>
                    </DialogHeader>
                    <MDEditor.Markdown source={answer} className='p-5 max-w-[80vw] !h-full max-h-[30vh] overflow-scroll'/>
                    
                    <h1>Files Refrences:</h1>
                    
                    <CodeRefrenes filesRefrences={files}/>
                    <Button type='button' onClick={closeDialog}>
                        Close
                    </Button>
                </DialogContent>
            </Dialog>
            <Card className='relative col-span-3'>
                <CardHeader>
                    <CardTitle>Ask a Question</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea placeholder='Which file should I edit to change the home page' value={question} onChange={e => setQuestion(e.target.value)} />
                        <div className="h-4"></div>
                        <Button type='submit'>
                            Ask Doings!
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default AskQuestionCard