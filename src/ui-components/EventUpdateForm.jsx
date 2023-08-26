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
import { Event, Client as Client0, Dog as Dog0 } from "../models";
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
export default function EventUpdateForm(props) {
  const {
    id: idProp,
    event: eventModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    Time_Start: "",
    Client: undefined,
    Dog: undefined,
    Time_End: "",
  };
  const [Time_Start, setTime_Start] = React.useState(initialValues.Time_Start);
  const [Client, setClient] = React.useState(initialValues.Client);
  const [Dog, setDog] = React.useState(initialValues.Dog);
  const [Time_End, setTime_End] = React.useState(initialValues.Time_End);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = eventRecord
      ? { ...initialValues, ...eventRecord, Client, Dog }
      : initialValues;
    setTime_Start(cleanValues.Time_Start);
    setClient(cleanValues.Client);
    setCurrentClientValue(undefined);
    setCurrentClientDisplayValue("");
    setDog(cleanValues.Dog);
    setCurrentDogValue(undefined);
    setCurrentDogDisplayValue("");
    setTime_End(cleanValues.Time_End);
    setErrors({});
  };
  const [eventRecord, setEventRecord] = React.useState(eventModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(Event, idProp)
        : eventModelProp;
      setEventRecord(record);
      const ClientRecord = record ? await record.Client : undefined;
      setClient(ClientRecord);
      const DogRecord = record ? await record.Dog : undefined;
      setDog(DogRecord);
    };
    queryData();
  }, [idProp, eventModelProp]);
  React.useEffect(resetStateValues, [eventRecord, Client, Dog]);
  const [currentClientDisplayValue, setCurrentClientDisplayValue] =
    React.useState("");
  const [currentClientValue, setCurrentClientValue] = React.useState(undefined);
  const ClientRef = React.createRef();
  const [currentDogDisplayValue, setCurrentDogDisplayValue] =
    React.useState("");
  const [currentDogValue, setCurrentDogValue] = React.useState(undefined);
  const DogRef = React.createRef();
  const getIDValue = {
    Client: (r) => JSON.stringify({ id: r?.id }),
    Dog: (r) => JSON.stringify({ id: r?.id }),
  };
  const ClientIdSet = new Set(
    Array.isArray(Client)
      ? Client.map((r) => getIDValue.Client?.(r))
      : getIDValue.Client?.(Client)
  );
  const DogIdSet = new Set(
    Array.isArray(Dog)
      ? Dog.map((r) => getIDValue.Dog?.(r))
      : getIDValue.Dog?.(Dog)
  );
  const clientRecords = useDataStoreBinding({
    type: "collection",
    model: Client0,
  }).items;
  const dogRecords = useDataStoreBinding({
    type: "collection",
    model: Dog0,
  }).items;
  const getDisplayValue = {
    Client: (r) => `${r?.Name ? r?.Name + " - " : ""}${r?.id}`,
    Dog: (r) => `${r?.Name ? r?.Name + " - " : ""}${r?.id}`,
  };
  const validations = {
    Time_Start: [],
    Client: [],
    Dog: [],
    Time_End: [],
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
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          Time_Start,
          Client,
          Dog,
          Time_End,
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
            Event.copyOf(eventRecord, (updated) => {
              Object.assign(updated, modelFields);
              if (!modelFields.Client) {
                updated.eventClientId = undefined;
              }
              if (!modelFields.Dog) {
                updated.eventDogId = undefined;
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
      {...getOverrideProps(overrides, "EventUpdateForm")}
      {...rest}
    >
      <TextField
        label="Time start"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={Time_Start && convertToLocal(new Date(Time_Start))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              Time_Start: value,
              Client,
              Dog,
              Time_End,
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
      <ArrayField
        lengthLimit={1}
        onChange={async (items) => {
          let value = items[0];
          if (onChange) {
            const modelFields = {
              Time_Start,
              Client: value,
              Dog,
              Time_End,
            };
            const result = onChange(modelFields);
            value = result?.Client ?? value;
          }
          setClient(value);
          setCurrentClientValue(undefined);
          setCurrentClientDisplayValue("");
        }}
        currentFieldValue={currentClientValue}
        label={"Client"}
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
          label="Client"
          isRequired={false}
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
      <ArrayField
        lengthLimit={1}
        onChange={async (items) => {
          let value = items[0];
          if (onChange) {
            const modelFields = {
              Time_Start,
              Client,
              Dog: value,
              Time_End,
            };
            const result = onChange(modelFields);
            value = result?.Dog ?? value;
          }
          setDog(value);
          setCurrentDogValue(undefined);
          setCurrentDogDisplayValue("");
        }}
        currentFieldValue={currentDogValue}
        label={"Dog"}
        items={Dog ? [Dog] : []}
        hasError={errors?.Dog?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("Dog", currentDogValue)
        }
        errorMessage={errors?.Dog?.errorMessage}
        getBadgeText={getDisplayValue.Dog}
        setFieldValue={(model) => {
          setCurrentDogDisplayValue(model ? getDisplayValue.Dog(model) : "");
          setCurrentDogValue(model);
        }}
        inputFieldRef={DogRef}
        defaultFieldValue={""}
      >
        <Autocomplete
          label="Dog"
          isRequired={false}
          isReadOnly={false}
          placeholder="Search Dog"
          value={currentDogDisplayValue}
          options={dogRecords
            .filter((r) => !DogIdSet.has(getIDValue.Dog?.(r)))
            .map((r) => ({
              id: getIDValue.Dog?.(r),
              label: getDisplayValue.Dog?.(r),
            }))}
          onSelect={({ id, label }) => {
            setCurrentDogValue(
              dogRecords.find((r) =>
                Object.entries(JSON.parse(id)).every(
                  ([key, value]) => r[key] === value
                )
              )
            );
            setCurrentDogDisplayValue(label);
            runValidationTasks("Dog", label);
          }}
          onClear={() => {
            setCurrentDogDisplayValue("");
          }}
          defaultValue={Dog}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.Dog?.hasError) {
              runValidationTasks("Dog", value);
            }
            setCurrentDogDisplayValue(value);
            setCurrentDogValue(undefined);
          }}
          onBlur={() => runValidationTasks("Dog", currentDogDisplayValue)}
          errorMessage={errors.Dog?.errorMessage}
          hasError={errors.Dog?.hasError}
          ref={DogRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "Dog")}
        ></Autocomplete>
      </ArrayField>
      <TextField
        label="Time end"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={Time_End && convertToLocal(new Date(Time_End))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              Time_Start,
              Client,
              Dog,
              Time_End: value,
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
          isDisabled={!(idProp || eventModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || eventModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
