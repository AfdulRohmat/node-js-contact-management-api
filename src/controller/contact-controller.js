import contactService from "../services/contact-service.js";

const createContact = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const result = await contactService.createContact(user, request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getContact = async (req, res, next) => {
  try {
    const user = req.user;
    const contactId = req.params.contactId;
    const result = await contactService.getContact(user, contactId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  createContact,
  getContact,
};
