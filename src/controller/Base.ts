import {Application, Request, Router} from 'express';
import {ProfileHomeInterface} from "../cache/profile_home_interface";
import {ScheduleCollaboratorInterface} from "../cache/schedule_interface";
import {ValidationInterface} from "./validation/validation_interface";
import promiseAllWrapper from "../lib/promise_all_wrapper";
import ApiError from "../abstractions/ApiError";
import {StatusCodes} from "http-status-codes";
import setFunctionProperties from "../lib/set_function_properties";
import {MyOrderInterface} from "./my_order_interface";
import {Utils} from "../utils";

/**
 * Provides services common to all API methods
 */
export default abstract class Base {
    /**
     * express router
     * @type {Router}
     */
    protected router: Router;

    /**
     * initializes a new router
     */
    protected constructor() {
        this.router = Router();
    }

    /**
     * abstract method implemented by inherited class usually controllers that implements API router to register the application
     * @param express
     */
    public abstract register(express: Application): void;

    /**
     * Registers the anonymous function properties such as name, class
     * @param registerArray
     */
    protected registerFunctionProperties(registerArray: { func: any, value: string }[]): void {
        registerArray.map(item => setFunctionProperties(item.func, ['name', 'class'], [item.value, this.constructor.name]));
    }

    /**
     * function called by inherited class usually controllers to validate before request processing
     * @param validationFunctions
     */
    public async validate(validationFunctions: any): Promise<void> {
        console.log('base validate');
        const validatesList: ValidationInterface[] = await promiseAllWrapper(validationFunctions);

        if (validatesList.some(item => item.hasError)) {
            throw new ApiError(StatusCodes.NOT_FOUND, validatesList.find(item => item.hasError).error);
        }
    }

    /**
     * initializes
     * @param req
     */
    protected initialize(req: Request) {
        console.log('in base initialize');
    }

    protected createCollaboratorData(profile: ProfileHomeInterface): ScheduleCollaboratorInterface {
        return {
            id: profile.id, thumbnail: profile.thumbnail, url: profile.url, value: profile.title,
        }
    }

    protected getAllMyOrders(userData: any) {
        const myOrders: any[] = userData.myOrders || null;
        let result: MyOrderInterface[] = [];
        if (myOrders !== null) {
            myOrders.forEach((order: any) => {
                [].push.apply(result, this.getMyActiveOrders(order));
            });

            const cancelledOrders: MyOrderInterface[] = result.filter((resultData) =>
                (resultData.productName === 'shaale' && resultData.status === 'cancelled'));
            // console.log('cancelled orders', cancelledOrders);
            result.forEach((resultData, index) => {
                if (cancelledOrders.find((cancelledOrder) =>
                    cancelledOrder.orderId === resultData.orderId)) {
                    // console.log('deleted order', resultData);
                    result.splice(index, 1);
                }
            });
        }
        if (result.length > 0) {
            result = result.reverse();
        }
        return result;
    }

    /**
     * getMyOrders returns all the orders that are not cancelled
     * @param order
     * @return {MyOrderInterface[]}
     */
    protected getMyActiveOrders(order: any) {
        const returnResult: MyOrderInterface[] = [];
        if (order.data === undefined) {
            return returnResult;
        }
        order.data.forEach((orderData: any) => {
            let result: MyOrderInterface;
            orderData.expiryDate = orderData.expiryDate === null ? null : Utils.getDate(orderData.expiryDate);
            orderData.paymentDate = Utils.getDate(orderData.paymentDate);
            // if (order.loginType === 'live') {
            if (orderData.status !== 'cancelled') {
                if (orderData.expiryDate > new Date()) {
                    orderData.status = 'active';
                } else {
                    if (order.type === 'learn') {
                        orderData.status = 'active';
                    } else {
                        orderData.status = 'inactive';
                    }
                }
            }
            // }
            result = this.createMyOrderData(orderData);
            result.productName = order.type;
            returnResult.push(result);

        });

        return returnResult;
    }

    /**
     * createMyOrderData
     * @param data
     * @return {MyOrderInterface}
     */
    private createMyOrderData = (data: any): MyOrderInterface => ({
        couponCode: data.couponCode,
        expiryDate: data.expiryDate || null,
        id: data.id || null,
        name: data.name || null,
        orderId: data.orderId || null,
        paymentDate: data.paymentDate || null,
        planId: data.planId || null,
        planName: data.planName || null,
        status: data.status || null,
        subscriptionId: data.subscriptionId || null,
        subscriptionType: data.subscriptionType || null,
        thumbnail: data.thumbnail || null,
        type: data.type || null,
        url: data.url || null,
        price: data.price || null,
    });

    protected checkSubscriptionGiveAccess(data: any) {

        if (data === undefined || data === null) {
            return {isGiven: false, code: "subscription"};
        }

        let isMyOrders = false;

        const myOrders: any = data.myOrders || null;

        if (myOrders !== null) {

            const subscriptionData: MyOrderInterface[] = myOrders.find((order) => order.type === 'shaale') === undefined ?
                null : myOrders.find((order) => order.type === 'shaale').data || null;
            if (subscriptionData || subscriptionData !== null) {
                subscriptionData.forEach((item) => {
                    // console.log('expiry date', EventBase.getDate(item.expiryDate), 'now', new Date(), 'condition', EventBase.getDate(item.expiryDate) > new Date())
                    if (Utils.getDate(item.expiryDate) > new Date()) {
                        // console.log('expirydate',EventBase.getDate(item.expiryDate));
                        isMyOrders = true;
                    }
                });
            }

            if (isMyOrders) {
                return {isGiven: true, code: "subscription"};
                // return true;
            }
        }
        return {isGiven: false, code: "subscription"};
        // return false;
    }
}
