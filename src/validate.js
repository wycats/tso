import { Task } from "no-show";
const DEFAULT_ENVIRONMENT = {
    get(object, key) {
        if (object !== null && object !== undefined) {
            return object[key];
        }
        else {
            return object;
        }
    }
};
/**
 * @api public
 *
 * A function that takes an environment, value, descriptor and context, and (asynchronously)
 * produces an array of validation errors. If this function produces an empty array, the
 * validation succeeded.
 *
 * The "context" is an app-specific concept. For example, an app might want to separate
 * between validations that must pass when drafting an article vs. validations that
 * must pass when publishing an article. If a validation descriptor does not specify
 * the context passed in to `validate`, the validation passes.
 *
 * @param env The host environment
 * @param value The value to validate; it need not be an object
 * @param descriptor A validation descriptor to use to validate the value; a single validation
 *  descriptor can represent multiple composed validations
 * @param context Optionally, a string that represents the saving context
 */
export function validate(value, descriptor, context = null, env = DEFAULT_ENVIRONMENT) {
    return new Task(async (run) => {
        let { validator, options, contexts } = descriptor;
        if (context !== null && contexts && contexts.length) {
            if (contexts.indexOf(context) === -1)
                return [];
        }
        let validateFunction = validator(options, env);
        return await run(validateFunction(value, context));
    });
}
//# sourceMappingURL=validate.js.map