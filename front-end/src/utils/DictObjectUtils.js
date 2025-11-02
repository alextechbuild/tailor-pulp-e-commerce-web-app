export function isDict(object) {

    return Object.prototype.toString.call(object) === '[object Object]';
}
