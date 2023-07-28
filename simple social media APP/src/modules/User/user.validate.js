import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';
/// =========== validateupdateprofile =============== ///
export const validateupdateprofile = {
    body:joi.object().required().keys({
        firstName: generalFields.firstName,
        lastName:generalFields.lastName,
        age: generalFields.age,
        phone: generalFields.phone,
      })
}
/// ============================================ ///


