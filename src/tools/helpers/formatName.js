export function setFileName(name) {
    const doteIndex = name.lastIndexOf('.')
    if (doteIndex < 10) return name;
    const extension = "." + name.split(".")[name.split(".").length - 1];
    return name.slice(0, 3) + '...' + name.slice(doteIndex - 3, doteIndex) + extension;
}