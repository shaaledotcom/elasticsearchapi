/**
 * set properties such as name and class on anonymous function
 * @param incomingFunction
 * @param types
 * @param value
 */
function setFunctionProperties(incomingFunction, types: string[], value: string[]) {
    types.map((type, index) => {
        switch (type) {
            case 'name':
                Object.defineProperty(incomingFunction, type, {
                    value: value[index],
                    configurable: true,
                });
                break;
            case 'class':
                Object.defineProperty(incomingFunction, type, {
                    value: value[index],
                    configurable: true,
                });
                break;
        }
    });
}

export default setFunctionProperties;