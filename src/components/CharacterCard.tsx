import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

interface EpisodeDetail {
  id: string;
  name: string;
}

interface Character {
  name: string;
  image: string;
  species: string;
  status: string;
  gender: string;
  origin: { name: string };
  location: { name: string };
  episodeDetails: EpisodeDetail[];
}

// Componente que recibe el personaje y muestra su infor en una tarjeta con acordeones
export function CharacterCard({ character }: { character: Character }) {
  // propiedades del personaje
  const { name, image, species, status, gender, origin, location } = character

  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-md">

      {/* Encabezado de la tarjeta */}
      <CardHeader>
        <img src={image} alt={name} className="w-full h-56 object-cover rounded-lg" />
        <CardTitle className="text-center mt-2">{name}</CardTitle>
      </CardHeader>

      {/* Contenido de la tarjeta */}
      <CardContent>
        {/* Acordeón múltiple para mostrar detalles adicionales */}
        <Accordion type="multiple" className="w-full">
          {/* Datos generales del personaje */}
          <AccordionItem value="character">
            <AccordionTrigger>Character</AccordionTrigger>
            <AccordionContent>
              <p><strong>Species:</strong> {species}</p>
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Gender:</strong> {gender}</p>
            </AccordionContent>
          </AccordionItem>

          {/* Origen del personaje */}
          <AccordionItem value="origin">
            <AccordionTrigger>Origin</AccordionTrigger>
            <AccordionContent>
              <p>{origin.name}</p>
            </AccordionContent>
          </AccordionItem>

          {/* Ubicación actual */}
          <AccordionItem value="location">
            <AccordionTrigger>Location</AccordionTrigger>
            <AccordionContent>
              <p>{location.name}</p>
            </AccordionContent>
          </AccordionItem>

          {/* Episodios en los que aparece el personaje */}
          <AccordionItem value="chapters">
            <AccordionTrigger>Chapters</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-1 max-h-40 overflow-y-auto text-left">
                {character.episodeDetails.map((ep) => (
                  <li key={ep.id}>{ep.name}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
