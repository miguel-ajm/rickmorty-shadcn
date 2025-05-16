import './App.css'
import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Characters from "@/pages/Characters"

function App() {
  useEffect(() => {
    document.body.classList.add("dark")
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Characters />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App