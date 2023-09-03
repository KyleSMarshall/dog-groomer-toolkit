/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { DataContext } from "../App";
import {
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  TextField,
} from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Event } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
import { useNavigate } from 'react-router-dom';
export default function EventCreateForm(props) {
  const dogContext = React.useContext(DataContext);
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
  const initialValues = {
    Dog: dogContext.selectedData.Name,
    Time_Start: "",
    Time_End: "",
    Type: "",
    Comments: "",
  };
  const [Dog, setDog] = React.useState(initialValues.Dog);
  const [Time_Start, setTime_Start] = React.useState(initialValues.Time_Start);
  const [Time_End, setTime_End] = React.useState(initialValues.Time_End);
  const [Type, setType] = React.useState(initialValues.Type);
  const [Comments, setComments] = React.useState(initialValues.Comments);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setDog(initialValues.Dog);
    setTime_Start(initialValues.Time_Start);
    setTime_End(initialValues.Time_End);
    setType(initialValues.Type);
    setComments(initialValues.Comments);
    setErrors({});
  };
  const validations = {
    Dog: [{ type: "Required" }],
    Time_Start: [{ type: "Required" }],
    Time_End: [{ type: "Required" }],
    Type: [{ type: "Required" }],
    Comments: [],
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
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  };

  const navigate = useNavigate();

  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          Dog,
          Time_Start,
          Time_End,
          Type,
          Comments,
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
            eventDogId: dogContext.selectedData.id,
            Time_Start: modelFields.Time_Start,
            Time_End: modelFields.Time_End,
            Type: modelFields.Type,
            Comments: modelFields.Comments,
          };
          await DataStore.save(new Event(modelFieldsToSave));
          if (onSuccess) {
            onSuccess(modelFields);
            navigate("/Dataviewer");
          }
          if (clearOnSuccess) {
            resetStateValues();
            navigate("/Dataviewer");
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "EventCreateForm")}
      {...rest}
    >
      <Heading
        level={4}
        children="New Appointment"
        {...getOverrideProps(overrides, "SectionalElement0")}
      ></Heading>
      <Divider
        orientation="horizontal"
        {...getOverrideProps(overrides, "SectionalElement1")}
      ></Divider>
      <TextField
        label="Dog"
        isRequired={true}
        value={Dog}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Dog: value,
              Time_Start,
              Time_End,
              Type,
              Comments,
            };
            const result = onChange(modelFields);
            value = result?.Dog ?? value;
          }
          if (errors.Dog?.hasError) {
            runValidationTasks("Dog", value);
          }
          setDog(value);
        }}
        onBlur={() => runValidationTasks("Dog", Dog)}
        errorMessage={errors.Dog?.errorMessage}
        hasError={errors.Dog?.hasError}
        {...getOverrideProps(overrides, "Dog")}
        isReadOnly={true}
        id="dog-input-field"
      ></TextField>
      <TextField
        label="Time start"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        value={Time_Start && convertToLocal(new Date(Time_Start))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              Dog,
              Time_Start: value,
              Time_End,
              Type,
              Comments,
            };
            const result = onChange(modelFields);
            value = result?.Time_Start ?? value;
          }
          if (errors.Time_Start?.hasError) {
            runValidationTasks("Time_Start", value);
          }
          setTime_Start(value);
        }}
        onBlur={() => runValidationTasks("Time_Start", Time_Start)}
        errorMessage={errors.Time_Start?.errorMessage}
        hasError={errors.Time_Start?.hasError}
        {...getOverrideProps(overrides, "Time_Start")}
      ></TextField>
      <TextField
        label="Time end"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        value={Time_End && convertToLocal(new Date(Time_End))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              Dog,
              Time_Start,
              Time_End: value,
              Type,
              Comments,
            };
            const result = onChange(modelFields);
            value = result?.Time_End ?? value;
          }
          if (errors.Time_End?.hasError) {
            runValidationTasks("Time_End", value);
          }
          setTime_End(value);
        }}
        onBlur={() => runValidationTasks("Time_End", Time_End)}
        errorMessage={errors.Time_End?.errorMessage}
        hasError={errors.Time_End?.hasError}
        {...getOverrideProps(overrides, "Time_End")}
      ></TextField>
      <TextField
        label="Type of appointment"
        isRequired={true}
        isReadOnly={false}
        value={Type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Dog,
              Time_Start,
              Time_End,
              Type: value,
              Comments,
            };
            const result = onChange(modelFields);
            value = result?.Type ?? value;
          }
          if (errors.Type?.hasError) {
            runValidationTasks("Type", value);
          }
          setType(value);
        }}
        onBlur={() => runValidationTasks("Type", Type)}
        errorMessage={errors.Type?.errorMessage}
        hasError={errors.Type?.hasError}
        {...getOverrideProps(overrides, "Type")}
      ></TextField>
      <TextField
        label="Additional comments"
        isRequired={false}
        isReadOnly={false}
        value={Comments}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Dog,
              Time_Start,
              Time_End,
              Type,
              Comments: value,
            };
            const result = onChange(modelFields);
            value = result?.Comments ?? value;
          }
          if (errors.Comments?.hasError) {
            runValidationTasks("Comments", value);
          }
          setComments(value);
        }}
        onBlur={() => runValidationTasks("Comments", Comments)}
        errorMessage={errors.Comments?.errorMessage}
        hasError={errors.Comments?.hasError}
        {...getOverrideProps(overrides, "Comments")}
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
          gap="15px"
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
