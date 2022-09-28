export const getEllipsisTxt = (str: string, n = 6) => {
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
};  
