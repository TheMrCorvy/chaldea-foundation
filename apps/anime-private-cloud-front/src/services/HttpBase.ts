import logData from "@/utils/logData";
import { FeatureNames, isFeatureFlagEnabled } from "./featureFlagService";

export enum HttpMethod {
    GET = "GET",
    PUT = "PUT",
    POST = "POST",
    DELETE = "DELETE",
    OPTIONS = "OPTIONS",
}

export interface RequestInformation {
    url: URL;
    method: string;
    startRequestTimeStamp: number;
    reuqestHeaders: HeadersInit;
}

export interface HttpRequestParameters {
    url: string;
    method: HttpMethod;
    body?: object | FormData | string;
    header?: HeadersInit;
    requestOperation?: string;
    authToken?: string;
}

export abstract class HttpBase {
    private operation = "";
    protected controller = new AbortController();

    protected executeRequest<T>(reqParams: HttpRequestParameters): Promise<T> {
        const { url, method, body, header, requestOperation, authToken } =
            reqParams;
        const startRequest = Date.now();
        const headers = this.initRequestHeader(startRequest, header, authToken);
        const requestInfo: RequestInformation = {
            url: new URL(url),
            method: HttpMethod[method],
            startRequestTimeStamp: startRequest,
            reuqestHeaders: headers,
        };

        if (requestOperation) {
            this.operation = requestOperation;
        } else {
            this.operation = "Generic HTTP Request";
        }

        logData({
            ff: FeatureNames.LOG_EXTERNAL_HTTP_REQUESTS,
            title: `>>> Request: ${this.operation}`,
            data: requestInfo,
        });

        const responsePromise = fetch(requestInfo.url, {
            method: HttpMethod[method],
            headers,
            body:
                typeof body !== "string"
                    ? body instanceof FormData
                        ? (body as FormData)
                        : JSON.stringify(body)
                    : (body as BodyInit),
            signal: this.controller.signal,
        });

        return this.responseHandler<T>(responsePromise, requestInfo);
    }

    protected initRequestHeader(
        startRequest: number,
        header?: HeadersInit,
        jwtToken?: string
    ): HeadersInit {
        const headers: any = {
            "Content-Type": "application/json",
            "X-Start-Timestamp": startRequest.toString(),
            ...header,
        };

        if (jwtToken) {
            headers["Authorization"] = `Bearer ${jwtToken}`;
        }

        return headers;
    }

    protected async responseHandler<T>(
        response: Promise<Response>,
        requestInfo: RequestInformation
    ): Promise<T> {
        const res = await response;
        const responseTimestamp = Date.now();

        if (!res.ok) {
            const responseMessage = await res.json();
            logData({
                title: "Error:",
                data: {
                    message: `An error has ocurred: ${res.status}, message: ${JSON.stringify(responseMessage)}`,
                },
            });

            throw new Error("Error on HTTP request.");
        }

        const fullResponse = await res.json();

        if (
            isFeatureFlagEnabled(
                FeatureNames.LOG_RESPONSE_EXTERNAL_HTTP_REQUEST
            )
        ) {
            const data: any = {
                ...requestInfo,
                responseTimestamp,
            };

            if (
                isFeatureFlagEnabled(
                    FeatureNames.LOG_RESPONSE_BODY_EXTERNAL_HTTP_REQUEST
                )
            ) {
                data.res = JSON.stringify(fullResponse);
            }

            logData({
                ff: FeatureNames.LOG_EXTERNAL_HTTP_REQUESTS,
                title: `>>> Response: ${this.operation}`,
                data,
            });
        }

        if (res.status === 204) {
            return { status: res.status } as T;
        }

        return { ...fullResponse, ok: true } as T;
    }
}
