import { Request, Response, NextFunction } from 'express'
import { CharacterRepository } from './character.repository.js'
import { Character } from './character.entity.js'

const repository = new CharacterRepository()

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

function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() })
}

function findOne(req: Request, res: Response) {
  const id = req.params.id
  const character = repository.findOne({ id })
  if (!character) {
    return res.status(404).send({ message: 'Personaje no encontrado' })
  }
  res.json({ data: character })
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const characterInput = new Character(
    input.name,
    input.characterClass,
    input.level,
    input.hp,
    input.mana,
    input.attack,
    input.items
  )

  const character = repository.add(characterInput)
  return res.status(201).send({ message: 'Personaje creado', data: character })
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
  const character = repository.update(req.body.sanitizedInput)

  if (!character) {
    return res.status(404).send({ message: 'Personaje no encontrado' })
  }

  return res.status(200).send({ message: 'Personaje actualizado correctamente', data: character })
}

function remove(req: Request, res: Response) {
  const id = req.params.id
  const character = repository.delete({ id })

  if (!character) {
    res.status(404).send({ message: 'Personaje no encontrado' })
  } else {
    res.status(200).send({ message: 'Personaje eliminado correctamente' })
  }
}

export { sanitizeCharacterInput, findAll, findOne, add, update, remove }
