import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem } from "@aws-amplify/datastore";





type EagerEvent = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Event, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Time_Start: string;
  readonly Dog: Dog;
  readonly Time_End: string;
  readonly Type: string;
  readonly Comments?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly eventDogId: string;
}

type LazyEvent = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Event, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Time_Start: string;
  readonly Dog: AsyncItem<Dog>;
  readonly Time_End: string;
  readonly Type: string;
  readonly Comments?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly eventDogId: string;
}

export declare type Event = LazyLoading extends LazyLoadingDisabled ? EagerEvent : LazyEvent

export declare const Event: (new (init: ModelInit<Event>) => Event) & {
  copyOf(source: Event, mutator: (draft: MutableModel<Event>) => MutableModel<Event> | void): Event;
}

type EagerClient = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Client, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Name: string;
  readonly Phone_Number: string;
  readonly Client_Since?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyClient = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Client, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Name: string;
  readonly Phone_Number: string;
  readonly Client_Since?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Client = LazyLoading extends LazyLoadingDisabled ? EagerClient : LazyClient

export declare const Client: (new (init: ModelInit<Client>) => Client) & {
  copyOf(source: Client, mutator: (draft: MutableModel<Client>) => MutableModel<Client> | void): Client;
}

type EagerDog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Dog, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Name: string;
  readonly Breed: string;
  readonly Age?: number | null;
  readonly Temperment?: string | null;
  readonly Planned_Frequency?: string | null;
  readonly Style?: string | null;
  readonly Client: Client;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly dogClientId: string;
}

type LazyDog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Dog, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Name: string;
  readonly Breed: string;
  readonly Age?: number | null;
  readonly Temperment?: string | null;
  readonly Planned_Frequency?: string | null;
  readonly Style?: string | null;
  readonly Client: AsyncItem<Client>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly dogClientId: string;
}

export declare type Dog = LazyLoading extends LazyLoadingDisabled ? EagerDog : LazyDog

export declare const Dog: (new (init: ModelInit<Dog>) => Dog) & {
  copyOf(source: Dog, mutator: (draft: MutableModel<Dog>) => MutableModel<Dog> | void): Dog;
}