const fs = require('fs');

function parseArray(value){
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof(value) === "string") return value.split("\n").map(line=>line.trim()).filter(line=>line);
    throw "Unsupprted array format";
}

module.exports = {
    boolean : (value) =>{
        if (value === undefined || value === null || value === '') return undefined;
        return !!(value && value !=="false")
    },
    text : (value) =>{
        if (value)
            return value.split('\n');
        return undefined;
    },
    number: (value)=>{
        if (!value) return undefined;
        const parsed = parseInt(value);
        if (parsed === NaN) {
            throw `Value ${value} is not a valid number`
        }
        return parsed;
    },
    autocomplete: (value)=>{
        if (!value) return undefined;
        if (typeof(value) !== "object") return value;
        return value.id;
    },
    autocompleteOrArray: (value)=>{
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (typeof(value) == "object") return [value.id || value];
        return [value];
    },
    object: (value)=>{
        if (!value) return undefined;
        if (typeof(value) !== "object") throw `Value ${value} is not an object`;
        return value;
    },
    objectOrFromPath: (value)=>{
        if (!value) return undefined;
        if (typeof(value) === "string"){
            if (!fs.existsSync(value)) throw `Couldn't find file '${value}'.`;
            const fileContent = fs.readFileSync(value, 'utf8');
            try {
                const obj = JSON.parse(fileContent);
                return obj;
            }
            catch {
                throw `The file '${value}' doesn't contain a valid JSON.`
            }
        }
        if (typeof(value) === "object") return value;
        throw `value ${value} is not a valid object or a file path`;
    },
    string: (value)=>{
        if (!value) return undefined;
        if (typeof(value) === "string") return value.trim();
        throw `Value ${value} is not a valid string`;
    },
    array: parseArray
}