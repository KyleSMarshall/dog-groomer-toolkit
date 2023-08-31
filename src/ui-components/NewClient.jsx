/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  TextAreaField,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Client } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
export default function NewClient(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onCancel,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const { tokens } = useTheme();
  const initialValues = {
    Name: "",
    Phone_Number: "",
    Client_Since: "",
    Dogs: "",
  };
  const [Name, setName] = React.useState(initialValues.Name);
  const [Phone_Number, setPhone_Number] = React.useState(
    initialValues.Phone_Number
  );
  const [Client_Since, setClient_Since] = React.useState(
    initialValues.Client_Since
  );
  const [Dogs, setDogs] = React.useState(initialValues.Dogs);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.Name);
    setPhone_Number(initialValues.Phone_Number);
    setClient_Since(initialValues.Client_Since);
    setDogs(initialValues.Dogs);
    setErrors({});
  };
  const validations = {
    Name: [
      { type: "Required" },
      {
        type: "NotContains",
        strValues: ["!@#$%^&*()-=+{}[]\\|;<>/?`~"],
        validationMessage:
          'The value must not contain "!@#$%^&*()-=+{}[]\\|;<>/?`~"',
      },
    ],
    Phone_Number: [
      { type: "Required" },
      {
        type: "NotContains",
        strValues: ["- "],
        validationMessage: 'The value must not contain "- or whitespace"',
      },
    ],
    Client_Since: [],
    Dogs: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap={tokens.space.small.value}
      columnGap={tokens.space.large.value}
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          Name,
          Phone_Number,
          Client_Since,
          Dogs,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          const modelFieldsToSave = {
            Name: modelFields.Name,
            Phone_Number: modelFields.Phone_Number,
            Client_Since: modelFields.Client_Since,
          };
          await DataStore.save(new Client(modelFieldsToSave));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "NewClient")}
      {...rest}
    >
      <TextField
        label={
          <span style={{ display: "inline-flex" }}>
            <span>Name</span>
            <span style={{ color: "red" }}>*</span>
          </span>
        }
        isRequired={true}
        isReadOnly={false}
        value={Name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Name: value,
              Phone_Number,
              Client_Since,
              Dogs,
            };
            const result = onChange(modelFields);
            value = result?.Name ?? value;
          }
          if (errors.Name?.hasError) {
            runValidationTasks("Name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("Name", Name)}
        errorMessage={errors.Name?.errorMessage}
        hasError={errors.Name?.hasError}
        {...getOverrideProps(overrides, "Name")}
      ></TextField>
      <TextAreaField
        label={
          <span style={{ display: "inline-flex" }}>
            <span>Phone number</span>
            <span style={{ color: "red" }}>*</span>
          </span>
        }
        descriptiveText=""
        isRequired={true}
        isReadOnly={false}
        placeholder="Enter 10 digit phone number without dashes or spaces (ex: 9021112222)"
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Name,
              Phone_Number: value,
              Client_Since,
              Dogs,
            };
            const result = onChange(modelFields);
            value = result?.Phone_Number ?? value;
          }
          if (errors.Phone_Number?.hasError) {
            runValidationTasks("Phone_Number", value);
          }
          setPhone_Number(value);
        }}
        onBlur={() => runValidationTasks("Phone_Number", Phone_Number)}
        errorMessage={errors.Phone_Number?.errorMessage}
        hasError={errors.Phone_Number?.hasError}
        {...getOverrideProps(overrides, "Phone_Number")}
      ></TextAreaField>
      <TextField
        label="Client since"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={Client_Since}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Name,
              Phone_Number,
              Client_Since: value,
              Dogs,
            };
            const result = onChange(modelFields);
            value = result?.Client_Since ?? value;
          }
          if (errors.Client_Since?.hasError) {
            runValidationTasks("Client_Since", value);
          }
          setClient_Since(value);
        }}
        onBlur={() => runValidationTasks("Client_Since", Client_Since)}
        errorMessage={errors.Client_Since?.errorMessage}
        hasError={errors.Client_Since?.hasError}
        {...getOverrideProps(overrides, "Client_Since")}
      ></TextField>
      <TextField
        label="Label"
        value={Dogs}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Name,
              Phone_Number,
              Client_Since,
              Dogs: value,
            };
            const result = onChange(modelFields);
            value = result?.Dogs ?? value;
          }
          if (errors.Dogs?.hasError) {
            runValidationTasks("Dogs", value);
          }
          setDogs(value);
        }}
        onBlur={() => runValidationTasks("Dogs", Dogs)}
        errorMessage={errors.Dogs?.errorMessage}
        hasError={errors.Dogs?.hasError}
        {...getOverrideProps(overrides, "Dogs")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap={tokens.space.large.value}
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Cancel"
            type="button"
            onClick={() => {
              onCancel && onCancel();
            }}
            {...getOverrideProps(overrides, "CancelButton")}
          ></Button>
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
