/**
 * @param str:string
 * @returns string
 */
function formatCount(str: string) {
    if(typeof str!=='string'){
        return 
    }
    const len = str?.length;
    if (len <= 8) {
        return str;
    }

    return str.slice(0, 4) + "..." + str.slice(len - 4, len);
};

export {
    formatCount
}