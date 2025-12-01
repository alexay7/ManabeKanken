import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import {createFileRoute, useRouter} from '@tanstack/react-router'
import DiscordIcon from "@/assets/discord.svg?react";
import ManabeIcon from "@/assets/manabe.svg?react";
import {useState, type FormEvent} from "react";
import { Button } from '@/components/ui/button';
import {toast} from "sonner";
import {useExamStore} from "@/stores/exam-store.ts";
import {ExamAPI} from "@/api/exam.ts";
import {History} from "lucide-react";

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
    const {navigate} = useRouter()

    const [username,setUsername]=useState(localStorage.getItem("username")||"");
    const [level,setLevel]=useState(localStorage.getItem("lastLevel")||"");
    const [strict,setStrict]=useState(false);

    const {setExam} = useExamStore();

    async function handleSubmit(e:FormEvent) {
        if(!level.length){
            toast.error("Selecciona un nivel para el examen");
            e.preventDefault()
            e.stopPropagation();
            return;
        }

        e.preventDefault();

        const exercises = await ExamAPI.getRandomExam(level);

        setExam(exercises);

        localStorage.setItem("username",username);
        localStorage.setItem("lastLevel",level);
        localStorage.removeItem("currentAnswers");
        localStorage.removeItem("examTime");

        await navigate({to: level,search:{strict}});
    }

  return (
      <div className="flex justify-center items-center h-[calc(100vh-9rem)] w-full">
          <div className="flex flex-col gap-2 w-[90%] md:w-1/3">
              <form className="flex flex-col gap-4 bg-dark mx-auto bg-gray-200 p-4 rounded-lg select-none text-black" onSubmit={handleSubmit}>
                  <p className='text-xl font-semibold'>Generar examen Kanken</p>

                  <div className="flex flex-col gap-1">
                      <label className='text-left'>Nombre del solicitante</label>
                      <input value={username} onChange={(e)=>{
                          setUsername(e.target.value)
                      }} type="text" className="py-2 px-3 text-sm border border-gray-200 border-solid h-10 rounded-md bg-white" placeholder="Nombre" />
                  </div>

                  <div className="flex gap-1 flex-col">
                      <label className='text-left'>Selecciona el nivel del examen</label>
                      <Select value={level} onValueChange={(v) => {
                          setLevel(v)
                      }}>
                          <SelectTrigger className="bg-white w-full">
                              <SelectValue placeholder="Selecciona un nivel" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectGroup>
                                  <SelectLabel>Niveles Kanken</SelectLabel>
                                  <SelectItem value="10">10級</SelectItem>
                                    <SelectItem value="9">9級</SelectItem>
                                    <SelectItem value="8">8級</SelectItem>
                                    <SelectItem value="7">7級</SelectItem>
                                    <SelectItem value="6">6級</SelectItem>
                                    <SelectItem value="5">5級</SelectItem>
                                    <SelectItem value="4">4級</SelectItem>
                                    <SelectItem value="3">3級</SelectItem>
                                    <SelectItem value="pre2">準2級</SelectItem>
                                    <SelectItem value="2">2級</SelectItem>
                              </SelectGroup>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                      <div className="flex items-center space-x-2">
                          <Checkbox className="bg-white" id="terms" checked={strict} onCheckedChange={(c)=>{
                              setStrict(c as boolean)
                          }}/>
                          <label
                              htmlFor="terms"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                              Modo estricto
                          </label>
                      </div>
                      <p className='text-sm text-left text-gray-600'>Al acabarse el tiempo, el examen acabará automáticamente y guardará las respuestas que tengas marcadas.</p>
                  </div>

                  <div className="flex w-full justify-between flex-col md:flex-row gap-2">
                      <Button type="submit" onClick={(e)=>{
                          if(!username?.length){
                              toast.error("Introduce tu nombre antes de iniciar el examen");
                              e.preventDefault()
                              e.stopPropagation();
                              return;
                          }
                      }}>Generar examen</Button>
                      <Button type="button" variant="secondary" onClick={()=>{
                            void navigate({to:"/past-exams" })
                      }}>
                          <History/> Resultados anteriores
                      </Button>
                  </div>
              </form>
              <div className="flex justify-end gap-4 items-center">
                  <a href="https://manabe.es/" className="flex justify-center items-center">
                      <ManabeIcon className='text-[#00c189]' width={50} height={50}/>
                  </a>
                  <a href="https://discord.gg/y8P7mpDTcB" className="flex justify-center items-center">
                      <DiscordIcon className='text-[#636ef6]' width={50} height={50}/>
                  </a>
              </div>
          </div>
      </div>
  )
}
