export interface IStandardResponse {
    status: boolean;
}

class SuccessResponse extends Error implements IStandardResponse {
    public status = true;
}

export default SuccessResponse;
  