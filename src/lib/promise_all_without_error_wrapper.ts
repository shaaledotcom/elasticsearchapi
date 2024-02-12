const promiseAllWithoutErrorWrapper = async (promises: Promise<any>[]): Promise<any> => await Promise.all(promises)
    .then(async (values) => {
        console.log('All Promises successful');
        return values;
    })
    .catch((e) => {
        console.log('All Promises unsuccessful', e);
        return null
    });

export default promiseAllWithoutErrorWrapper;