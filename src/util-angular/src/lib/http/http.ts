//============== Http操作 =========================
//Copyright 2023 何镇汐
//Licensed under the MIT license
//=================================================
import { HttpMethod } from "./http-method";
import { HttpRequest } from "./http-request";
import { Ioc } from '../common/ioc';

/**
 * Http操作
 */
export class Http {
    /**
     * 初始化Http操作
     * @param ioc Ioc操作
     */
    constructor(private ioc: Ioc) {
    }

    /**
     * 发送请求
     * @param url 请求地址
     * @param httpMethod http方法
     * @param data 数据
     */
    send<T>( url: string, httpMethod: HttpMethod, data?): HttpRequest<T> {
        switch ( httpMethod ) {
            case HttpMethod.Get:
                return this.get<T>( url ).param( data );
            case HttpMethod.Post:
                return this.post<T>( url, data );
            case HttpMethod.Put:
                return this.put<T>( url, data );
            case HttpMethod.Delete:
                return this.delete<T>( url ).param( data );
            default:
                return this.get<T>( url ).param( data );
        }
    }

    /**
     * get请求
     * @param url 请求地址
     */
    get<T>( url: string ): HttpRequest<T> {
        return new HttpRequest<T>( this.ioc, HttpMethod.Get, url );
    }

    /**
     * post请求
     * @param url 请求地址
     * @param body Http主体
     */
    post<T>( url: string, body?): HttpRequest<T> {
        return new HttpRequest<T>(this.ioc, HttpMethod.Post, url, body );
    }

    /**
     * put请求
     * @param url 请求地址
     * @param body Http主体
     */
    put<T>( url: string, body?): HttpRequest<T> {
        return new HttpRequest<T>(this.ioc, HttpMethod.Put, url, body );
    }

    /**
     * delete请求
     * @param url 请求地址
     */
    delete<T>( url: string ): HttpRequest<T> {
        return new HttpRequest<T>(this.ioc, HttpMethod.Delete, url );
    }
}