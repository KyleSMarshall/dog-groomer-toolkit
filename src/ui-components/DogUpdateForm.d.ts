/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { AutocompleteProps, GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Dog, Client as Client0 } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type DogUpdateFormInputValues = {
    Name?: string;
    Breed?: string;
    Age?: string;
    Temperment?: string;
    Planned_Frequency?: string;
    Style?: string;
    Client?: Client0;
    Notes?: string;
};
export declare type DogUpdateFormValidationValues = {
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
export declare type DogUpdateFormOverridesProps = {
    DogUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    Name?: PrimitiveOverrideProps<TextFieldProps>;
    Breed?: PrimitiveOverrideProps<TextFieldProps>;
    Age?: PrimitiveOverrideProps<TextFieldProps>;
    Temperment?: PrimitiveOverrideProps<TextFieldProps>;
    Planned_Frequency?: PrimitiveOverrideProps<TextFieldProps>;
    Style?: PrimitiveOverrideProps<TextFieldProps>;
    Client?: PrimitiveOverrideProps<AutocompleteProps>;
    Notes?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type DogUpdateFormProps = React.PropsWithChildren<{
    overrides?: DogUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    dog?: Dog;
    onSubmit?: (fields: DogUpdateFormInputValues) => DogUpdateFormInputValues;
    onSuccess?: (fields: DogUpdateFormInputValues) => void;
    onError?: (fields: DogUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: DogUpdateFormInputValues) => DogUpdateFormInputValues;
    onValidate?: DogUpdateFormValidationValues;
} & React.CSSProperties>;
export default function DogUpdateForm(props: DogUpdateFormProps): React.ReactElement;
