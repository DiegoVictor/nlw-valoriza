import { celebrate, Joi, Segments } from 'celebrate';

export default celebrate({
  [Segments.BODY]: Joi.object().keys({
    tag_id: Joi.string().uuid().required(),
    receiver_id: Joi.string().uuid().required(),
    message: Joi.string().min(10).required(),
  }),
});
