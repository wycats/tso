import { Task } from "no-show";
export function validator(name, validatorFunction) {
    return (options) => {
        return {
            name,
            validator: simpleToFull(name, validatorFunction),
            options: options
        };
    };
}
function simpleToFull(name, simple) {
    return (options) => {
        let validate = simple(options);
        let details = options === undefined ? null : options;
        return (value, _context) => {
            return new Task(async () => {
                if (!validate(value)) {
                    return [{ path: [], message: { name, details } }];
                }
                else {
                    return [];
                }
            });
        };
    };
}
//# sourceMappingURL=validator.js.map