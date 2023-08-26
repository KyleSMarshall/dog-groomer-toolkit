/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Autocomplete,
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import {
  getOverrideProps,
  useDataStoreBinding,
} from "@aws-amplify/ui-react/internal";
import { Client, Dog } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function ClientCreateForm(props) {
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
    Name: "",
    Phone_Number: "",
    Client_Since: "",
    Dogs: [],
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
    setCurrentDogsValue(undefined);
    setCurrentDogsDisplayValue("");
    setErrors({});
  };
  const [currentDogsDisplayValue, setCurrentDogsDisplayValue] =
    React.useState("");
  const [currentDogsValue, setCurrentDogsValue] = React.useState(undefined);
  const DogsRef = React.createRef();
  const getIDValue = {
    Dogs: (r) => JSON.stringify({ id: r?.id }),
  };
  const DogsIdSet = new Set(
    Array.isArray(Dogs)
      ? Dogs.map((r) => getIDValue.Dogs?.(r))
      : getIDValue.Dogs?.(Dogs)
  );
  const dogRecords = useDataStoreBinding({
    type: "collection",
    model: Dog,
  }).items;
  const getDisplayValue = {
    Dogs: (r) => `${r?.Name ? r?.Name + " - " : ""}${r?.id}`,
  };
  const validations = {
    Name: [{ type: "Required" }],
    Phone_Number: [{ type: "Required" }],
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
      rowGap="15px"
      columnGap="15px"
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
                  runValidationTasks(
                    fieldName,
                    item,
                    getDisplayValue[fieldName]
                  )
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(
                fieldName,
                modelFields[fieldName],
                getDisplayValue[fieldName]
              )
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
          const client = await DataStore.save(new Client(modelFieldsToSave));
          const promises = [];
          promises.push(
            ...Dogs.reduce((promises, original) => {
              promises.push(
                DataStore.save(
                  Dog.copyOf(original, (updated) => {
                    updated.Client = client;
                  })
                )
              );
              return promises;
            }, [])
          );
          await Promise.all(promises);
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
      {...getOverrideProps(overrides, "ClientCreateForm")}
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
      <TextField
        label={
          <span style={{ display: "inline-flex" }}>
            <span>Phone number</span>
            <span style={{ color: "red" }}>*</span>
          </span>
        }
        isRequired={true}
        isReadOnly={false}
        placeholder="Enter 10 digit phone number without dashes or spaces (ex: 9021112222)"
        value={Phone_Number}
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
      ></TextField>
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
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              Name,
              Phone_Number,
              Client_Since,
              Dogs: values,
            };
            const result = onChange(modelFields);
            values = result?.Dogs ?? values;
          }
          setDogs(values);
          setCurrentDogsValue(undefined);
          setCurrentDogsDisplayValue("");
        }}
        currentFieldValue={currentDogsValue}
        label={"Dogs"}
        items={Dogs}
        hasError={errors?.Dogs?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("Dogs", currentDogsValue)
        }
        errorMessage={errors?.Dogs?.errorMessage}
        getBadgeText={getDisplayValue.Dogs}
        setFieldValue={(model) => {
          setCurrentDogsDisplayValue(model ? getDisplayValue.Dogs(model) : "");
          setCurrentDogsValue(model);
        }}
        inputFieldRef={DogsRef}
        defaultFieldValue={""}
      >
        <Autocomplete
          label="Dogs"
          isRequired={false}
          isReadOnly={false}
          placeholder="Search Dog"
          value={currentDogsDisplayValue}
          options={dogRecords
            .filter((r) => !DogsIdSet.has(getIDValue.Dogs?.(r)))
            .map((r) => ({
              id: getIDValue.Dogs?.(r),
              label: getDisplayValue.Dogs?.(r),
            }))}
          onSelect={({ id, label }) => {
            setCurrentDogsValue(
              dogRecords.find((r) =>
                Object.entries(JSON.parse(id)).every(
                  ([key, value]) => r[key] === value
                )
              )
            );
            setCurrentDogsDisplayValue(label);
            runValidationTasks("Dogs", label);
          }}
          onClear={() => {
            setCurrentDogsDisplayValue("");
          }}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.Dogs?.hasError) {
              runValidationTasks("Dogs", value);
            }
            setCurrentDogsDisplayValue(value);
            setCurrentDogsValue(undefined);
          }}
          onBlur={() => runValidationTasks("Dogs", currentDogsDisplayValue)}
          errorMessage={errors.Dogs?.errorMessage}
          hasError={errors.Dogs?.hasError}
          ref={DogsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "Dogs")}
        ></Autocomplete>
      </ArrayField>
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
