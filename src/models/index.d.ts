import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem, AsyncCollection } from "@aws-amplify/datastore";





type EagerEvent = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Event, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Time_Start?: string | null;
  readonly Client?: Client | null;
  readonly Dog?: Dog | null;
  readonly Time_End?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly eventClientId?: string | null;
  readonly eventDogId?: string | null;
}

type LazyEvent = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Event, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Time_Start?: string | null;
  readonly Client: AsyncItem<Client | undefined>;
  readonly Dog: AsyncItem<Dog | undefined>;
  readonly Time_End?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly eventClientId?: string | null;
  readonly eventDogId?: string | null;
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
  readonly Name?: string | null;
  readonly Phone_Number?: string | null;
  readonly Client_Since?: string | null;
  readonly Dogs?: (Dog | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyClient = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Client, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Name?: string | null;
  readonly Phone_Number?: string | null;
  readonly Client_Since?: string | null;
  readonly Dogs: AsyncCollection<Dog>;
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
  readonly Name?: string | null;
  readonly Breed?: string | null;
  readonly Age?: number | null;
  readonly Temperment?: string | null;
  readonly Last_Cut?: string | null;
  readonly clientID: string;
  readonly Client?: Client | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyDog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Dog, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Name?: string | null;
  readonly Breed?: string | null;
  readonly Age?: number | null;
  readonly Temperment?: string | null;
  readonly Last_Cut?: string | null;
  readonly clientID: string;
  readonly Client: AsyncItem<Client | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Dog = LazyLoading extends LazyLoadingDisabled ? EagerDog : LazyDog

export declare const Dog: (new (init: ModelInit<Dog>) => Dog) & {
  copyOf(source: Dog, mutator: (draft: MutableModel<Dog>) => MutableModel<Dog> | void): Dog;
}