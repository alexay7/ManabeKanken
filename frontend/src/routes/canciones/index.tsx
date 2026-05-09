import {createFileRoute, Link} from '@tanstack/react-router'
import {useEffect, useState, useCallback, useRef, type FormEvent, type ReactNode} from "react";
import {Search, ChevronLeft, ChevronRight} from "lucide-react";
import {SongsAPI, type SongType} from "@/api/songs";

export const Route = createFileRoute('/canciones/')({
    component: RouteComponent,
})

function RouteComponent() {
    const [search, setSearch] = useState("");
    const [songs, setSongs] = useState<SongType[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const limit = 24;

    const loadSongs = useCallback(async (searchVal: string, pageNum: number) => {
        setLoading(true);
        setError(null);
        try {
            const result = await SongsAPI.search(searchVal, pageNum, limit);
            setSongs(result.songs);
            setTotal(result.total);
        } catch (e) {
            console.error("Error fetching songs:", e);
            setError("Error al cargar las canciones. Inténtalo de nuevo.");
            setSongs([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
    const debouncedSearch = useCallback((value: string, pageNum: number) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            void loadSongs(value, pageNum);
        }, 300);
    }, [loadSongs]);

    useEffect(() => {
        setPage(1);
        debouncedSearch(search, 1);
    }, [search, debouncedSearch]);

    function handlePageChange(newPage: number) {
        setPage(newPage);
        void loadSongs(search, newPage);
    }

    function handleSearchSubmit(e: FormEvent) {
        e.preventDefault();
        setPage(1);
        void loadSongs(search, 1);
    }

    const maxPages = Math.ceil(total / limit);

    function renderPageButtons(): ReactNode[] {
        const buttons: ReactNode[] = [];
        const startPage = Math.max(1, page - 2);
        const endPage = Math.min(maxPages, page + 2);

        if (startPage > 1) {
            buttons.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className="px-2 py-1 rounded hover:bg-gray-100 text-sm"
                >1</button>
            );
            if (startPage > 2) {
                buttons.push(<span key="ellipsis-start" className="px-1">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    disabled={i === page}
                    className={`px-2 py-1 rounded text-sm ${
                        i === page
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100"
                    }`}
                >{i}</button>
            );
        }

        if (endPage < maxPages) {
            if (endPage < maxPages - 1) {
                buttons.push(<span key="ellipsis-end" className="px-1">...</span>);
            }
            buttons.push(
                <button
                    key={maxPages}
                    onClick={() => handlePageChange(maxPages)}
                    className="px-2 py-1 rounded hover:bg-gray-100 text-sm"
                >{maxPages}</button>
            );
        }

        return buttons;
    }

    return (
        <div className="mt-4 mx-4 flex flex-col items-center w-full">
            <Link to="/" className="self-start text-primary hover:underline">← Volver a inicio</Link>

            <div className="w-full max-w-4xl">
                <h1 className="text-2xl font-bold mb-2">Dictado de canciones</h1>
                <p className="text-muted-foreground text-sm mb-6">
                    Selecciona o busca canciones para practicar kanji con letras de canciones.
                </p>

                {/* Search form */}
                <form onSubmit={handleSearchSubmit} className="mb-4">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por título, artista o medio..."
                                className="w-full bg-white pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                        >
                            Buscar
                        </button>
                    </div>
                </form>

                {/* Results info */}
                {(search) && (
                    <p className="text-sm text-muted-foreground mb-3">
                        {total > 0
                            ? `${total} resultado${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`
                            : "No se encontraron resultados."
                        }
                    </p>
                )}
                {/* Skeleton loading state */}
                {loading && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Array.from({length: 8}).map((_, i) => (
                            <div
                                key={i}
                                className="p-4 bg-white border border-gray-200 rounded-lg animate-pulse"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                        <style>{`
                            @keyframes shimmer {
                                0% { opacity: 0.6; }
                                50% { opacity: 1; }
                                100% { opacity: 0.6; }
                            }
                            .animate-pulse {
                                animation: shimmer 1.5s ease-in-out infinite;
                            }
                        `}</style>
                    </>
                )}

                {/* Error state */}
                {error && (
                    <div className="text-center py-12 text-red-500">
                        <p>{error}</p>
                    </div>
                )}

                {/* Empty results */}
                {!loading && !error && search && total === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
                        <p>No se encontraron canciones con esos criterios.</p>
                        <p className="text-sm mt-1">Prueba con otros términos o nivel.</p>
                    </div>
                )}

                {/* Song list */}
                {!loading && songs.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {songs.map(song => (
                                <Link
                                    key={song._id}
                                    to="/canciones/cancion/$cancion"
                                    params={{cancion: song._id}}
                                    className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-primary/50 hover:shadow-md transition-shadow group"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                                                {song.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {song.artist}
                                            </p>
                                            {song.media && (
                                                <p className="text-xs text-muted-foreground/70 mt-1 truncate">
                                                    {song.media}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {maxPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page <= 1}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Anterior</span>
                                </button>

                                <div className="flex items-center gap-1">
                                    {renderPageButtons()}
                                </div>

                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page >= maxPages}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                                >
                                    <span className="hidden sm:inline">Siguiente</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
