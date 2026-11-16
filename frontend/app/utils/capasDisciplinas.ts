import imagemHistoria from '../img/disciplinas/historia.png'
import imagemQuimica from '../img/disciplinas/quimica.png'
import imagemMatematica from '../img/disciplinas/matematica.png'
import imagemGeografia from '../img/disciplinas/geografia.png'
import imagemBiologia from '../img/disciplinas/biologia.png'
import imagemCiencias from '../img/disciplinas/ciencias.png'
import imagemPortugues from '../img/disciplinas/portugues.png'

import Image, { StaticImageData } from 'next/image'

export const capasDisciplinas = new Map<string, StaticImageData>()

capasDisciplinas.set('Matemática', imagemMatematica)
capasDisciplinas.set('Química', imagemQuimica)
capasDisciplinas.set('Física', imagemQuimica)
capasDisciplinas.set('Biologia', imagemBiologia)
capasDisciplinas.set('Ciências', imagemCiencias)
capasDisciplinas.set('História', imagemHistoria)
capasDisciplinas.set('Geografia', imagemGeografia)
capasDisciplinas.set('Língua Portuguesa', imagemPortugues)
