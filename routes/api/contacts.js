const express = require('express')
const contacts = require("../../models/contacts");
const validateReqBody = require("./validation");

const {
  schemaPutContact,
  schemaPostContact,
} = require("./shema");

const router = express.Router()

router.get('/', async (req, res, next) => {
  const result = await contacts.listContacts();
  res.json(result)
})

router.get('/:contactId', async (req, res, next) => {
  const id = req.params.contactId;
  const result = await contacts.getContactById(id)
  if (result === null) {
    res.status(404).json({ message: "Not found" })
  }
  if (result !== null) {
    res.status(200).json(result)
  }
})

router.post('/',validateReqBody(schemaPostContact), async (req, res, next) => {
  const body = req.query;
  try {
    const result = await contacts.addContact(body)
    res.status(201).json(result)
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

router.put('/:contactId',validateReqBody(schemaPutContact), async (req, res, next) => {
  const id = req.params.contactId;
  try {
    const result = await contacts.updateContact(id, req.query)
    if (result !== null) {
      res.status(200).json(result)
    } else {
      res.status(404).json({"message": "Not found"})
    }
  }
  catch (err) { 
    res.status(404).json({ "message": err.details.map(e =>  e.message)})
  }
})


module.exports = router;