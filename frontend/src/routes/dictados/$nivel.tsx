import {createFileRoute, Link, useParams} from '@tanstack/react-router'
import {useQuery} from "@tanstack/react-query";
import {DictadoAPI} from "@/api/dictados.ts";
import {Button} from "@/components/ui/button.tsx";
import {useEffect, useRef, useState} from "react";
import {twMerge} from "tailwind-merge";

export const Route = createFileRoute('/dictados/$nivel')({
  component: RouteComponent,
})

function RouteComponent() {
  const {nivel} = useParams({from:Route.fullPath})
    const [showAnswer,setAnswer]=useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const {data,refetch}=useQuery({
    queryKey:["dictados",nivel],
    queryFn:async ()=>{
      return DictadoAPI.getRandomDictado(nivel);
    }
  })

    useEffect(()=>{
        const timeout = setTimeout(()=>{
            audioRef.current?.play();
        },1000)

        return ()=>{
            clearTimeout(timeout);
        }
    },[data])

  if(!data) return <p className="text-center mt-4">Cargando dictado...</p>

  return (
    <div className="flex flex-col items-center gap-4 mt-4 mx-auto w-1/2">
        <Link to="/dictados" className="self-start text-primary hover:underline">← Volver a niveles</Link>
      <h1 className="text-2xl font-bold">{nivel.replace("2.5","準2")}級 - Dictado</h1>
      <p className="text-lg text-center">Escucha el audio y escribe lo que diga.</p>
    <div className="h-100 w-[600px] relative">
        <div className={twMerge("absolute h-full w-full border-2 rounded-lg transition-all duration-500 z-10",showAnswer && "rotate-y-180")}>
        <img className={twMerge("transition-all w-full h-full duration-300",showAnswer&&"opacity-0")} src={`${import.meta.env.VITE_APP_NADE_URL}${data.imagen}`} alt="Imagen del dictado"/>
        </div>
        <div className={twMerge("absolute h-full w-full bg-white border-2 p-4 rounded-lg transition-all duration-500 rotate-y-180 flex justify-center items-center text-[30px] opacity-0 z-20",showAnswer && "rotate-y-0 opacity-100")}>
            <p className="text-center">「{data.frase}」</p>
        </div>
    </div>
      <audio ref={audioRef} controls src={`${import.meta.env.VITE_APP_NADE_URL}${data.audio}`} className="w-full max-w-md" />
        {showAnswer ? (
        <Button className="font-semibold" onClick={()=>{
            setAnswer(false);
            void refetch();
        }}>Nuevo dictado</Button>
            ): (
                <div className="flex justify-evenly w-full">
                    <Button className="font-semibold" onClick={()=>refetch()}>Otro dictado</Button>

                    <Button className="font-semibold" onClick={()=>setAnswer(true)}>Revelar respuesta</Button>
                </div>
            )}
    </div>
  )
}
