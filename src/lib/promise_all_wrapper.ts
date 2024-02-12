import { StatusCodes } from 'http-status-codes';
import ApiError from '../abstractions/ApiError';
import { invalidInternalServer } from '../constants';

const promiseAllWrapper = async (promises: Promise<any>[]): Promise<any> => await Promise.all(promises)
    .then(async (values) => {
        console.log('All Promises successful');
        return values;
    })
    .catch((e) => {
        console.log('All Promises unsuccessful',e);
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, invalidInternalServer);
    });

export default promiseAllWrapper;