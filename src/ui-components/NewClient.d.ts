/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { AutocompleteProps, GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Dog } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type NewClientInputValues = {
    Name?: string;
    Phone_Number?: string;
    Client_Since?: string;
    Dogs?: Dog[];
};
export declare type NewClientValidationValues = {
    Name?: ValidationFunction<string>;
    Phone_Number?: ValidationFunction<string>;
    Client_Since?: ValidationFunction<string>;
    Dogs?: ValidationFunction<Dog>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type NewClientOverridesProps = {
    NewClientGrid?: PrimitiveOverrideProps<GridProps>;
    Name?: PrimitiveOverrideProps<TextFieldProps>;
    Phone_Number?: PrimitiveOverrideProps<TextAreaFieldProps>;
    Client_Since?: PrimitiveOverrideProps<TextFieldProps>;
    Dogs?: PrimitiveOverrideProps<AutocompleteProps>;
} & EscapeHatchProps;
export declare type NewClientProps = React.PropsWithChildren<{
    overrides?: NewClientOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: NewClientInputValues) => NewClientInputValues;
    onSuccess?: (fields: NewClientInputValues) => void;
    onError?: (fields: NewClientInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: NewClientInputValues) => NewClientInputValues;
    onValidate?: NewClientValidationValues;
} & React.CSSProperties>;
export default function NewClient(props: NewClientProps): React.ReactElement;
