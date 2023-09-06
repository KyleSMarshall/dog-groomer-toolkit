/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { AutocompleteProps, GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Client as Client0 } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type DogCreateFormInputValues = {
    Name?: string;
    Breed?: string;
    Age?: string;
    Temperment?: string;
    Planned_Frequency?: string;
    Style?: string;
    Client?: Client0;
    Notes?: string;
};
export declare type DogCreateFormValidationValues = {
    Name?: ValidationFunction<string>;
    Breed?: ValidationFunction<string>;
    Age?: ValidationFunction<string>;
    Temperment?: ValidationFunction<string>;
    Planned_Frequency?: ValidationFunction<string>;
    Style?: ValidationFunction<string>;
    Client?: ValidationFunction<Client0>;
    Notes?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type DogCreateFormOverridesProps = {
    DogCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    Name?: PrimitiveOverrideProps<TextFieldProps>;
    Breed?: PrimitiveOverrideProps<TextFieldProps>;
    Age?: PrimitiveOverrideProps<TextFieldProps>;
    Temperment?: PrimitiveOverrideProps<TextFieldProps>;
    Planned_Frequency?: PrimitiveOverrideProps<TextFieldProps>;
    Style?: PrimitiveOverrideProps<TextFieldProps>;
    Client?: PrimitiveOverrideProps<AutocompleteProps>;
    Notes?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type DogCreateFormProps = React.PropsWithChildren<{
    overrides?: DogCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: DogCreateFormInputValues) => DogCreateFormInputValues;
    onSuccess?: (fields: DogCreateFormInputValues) => void;
    onError?: (fields: DogCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: DogCreateFormInputValues) => DogCreateFormInputValues;
    onValidate?: DogCreateFormValidationValues;
} & React.CSSProperties>;
export default function DogCreateForm(props: DogCreateFormProps): React.ReactElement;
