const express = require('express')
const contacts = require("../../models/contacts");

const schemaPut = require('./validatePut')
const validatePost = require('./validatePost')
const router = express.Router()

router.get('/', async (req, res, next) => {
  res.json(await contacts.listContacts())
})

router.get(`/:contactId`, async (req, res, next) => {
  const id = req.params.contactId;
  const result = await contacts.getContactById(id)
  if (result === null) {
    res.status(404).json({ message: "Not found" })
  }
  if (result !== null) {
    res.status(200).json(result)
  }
})

router.post('/', async (req, res, next) => {
  const { name, email, phone } = req.query;
  try {
    const value = await validatePost.validateAsync({ name, email, phone });
    res.status(201).json(await contacts.addContact(value))
  }
  catch (err) { 
    res.status(404).json({ "message": err.details.map(e =>  e.message)})
  }
})

router.delete('/:contactId', async (req, res, next) => {
  const id = req.params.contactId;
  if (id !== undefined) {
    res.status(200).json({"message": "contact deleted"})
    await contacts.removeContact(id)
  } else {
    res.status(404).json({ "message": "Not found" })
  }
})

router.put('/:contactId', async (req, res, next) => {
  const id = req.params.contactId;
  const { name, email, phone } = req.query;
  try {
    const value = await schemaPut.validateAsync({ name, email, phone });
    const reply = await contacts.updateContact(id, value)
    if (reply !== null) {
      res.status(200).json(reply)
    } else {
      res.status(404).json({"message": "Not found"})
    }
  }
  catch (err) { 
    res.status(404).json({ "message": err.details.map(e =>  e.message)})
  }
})


module.exports = router
