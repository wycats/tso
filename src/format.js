import { entries } from "ts-std";
export function format(descriptor) {
    let out = `(${descriptor.name}`;
    let options = formatOption(descriptor.options, Position.Top);
    if (options !== null) {
        out = `${out} ${options})`;
    }
    else {
        out = `${out})`;
    }
    if (descriptor.contexts && descriptor.contexts.length) {
        out += `::on(${descriptor.contexts.join(" ")})`;
    }
    return out;
}
export var Position;
(function (Position) {
    Position[Position["Top"] = 0] = "Top";
    Position[Position["InArray"] = 1] = "InArray";
    Position[Position["InDictionary"] = 2] = "InDictionary";
})(Position || (Position = {}));
function formatOption(option, position) {
    switch (optionType(option)) {
        case "String":
        case "Boolean":
        case "Number":
        case "Null":
            return position === Position.Top ? null : JSON.stringify(option);
        case "Undefined":
            return position === Position.Top ? null : "undefined";
        case "Array": {
            let items = castOption(option).map(o => formatOption(o, Position.InArray));
            switch (position) {
                case Position.Top:
                    return items.join(" ");
                default:
                    return `[${items.join(", ")}]`;
            }
        }
        case "RegExp":
            return String(option);
        case "Dictionary":
        case "DescriptorDict": {
            let out = [];
            for (let [key, value] of entries(castOption(option))) {
                out.push(`${key}=${formatOption(value, Position.InDictionary)}`);
            }
            return out.length === 0 ? "{}" : out.join(" ");
        }
        case "Descriptor":
            return format(castOption(option));
        case "Function":
            return `function() { ... }`;
        case "Class": {
            let c = castOption(option);
            if (c.name) {
                return `class ${c.name} { ... }`;
            }
            else {
                return `class { ... }`;
            }
        }
        case "None":
            return "[unknown]";
    }
}
function castOption(option) {
    return option;
}
function optionType(option) {
    if (Array.isArray(option)) {
        return "Array";
    }
    else if (option === null) {
        return "Null";
    }
    else if (option instanceof RegExp) {
        return "RegExp";
    }
    switch (typeof option) {
        case "string":
            return "String";
        case "number":
            return "Number";
        case "boolean":
            return "Boolean";
        case "undefined":
            return "Undefined";
        case "function": {
            if (String(option).indexOf("class") === 0) {
                return "Class";
            }
            else {
                return "Function";
            }
        }
        case "object":
            return objectOptionType(option);
        default:
            return "None";
    }
}
function objectOptionType(option) {
    if (isValidationDescriptor(option)) {
        return "Descriptor";
    }
    else if (isPlainObject(option)) {
        return "Dictionary";
    }
    else {
        return "None";
    }
}
function isPlainObject(obj) {
    let proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || proto === null;
}
function isValidationDescriptor(option) {
    return (typeof option.validator === "function" &&
        typeof option.name === "string" &&
        "options" in option);
}
//# sourceMappingURL=format.js.map