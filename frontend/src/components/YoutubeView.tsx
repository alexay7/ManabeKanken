import {useState} from "react";
import {Youtube} from "lucide-react";

export default function YoutubeView() {
    const [youtubeLink, setYoutubeLink] = useState("");
    const [showModal, setShowModal] = useState(false);

    return(
        <div className={`fixed top-0 right-0 w-[400px] h-full bg-white shadow-lg p-4 transition-transform ${showModal ? "translate-x-0" : "translate-x-full"}`}>
            <button onClick={()=>setShowModal(!showModal)} className="absolute top-1/2 -left-2 transform -translate-x-full -translate-y-1/2 bg-white px-2 py-1 rounded h-[200px] border border-gray-300 shadow w-[40px]">
                {showModal ? <span className="size-6 text-red-500 text-2xl font-sans">ｘ</span> : <Youtube className="size-6 text-red-500"/>}
            </button>
            <h2 className="text-xl font-bold mb-4">Cargar video de YouTube</h2>
            <input type="text" onChange={(e)=> {
             if (e.target.value.includes("youtube.com") || e.target.value.includes("youtu.be")) {
                 // remove all the parameters and hashes from the link except the video id
                 const url = new URL(e.target.value);
                 const videoId = url.searchParams.get("v") || url.pathname.split("/").pop();
                 url.pathname = "/embed/" + videoId;
                 url.search = "";
                 url.hash = "";
                 setYoutubeLink(url.toString());
             } else {
                 setYoutubeLink("");
             }
            }} placeholder="Pega el enlace de YouTube aquí" className="w-full p-2 border border-gray-300 rounded mb-4"/>
            {youtubeLink && (
                <div className="aspect-w-16 aspect-h-9">
                    <iframe src={youtubeLink.replace("watch?v=","embed/")} title="YouTube video player" frameBorder="0" allowFullScreen className="w-full h-[700px]"></iframe>
                </div>
            )}
        </div>
    )
}