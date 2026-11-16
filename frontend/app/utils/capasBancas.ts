import logoEnem from '../img/bancas/enem.png'
import logoCambridge from '../img/bancas/cambridge 1.png'
import logoFuvest from '../img/bancas/fuvest 1.png'
import logoUel from '../img/bancas/uel 1.png'
import logoIelts from '../img/bancas/ielts 1.png'
import logoUfpr from '../img/bancas/ufpr 1.png'
import logoUnicamp from '../img/bancas/unicamp 1.png'

import Image, { StaticImageData } from 'next/image'

export const capasBancas = new Map<string, StaticImageData>()

capasBancas.set("ENEM", logoEnem)
capasBancas.set("Cambridge", logoCambridge)
capasBancas.set("FUVEST", logoFuvest)
capasBancas.set("UEL", logoUel)
capasBancas.set("IELTS", logoIelts)
capasBancas.set("UFPR", logoUfpr)
capasBancas.set("UNICAMP", logoUnicamp)

export const capaPadrao = logoEnem