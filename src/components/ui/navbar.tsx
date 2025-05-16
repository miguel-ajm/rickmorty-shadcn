import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

type NavbarProps = {
  search: string
  setSearch: (val: string) => void
  onSearch: () => void
  onReset: () => void
}

export default function Navbar({ search, setSearch, onSearch, onReset }: NavbarProps) {
  return (
    <header className="w-full fixed top-0 left-0 z-50 px-6 py-4 shadow bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-8">
        {/* Título */}
        <h1 className="text-2xl sm:text-3xl font-bold">Rick and Morty Characters</h1>

        {/* Formulario de búsqueda */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSearch()
          }}
          className="relative flex items-center w-full sm:w-auto"
        >
          {/* Campo de búsqueda */}
          <Input
            type="text"
            placeholder="Search characters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 bg-zinc-800 text-white placeholder:text-zinc-400 pr-10"
          />

          {/* Botón para limpiar búsqueda */}
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("")
                onReset()
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="absolute right-2 text-zinc-400 hover:text-white"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </form>
      </div>
    </header>
  )
}
