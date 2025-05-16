import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  // Escucha scroll y actualiza visibilidad del botón
  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 200)
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  // Acción al hacer clic
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 bg-gray-800 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg transition-colors"
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  )
}
