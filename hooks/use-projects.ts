import axios from "@/lib/axios"
import { useEffect, useState } from "react"
import {useLocalStorage} from "usehooks-ts"

const useProject =  () => {


    const [projects,setProjects] = useState([])
    
    
    const [projectId, setProjectId] = useLocalStorage('doings-projectId','')
    const project = projects?.find(project => project.id === projectId)

    function reFetchProjects(){
        axios.get('/api/projects').then((response)=>{
            setProjects(response.data)
        })
    }

    useEffect(()=>{
        reFetchProjects()    
    },[])
       
    return {
        projects,
        project,
        projectId,
        setProjectId,
        reFetchProjects
    }
}

export default useProject