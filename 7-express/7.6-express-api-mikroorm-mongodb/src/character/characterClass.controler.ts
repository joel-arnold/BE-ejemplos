import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { CharacterClass } from './characterClass.entity.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const characterClasses = await em.find(CharacterClass, {})
    res
      .status(200)
      .json({ message: 'Se encontraron todas las clases de personaje', data: characterClasses })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id
    const characterClass = await em.findOneOrFail(CharacterClass, { id })
    res
      .status(200)
      .json({ message: 'Clase de personaje encontrada', data: characterClass })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const characterClass = em.create(CharacterClass, req.body)
    await em.flush()
    res
      .status(201)
      .json({ message: 'Clase de personaje creada', data: characterClass })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id
    const characterClass = em.getReference(CharacterClass, id)
    em.assign(characterClass, req.body)
    await em.flush()
    res.status(200).json({ message: 'Clase de personaje actualizada' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    const characterClass = em.getReference(CharacterClass, id)
    await em.removeAndFlush(characterClass)
    res.status(200).send({ message: 'Clase de personaje eliminada' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, update, remove }
