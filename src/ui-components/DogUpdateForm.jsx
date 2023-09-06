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
import { Dog, Client as Client0 } from "../models";
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
export default function DogUpdateForm(props) {
  const {
    id: idProp,
    dog: dogModelProp,
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
    Breed: "",
    Age: "",
    Temperment: "",
    Planned_Frequency: "",
    Style: "",
    Client: undefined,
    Notes: "",
  };
  const [Name, setName] = React.useState(initialValues.Name);
  const [Breed, setBreed] = React.useState(initialValues.Breed);
  const [Age, setAge] = React.useState(initialValues.Age);
  const [Temperment, setTemperment] = React.useState(initialValues.Temperment);
  const [Planned_Frequency, setPlanned_Frequency] = React.useState(
    initialValues.Planned_Frequency
  );
  const [Style, setStyle] = React.useState(initialValues.Style);
  const [Client, setClient] = React.useState(initialValues.Client);
  const [Notes, setNotes] = React.useState(initialValues.Notes);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = dogRecord
      ? { ...initialValues, ...dogRecord, Client }
      : initialValues;
    setName(cleanValues.Name);
    setBreed(cleanValues.Breed);
    setAge(cleanValues.Age);
    setTemperment(cleanValues.Temperment);
    setPlanned_Frequency(cleanValues.Planned_Frequency);
    setStyle(cleanValues.Style);
    setClient(cleanValues.Client);
    setCurrentClientValue(undefined);
    setCurrentClientDisplayValue("");
    setNotes(cleanValues.Notes);
    setErrors({});
  };
  const [dogRecord, setDogRecord] = React.useState(dogModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp ? await DataStore.query(Dog, idProp) : dogModelProp;
      setDogRecord(record);
      const ClientRecord = record ? await record.Client : undefined;
      setClient(ClientRecord);
    };
    queryData();
  }, [idProp, dogModelProp]);
  React.useEffect(resetStateValues, [dogRecord, Client]);
  const [currentClientDisplayValue, setCurrentClientDisplayValue] =
    React.useState("");
  const [currentClientValue, setCurrentClientValue] = React.useState(undefined);
  const ClientRef = React.createRef();
  const getIDValue = {
    Client: (r) => JSON.stringify({ id: r?.id }),
  };
  const ClientIdSet = new Set(
    Array.isArray(Client)
      ? Client.map((r) => getIDValue.Client?.(r))
      : getIDValue.Client?.(Client)
  );
  const clientRecords = useDataStoreBinding({
    type: "collection",
    model: Client0,
  }).items;
  const getDisplayValue = {
    Client: (r) => `${r?.Name ? r?.Name + " - " : ""}${r?.id}`,
  };
  const validations = {
    Name: [{ type: "Required" }],
    Breed: [{ type: "Required" }],
    Age: [{ type: "Required" }],
    Temperment: [],
    Planned_Frequency: [],
    Style: [],
    Client: [{ type: "Required", validationMessage: "Client is required." }],
    Notes: [],
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
          Breed,
          Age,
          Temperment,
          Planned_Frequency,
          Style,
          Client,
          Notes,
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
          await DataStore.save(
            Dog.copyOf(dogRecord, (updated) => {
              Object.assign(updated, modelFields);
              if (!modelFields.Client) {
                updated.dogClientId = undefined;
              }
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "DogUpdateForm")}
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
              Breed,
              Age,
              Temperment,
              Planned_Frequency,
              Style,
              Client,
              Notes,
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
            <span>Breed</span>
            <span style={{ color: "red" }}>*</span>
          </span>
        }
        isRequired={true}
        isReadOnly={false}
        value={Breed}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Name,
              Breed: value,
              Age,
              Temperment,
              Planned_Frequency,
              Style,
              Client,
              Notes,
            };
            const result = onChange(modelFields);
            value = result?.Breed ?? value;
          }
          if (errors.Breed?.hasError) {
            runValidationTasks("Breed", value);
          }
          setBreed(value);
        }}
        onBlur={() => runValidationTasks("Breed", Breed)}
        errorMessage={errors.Breed?.errorMessage}
        hasError={errors.Breed?.hasError}
        {...getOverrideProps(overrides, "Breed")}
      ></TextField>
      <TextField
        label={
          <span style={{ display: "inline-flex" }}>
            <span>Age</span>
            <span style={{ color: "red" }}>*</span>
          </span>
        }
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={Age}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Name,
              Breed,
              Age: value,
              Temperment,
              Planned_Frequency,
              Style,
              Client,
              Notes,
            };
            const result = onChange(modelFields);
            value = result?.Age ?? value;
          }
          if (errors.Age?.hasError) {
            runValidationTasks("Age", value);
          }
          setAge(value);
        }}
        onBlur={() => runValidationTasks("Age", Age)}
        errorMessage={errors.Age?.errorMessage}
        hasError={errors.Age?.hasError}
        {...getOverrideProps(overrides, "Age")}
      ></TextField>
      <TextField
        label="Temperment"
        isRequired={false}
        isReadOnly={false}
        value={Temperment}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Name,
              Breed,
              Age,
              Temperment: value,
              Planned_Frequency,
              Style,
              Client,
              Notes,
            };
            const result = onChange(modelFields);
            value = result?.Temperment ?? value;
          }
          if (errors.Temperment?.hasError) {
            runValidationTasks("Temperment", value);
          }
          setTemperment(value);
        }}
        onBlur={() => runValidationTasks("Temperment", Temperment)}
        errorMessage={errors.Temperment?.errorMessage}
        hasError={errors.Temperment?.hasError}
        {...getOverrideProps(overrides, "Temperment")}
      ></TextField>
      <TextField
        label="Planned frequency"
        isRequired={false}
        isReadOnly={false}
        value={Planned_Frequency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Name,
              Breed,
              Age,
              Temperment,
              Planned_Frequency: value,
              Style,
              Client,
              Notes,
            };
            const result = onChange(modelFields);
            value = result?.Planned_Frequency ?? value;
          }
          if (errors.Planned_Frequency?.hasError) {
            runValidationTasks("Planned_Frequency", value);
          }
          setPlanned_Frequency(value);
        }}
        onBlur={() =>
          runValidationTasks("Planned_Frequency", Planned_Frequency)
        }
        errorMessage={errors.Planned_Frequency?.errorMessage}
        hasError={errors.Planned_Frequency?.hasError}
        {...getOverrideProps(overrides, "Planned_Frequency")}
      ></TextField>
      <TextField
        label="Style"
        isRequired={false}
        isReadOnly={false}
        value={Style}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Name,
              Breed,
              Age,
              Temperment,
              Planned_Frequency,
              Style: value,
              Client,
              Notes,
            };
            const result = onChange(modelFields);
            value = result?.Style ?? value;
          }
          if (errors.Style?.hasError) {
            runValidationTasks("Style", value);
          }
          setStyle(value);
        }}
        onBlur={() => runValidationTasks("Style", Style)}
        errorMessage={errors.Style?.errorMessage}
        hasError={errors.Style?.hasError}
        {...getOverrideProps(overrides, "Style")}
      ></TextField>
      <ArrayField
        lengthLimit={1}
        onChange={async (items) => {
          let value = items[0];
          if (onChange) {
            const modelFields = {
              Name,
              Breed,
              Age,
              Temperment,
              Planned_Frequency,
              Style,
              Client: value,
              Notes,
            };
            const result = onChange(modelFields);
            value = result?.Client ?? value;
          }
          setClient(value);
          setCurrentClientValue(undefined);
          setCurrentClientDisplayValue("");
        }}
        currentFieldValue={currentClientValue}
        label={
          <span style={{ display: "inline-flex" }}>
            <span>Client</span>
            <span style={{ color: "red" }}>*</span>
          </span>
        }
        items={Client ? [Client] : []}
        hasError={errors?.Client?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("Client", currentClientValue)
        }
        errorMessage={errors?.Client?.errorMessage}
        getBadgeText={getDisplayValue.Client}
        setFieldValue={(model) => {
          setCurrentClientDisplayValue(
            model ? getDisplayValue.Client(model) : ""
          );
          setCurrentClientValue(model);
        }}
        inputFieldRef={ClientRef}
        defaultFieldValue={""}
      >
        <Autocomplete
          label={
            <span style={{ display: "inline-flex" }}>
              <span>Client</span>
              <span style={{ color: "red" }}>*</span>
            </span>
          }
          isRequired={true}
          isReadOnly={false}
          placeholder="Search Client"
          value={currentClientDisplayValue}
          options={clientRecords
            .filter((r) => !ClientIdSet.has(getIDValue.Client?.(r)))
            .map((r) => ({
              id: getIDValue.Client?.(r),
              label: getDisplayValue.Client?.(r),
            }))}
          onSelect={({ id, label }) => {
            setCurrentClientValue(
              clientRecords.find((r) =>
                Object.entries(JSON.parse(id)).every(
                  ([key, value]) => r[key] === value
                )
              )
            );
            setCurrentClientDisplayValue(label);
            runValidationTasks("Client", label);
          }}
          onClear={() => {
            setCurrentClientDisplayValue("");
          }}
          defaultValue={Client}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.Client?.hasError) {
              runValidationTasks("Client", value);
            }
            setCurrentClientDisplayValue(value);
            setCurrentClientValue(undefined);
          }}
          onBlur={() => runValidationTasks("Client", currentClientDisplayValue)}
          errorMessage={errors.Client?.errorMessage}
          hasError={errors.Client?.hasError}
          ref={ClientRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "Client")}
        ></Autocomplete>
      </ArrayField>
      <TextField
        label="Notes"
        isRequired={false}
        isReadOnly={false}
        value={Notes}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Name,
              Breed,
              Age,
              Temperment,
              Planned_Frequency,
              Style,
              Client,
              Notes: value,
            };
            const result = onChange(modelFields);
            value = result?.Notes ?? value;
          }
          if (errors.Notes?.hasError) {
            runValidationTasks("Notes", value);
          }
          setNotes(value);
        }}
        onBlur={() => runValidationTasks("Notes", Notes)}
        errorMessage={errors.Notes?.errorMessage}
        hasError={errors.Notes?.hasError}
        {...getOverrideProps(overrides, "Notes")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || dogModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
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
            isDisabled={
              !(idProp || dogModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
