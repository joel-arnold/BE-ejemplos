import express, { NextFunction, Request, Response } from 'express'
import { Character } from './character.js'

const app = express()
app.use(express.json())

//character -> /api/characters/

//post /api/characters -> crear nuevos character
//delete /api/characters/:id -> borrar character con id = :id
//put & patch /api/characters/:id -> modificar character con id = :id

const characters = [
  new Character(
    'Darth Vader',
    'Sith',
    10,
    100,
    20,
    10,
    ['Lightsaber', 'Death Star'],
    'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
  ),
]

function sanitizeCharacterInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    characterClass: req.body.characterClass,
    level: req.body.level,
    hp: req.body.hp,
    mana: req.body.mana,
    attack: req.body.attack,
    items: req.body.items,
  }
  // más validaciones acá

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

app.get('/api/characters', (req, res) => {
  res.json({ data: characters })
})

app.get('/api/characters/:id', (req, res) => {
  const character = characters.find((character) => character.id === req.params.id)
  if (!character) {
    return res.status(404).send({ message: 'Personaje no encontrado' })
  }
  res.json({ data: character })
})

app.post('/api/characters', sanitizeCharacterInput, (req, res) => {
  const input = req.body.sanitizedInput

  const character = new Character(
    input.name,
    input.characterClass,
    input.level,
    input.hp,
    input.mana,
    input.attack,
    input.items
  )

  characters.push(character)
  return res.status(201).send({ message: 'Personaje creado', data: character })
})

app.put('/api/characters/:id', sanitizeCharacterInput, (req, res) => {
  const characterIdx = characters.findIndex((character) => character.id === req.params.id)

  if (characterIdx === -1) {
    return res.status(404).send({ message: 'Personaje no encontrado' })
  }

  characters[characterIdx] = { ...characters[characterIdx], ...req.body.sanitizedInput }

  return res.status(200).send({ message: 'Personaje actualizado correctamente', data: characters[characterIdx] })
})

app.patch('/api/characters/:id', sanitizeCharacterInput, (req, res) => {
  const characterIdx = characters.findIndex((character) => character.id === req.params.id)

  if (characterIdx === -1) {
    return res.status(404).send({ message: 'Personaje no encontrado' })
  }

  Object.assign(characters[characterIdx], req.body.sanitizedInput)

  return res.status(200).send({ message: 'Personaje actualizado correctamente', data: characters[characterIdx] })
})

app.delete('/api/characters/:id', (req, res) => {
  const characterIdx = characters.findIndex((character) => character.id === req.params.id)

  if (characterIdx === -1) {
    res.status(404).send({ message: 'Personaje no encontrado' })
  } else {
    characters.splice(characterIdx, 1)
    res.status(200).send({ message: 'Personaje eliminado correctamente' })
  }
})

app.use((_, res) => {
  return res.status(404).send({ message: 'Recurso no encontrado' })
})

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000/')
})
