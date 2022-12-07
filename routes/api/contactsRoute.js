const express = require('express');
const contactsControlers = require('../../models/contacts');
const { userMiddlewares } = require('../../middleweras/userMiddlewares');
const { tryCatchWrapper } = require("../../helpers/index");
const { validation } = require("../../middleweras/validation");
const { contactSchemaJoi,  favoriteContactSchema } = require("../../Validations/contactShema");
const contactsRouter = express.Router();

const validateMiddlwareAdd = validation(
  contactSchemaJoi,
  "missing required name field"
);
const validateMiddlwarePatch = validation(
  favoriteContactSchema,
  "missing field favorite"
);

contactsRouter.use(userMiddlewares);
contactsRouter.get('/', tryCatchWrapper(contactsControlers.getAll));
contactsRouter.get('/:id', tryCatchWrapper(contactsControlers.findOneById));
contactsRouter.post('/',validateMiddlwareAdd, tryCatchWrapper(contactsControlers.create));
contactsRouter.delete('/:id', tryCatchWrapper(contactsControlers.deleteById));
contactsRouter.put('/:id',validateMiddlwareAdd, tryCatchWrapper(contactsControlers.updateById));
contactsRouter.patch("/:contactId/favorite",validateMiddlwarePatch, tryCatchWrapper(contactsControlers.updateStatusContact));

module.exports = {
  contactsRouter,
};
