import {ValidationType} from "./validation_type";
import {ErrorInterface} from "../../ErrorInterface";

export interface ValidationInterface {
    hasError: boolean,
    error: ErrorInterface,
    value?: any,
    type: ValidationType,
}
