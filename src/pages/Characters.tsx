import { useEffect, useState } from "react"
import { CharacterCard } from "@/components/CharacterCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/ui/navbar";
import ScrollToTopButton from "@/components/ui/scrolltopbutton"


interface EpisodeDetail {
  id: string;
  name: string;
}

interface Character {
  id: number;
  name: string;
  image: string;
  species: string;
  status: string;
  gender: string;
  origin: { name: string };
  location: { name: string };
  episodeDetails: EpisodeDetail[];
}

interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

// Componente principal que muestra la lista paginada de personajes
export default function Characters() {
  const [characters, setCharacters] = useState<Character[]>([]) // Lista de personajes actuales
  const [page, setPage] = useState<number>(1)                   // Página actual para la paginación (osea la pagina incial)
  const [info, setInfo] = useState<ApiInfo | null>(null)        // Información adicional de la API (si es next, prev)
  const [loading, setLoading] = useState<boolean>(true)         // Estado de carga para mostrar spinner o mensaje de carga
  const [search, setSearch] = useState<string>("")                    // texto de búsqueda
  const [query, setQuery] = useState<string>("")                       // término enviado a la API

  // Limpia la búsqueda y vuelve al estado inicial
  const resetSearch = () => {
    setSearch("")
    setQuery("")
    setPage(1)
  }

  // Función para obtener los numeros de paginación
  const getSimplePageNumbers = (currentPage: number, totalPages: number) => {
    const maxPagesToShow = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2)) // Calcula la página inicial para mostrar
    let endPage = startPage + maxPagesToShow - 1 // Página final que se mostrará

    // Si el rango final se pasa el total de páginas, ajusta el rango para atrás
    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - maxPagesToShow + 1) // Ajusta la página inicial para mantener el rango maximo
    }

    const pages = []

    // Llena el arreglo con los números de página
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  // Función para obtener personajes y sus episodios desde la API según la página en la que esté
  const fetchCharacters = async (page: number, searchQuery: string = "") => {
    setLoading(true) // Muestra el indicador de carga
    try {
      // Si hay búsqueda, agrega &name= para filtrar en la API
      const url = searchQuery
        ? `https://rickandmortyapi.com/api/character?page=${page}&name=${searchQuery}`
        : `https://rickandmortyapi.com/api/character?page=${page}`

      const res = await fetch(url)
      if (!res.ok) {
        // Si no encuentra resultados, limpia lista e info
        setCharacters([])
        setInfo(null)
        setLoading(false)
        return
      }

      const data = await res.json()

      // Complementa cada personaje con los detalles de sus episodios y agrega el nombre en lugar de urls
      const enrichedCharacters = await Promise.all(
        data.results.map(async (char: any) => {
          // Extrae los ids de los episodios del personaje
          const episodeIds = char.episode.map((url: string) => url.split("/").pop())

          // Obtiene los detalles de los episodios
          const episodesRes = await fetch(`https://rickandmortyapi.com/api/episode/${episodeIds.join(",")}`)
          const episodesData = await episodesRes.json()

          // Asegura que los datos estén como un array
          const episodeDetails = Array.isArray(episodesData) ? episodesData : [episodesData]

          // Devuelve el personaje con los detalles de los episodios añadidos
          return {
            ...char,
            episodeDetails,
          }
        })
      )

      setCharacters(enrichedCharacters) // Guarda los personajes con el detalle
      setInfo(data.info)                // Guarda info para paginación
    } catch (error) {
      console.error("Error fetching characters:", error)
      setCharacters([])
      setInfo(null)
    } finally {
      setLoading(false) // Quita el indicador de carga
    }
  }

  // Cada vez que cambie la página o la búsqueda se ejecuta la carga
  useEffect(() => {
    fetchCharacters(page, query)
  }, [page, query])

  return (
    <>
      <Navbar search={search}
        setSearch={setSearch}
        onSearch={() => {
          setPage(1)     // Reset página a 1 al buscar
          setQuery(search) // Actualiza el término para búsqueda efectiva
        }}
        onReset={resetSearch}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">

        {/* Muestra un mensaje de carga o la grilla de personajes */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p> // Mostrar mientras carga
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {/* Mapea cada personaje y lo muestra con CharacterCard */}
            {characters.map((char) => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        )}

        <Separator className="mt-6" />

        {/* Botón para ir a la página anterior */}
        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={!info?.prev} // Deshabilita si no hay página anterior
          >
            Previous
          </Button>

          {/* Botones numéricos para páginas */}
          {getSimplePageNumbers(page, info?.pages || 1).map((pageNumber) => (
            <Button
              key={pageNumber}
              variant={pageNumber === page ? "default" : "outline"} // Resalta la página actual
              onClick={() => setPage(pageNumber)} // Cambia a la página correspondiente
            >
              {pageNumber}
            </Button>
          ))}

          {/* Botón para ir a la siguiente página */}
          <Button
            variant="outline"
            onClick={() => setPage((p) => (info?.next ? p + 1 : p))}
            disabled={!info?.next} // Deshabilita si no hay página siguiente
          >
            Next
          </Button>
        </div>
      </div>
      <ScrollToTopButton />
    </>
  )
}
