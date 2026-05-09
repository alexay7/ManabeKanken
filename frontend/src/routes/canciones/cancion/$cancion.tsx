import {createFileRoute, Link, useParams} from '@tanstack/react-router'
import {useState} from "react";
import YoutubeView from "@/components/YoutubeView.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Settings2} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import {SongsAPI} from "@/api/songs.ts";

const niveles = [
  { label: "10", value: 10 },
  { label: "9", value: 9 },
  { label: "8", value: 8 },
  { label: "7", value: 7 },
  { label: "6", value: 6 },
  { label: "5", value: 5 },
  { label: "4", value: 4 },
  { label: "3", value: 3 },
  { label: "準2", value: 2.5 },
  { label: "2", value: 2 },
  { label: "準1", value: 1.5 },
  { label: "1", value: 1 },
] as const

export const Route = createFileRoute('/canciones/cancion/$cancion')({
  component: RouteComponent
})

function RouteComponent() {
  const {cancion} = useParams({from:Route.fullPath})

  const [currentLevel,setCurrentLevel] = useState(0);
  const [levelSelectorOpen,setLevelSelectorOpen] = useState(!currentLevel);

  const [mode,setMode]=useState<"hidekanjis"|"hidereadings"|"hideall">("hidekanjis")
  const [shownIndex,setShownIndex]=useState(0)

  const {data}=useQuery({
    queryKey:["song",cancion],
    queryFn: async ()=>{
      return SongsAPI.getSongInfo(cancion);
    }
  })

  // [kanji](lectura)
  function formatLine(line:string, showLine:boolean){
    if(showLine){
      // Si se fuerza mostrar la línea se muestra el kanji y se ignora la lectura
      return line.replace(/\[([^\]]+)]\(([^)]+)\)/g, (_, kanji) => {
        return `${kanji.split(":")[0]}`;
      });
    }

    switch (mode) {
      case "hidekanjis":
        // Si está en modo hide kanjis, crear un hueco en blanco para el kanji y no mostrar la lectura en formato [ _ ], añadir tantos _ como kanjis tenga la palabra
        return line.replace(/\[([^\]]+)]\(([^)]+)\)/g, (_, kanji) => {
          const wordLevel = parseInt(kanji.split(":")[1] || "1");

          if(wordLevel<currentLevel){
            return `${kanji.split(":")[0]}`;
          }

          return `${kanji.split(":")[0].replace(/[\u3040-\u30FF\u4E00-\u9FFF]/g, " ⬜️ ")}`;
        });
      case "hidereadings":
        // Si está en modo hide readings, crear un hueco en blanco para el kanji y mostrar la lectura return line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "[$2]");
            return line.replace(/\[([^\]]+)]\(([^)]+)\)/g, (_, kanji, reading) => {
              const wordLevel = parseInt(kanji.split(":")[1] || "1");

              if(wordLevel<currentLevel){
                return `${kanji.split(":")[0]}`;
              }

              return `[${reading}]`;
            });
      case "hideall": {
        // Si está en modo hide all ocultar todo lo que sea un kana o un kanji en formato  _ , añadir tantos _ como caracteres tenga la palabra, mostrar los kanjis de nivel
        const noKanjisNorKanas = line.replace(/\[([^\]]+)]\(([^)]+)\)/g, (_, kanji) => {
          const wordLevel = parseInt(kanji.split(":")[1] || "1");

          if(wordLevel<currentLevel){
            return `${kanji.split(":")[0]}`;
          }

          return kanji.split(":")[0].replace(/[\u3040-\u30FF\u4E00-\u9FFF]/g, " ⬜️ ");
        }).replace(/[\u3040-\u30FF]/g, " ⬜️ ");


        // Eliminar los paretensis y sus contenidos
        const noLecturas = noKanjisNorKanas.replace(/\([^)]+\)/g, "");
        // Eliminar los corchetes
        const noWrapper = noLecturas.replace(/[[\]]/g, "");
        // Eliminar nivel de cada palabra ej :3
        return noWrapper.replace(/:\d+(\.\d+)?/g, "");
      }
      default:
        return line;
    }
  }

  function renderLine(line:string,index:number){
    if(index<shownIndex){
      return (
          <p className="font-bold">{formatLine(line,true)}</p>
      )
    }

    return (
        <p className="text-gray-500">{formatLine(line,false)}</p>
    )
  }

  if(!data){
    return (
      <div className="mt-4 mx-4 flex flex-col items-center w-full max-w-[1400px]">
        <Link to="/canciones" className="self-start text-primary hover:underline">← Volver a niveles</Link>
        <br/>
        <p className="text-3xl text-center">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="mt-4 mx-4 flex flex-col items-center w-full max-w-[1400px]">
      <Link to="/canciones" className="self-start text-primary hover:underline">← Volver a niveles</Link>
      <br/>
      <div className="w-full max-w-3xl mb-6">
        {currentLevel?(
          <p className="text-3xl text-center">{currentLevel%1===0?currentLevel:niveles.find(nivel=>nivel.value===currentLevel)?.label
          }級</p>
        ):""}
        <h1 className="text-2xl font-bold text-center">{data.title}</h1>
        <p className="text-center text-muted-foreground text-lg">{data.artist}</p>
      </div>

      <div className="flex justify-center items-center w-full mb-4 gap-2">
        <Button variant="outline" size="sm" onClick={()=>setLevelSelectorOpen(true)}>
          <Settings2 className="w-4 h-4 mr-1"/>
          Nivel
        </Button>
        <button onClick={()=>setMode("hidekanjis")} className={`px-4 py-2 rounded ${mode==="hidekanjis"?"bg-primary text-white":"bg-gray-200 text-gray-700"}`}>Ocultar kanjis</button>
        <button onClick={()=>setMode("hidereadings")} className={`ml-2 px-4 py-2 rounded ${mode==="hidereadings"?"bg-primary text-white":"bg-gray-200 text-gray-700"}`}>Ocultar kanjis (con lecturas)</button>
        <button onClick={()=>setMode("hideall")} className={`ml-2 px-4 py-2 rounded ${mode==="hideall"?"bg-primary text-white":"bg-gray-200 text-gray-700"}`}>Ocultar kanjis y kana</button>
      </div>

      <Dialog open={levelSelectorOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Nivel de Kanji</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {niveles.map(nivel => (
              <Button
                key={nivel.value}
                variant={currentLevel === nivel.value ? "default" : "outline"}
                onClick={() => {
                  setCurrentLevel(nivel.value);
                  setLevelSelectorOpen(false);
                }}
                className="w-full"
              >
                {nivel.label}級
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <button onClick={()=>setShownIndex(shownIndex+1)} className="px-4 py-2 rounded bg-primary text-white">Siguiente línea</button>
      </div>

      <div className="w-full max-w-3xl flex flex-col items-center text-xl font-mono">
        {data.lyrics.map((line,index) => renderLine(line,index))}
      </div>

      <YoutubeView/>
    </div>
  )
}
