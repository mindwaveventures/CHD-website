export default (str: string): string => {
    if (!str) {
        return '';
    }

    const arr = str.split(' ');

    //loop through each element of the array and capitalize the first letter.
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();
    }

    //Join all the elements of the array back into a string
    //using a blankspace as a separator
    return arr.join(' ');
};