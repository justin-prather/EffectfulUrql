/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Federations: { input: any; output: any; }
  HoldIntervals: { input: any; output: any; }
  ImpulseToActionMappingSet: { input: any; output: any; }
  JumpSequence: { input: any; output: any; }
  ScoreCard: { input: any; output: any; }
  TotalFaults: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

/** Represents a Pokémon's attack types */
export type Attack = {
  __typename?: 'Attack';
  /** The damage of this Pokémon attack */
  damage?: Maybe<Scalars['Int']['output']>;
  /** The name of this Pokémon attack */
  name?: Maybe<Scalars['String']['output']>;
  /** The type of this Pokémon attack */
  type?: Maybe<Scalars['String']['output']>;
};

/** Class settings object used to configure rounds. */
export type ClassSettings = {
  __typename?: 'ClassSettings';
  activeRoundDataId: Scalars['String']['output'];
  classNumber: Scalars['Int']['output'];
  countdownTime: Scalars['Int']['output'];
  id: Scalars['UUID']['output'];
  impulseToActionMapping: Scalars['ImpulseToActionMappingSet']['output'];
  jumpSequence: Scalars['JumpSequence']['output'];
  name: Scalars['String']['output'];
  penaltiesPerFault: Scalars['Int']['output'];
  penaltiesPerSecondOverTime: Scalars['Int']['output'];
  penaltySecondsPerOccurrence: Scalars['Int']['output'];
  rebuildPenaltySeconds: Scalars['Int']['output'];
  startListType: StartListType;
  timeAllowed: Scalars['Int']['output'];
};

/** Filter parameters for querying class settings. */
export type ClassSettingsFilterParams = {
  filterString?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating class settings. */
export type CreateClassSettingsInput = {
  classNumber: Scalars['Int']['input'];
  countdownTime?: InputMaybe<Scalars['Int']['input']>;
  impulseToActionMapping?: InputMaybe<Scalars['ImpulseToActionMappingSet']['input']>;
  jumpSequence?: InputMaybe<Scalars['JumpSequence']['input']>;
  name: Scalars['String']['input'];
  penaltiesPerFault?: InputMaybe<Scalars['Int']['input']>;
  penaltiesPerSecondOverTime?: InputMaybe<Scalars['Int']['input']>;
  penaltySecondsPerOccurrence?: InputMaybe<Scalars['Int']['input']>;
  rebuildPenaltySeconds?: InputMaybe<Scalars['Int']['input']>;
  startListType?: InputMaybe<StartListType>;
  timeAllowed: Scalars['Int']['input'];
};

/** Input for creating a horse. */
export type CreateHorseInput = {
  entryNumber: Scalars['Int']['input'];
  federations: Scalars['Federations']['input'];
  name: Scalars['String']['input'];
};

/** Input for creating an impulse. */
export type CreateImpulseInput = {
  channelNumber: Scalars['Int']['input'];
  datetime: Scalars['DateTime']['input'];
  daysSince2001: Scalars['Int']['input'];
  entryNumber: Scalars['Int']['input'];
  /** Optional client-provided id. If provided, the server will use it. */
  id?: InputMaybe<Scalars['String']['input']>;
  inputNumber: Scalars['Int']['input'];
  radioFlags: Scalars['Int']['input'];
  roundId: Scalars['String']['input'];
  sequentialNumber: Scalars['Int']['input'];
  sourceType: SourceType;
  timeMsec: Scalars['Int']['input'];
  timeSeconds: Scalars['Int']['input'];
  timeUsec: Scalars['Int']['input'];
};

/** Input for creating a person. */
export type CreatePersonInput = {
  federations: Scalars['Federations']['input'];
  name: Scalars['String']['input'];
};

/** Resolved version of a hold interval (impulse IDs expanded to objects). */
export type HoldIntervalResolved = {
  __typename?: 'HoldIntervalResolved';
  holdEnd?: Maybe<Impulse>;
  holdStart: Impulse;
};

/** Horse domain model exposed via GraphQL. */
export type Horse = {
  __typename?: 'Horse';
  entryNumber: Scalars['Int']['output'];
  federations: Scalars['Federations']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

/** Filter parameters for querying horses. */
export type HorseFilterParams = {
  classSettingsId?: InputMaybe<Scalars['String']['input']>;
  filterString?: InputMaybe<Scalars['String']['input']>;
};

/** Filter parameters for querying horse-people relations. */
export type HorsePeopleRelationFilterParams = {
  classSettingsId?: InputMaybe<Scalars['String']['input']>;
  filterString?: InputMaybe<Scalars['String']['input']>;
  relationshipType?: InputMaybe<RelationshipType>;
};

/** Horse-person relationship reference. */
export type HorsePersonRelationRef = {
  __typename?: 'HorsePersonRelationRef';
  createdAt: Scalars['String']['output'];
  /** Resolve linked `Horse`. */
  horse: Horse;
  horseId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  /** Resolve linked `Person`. */
  person: Person;
  personId: Scalars['UUID']['output'];
  relationshipType: RelationshipType;
};

/** Impulse domain model exposed via GraphQL. */
export type Impulse = {
  __typename?: 'Impulse';
  channelNumber: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  datetime: Scalars['DateTime']['output'];
  daysSince2001: Scalars['Int']['output'];
  entryNumber: Scalars['Int']['output'];
  id: Scalars['UUID']['output'];
  inputNumber: Scalars['Int']['output'];
  radioFlags: Scalars['Int']['output'];
  /** Resolve the `Round` that owns this impulse. */
  round: Round;
  roundId: Scalars['UUID']['output'];
  sequentialNumber: Scalars['Int']['output'];
  sourceType: SourceType;
  timeMsec: Scalars['Int']['output'];
  timeSeconds: Scalars['Int']['output'];
  timeUsec: Scalars['Int']['output'];
};

/** Jump outcomes recorded on the score card. */
export enum JumpAction {
  Clear = 'CLEAR',
  Disqualified = 'DISQUALIFIED',
  Excused = 'EXCUSED',
  Fault = 'FAULT',
  HorseFell = 'HORSE_FELL',
  Refused = 'REFUSED',
  RefusedRebuild = 'REFUSED_REBUILD',
  RiderFell = 'RIDER_FELL',
  Withdrawn = 'WITHDRAWN'
}

/** Jump types that can appear in a `JumpSequence`. */
export enum JumpType {
  Oxer = 'OXER',
  TripleBar = 'TRIPLE_BAR',
  Vertical = 'VERTICAL',
  Water = 'WATER'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** Create new class settings. */
  createClassSettings: ClassSettings;
  /** Create a new impulse. */
  createImpulse: Impulse;
  /** Create a new round with defaults and link to entry relation. */
  createRound: Round;
  /** Insert a new horse. */
  insertHorse: Horse;
  /** Insert a horse-person relation (entry). */
  insertHorsePersonRelation: HorsePersonRelationRef;
  /** Insert a new person. */
  insertPerson: Person;
  /** Soft-delete a round (mark as deleted). */
  softDeleteRound: Scalars['Boolean']['output'];
  /** Update existing class settings (partial update supported). */
  updateClassSettings: ClassSettings;
  /** Upsert an existing horse by id. */
  updateHorse: Horse;
  /** Update an existing impulse with partial fields. */
  updateImpulse: Impulse;
  /** Upsert an existing person by id. */
  updatePerson: Person;
  /** Update an existing round with partial fields. */
  updateRound: Round;
};


export type MutationCreateClassSettingsArgs = {
  input: CreateClassSettingsInput;
};


export type MutationCreateImpulseArgs = {
  input: CreateImpulseInput;
};


export type MutationCreateRoundArgs = {
  classSettingsId: Scalars['String']['input'];
  entryId: Scalars['String']['input'];
};


export type MutationInsertHorseArgs = {
  input: CreateHorseInput;
};


export type MutationInsertHorsePersonRelationArgs = {
  horseId: Scalars['String']['input'];
  personId: Scalars['String']['input'];
  relationshipType: RelationshipType;
};


export type MutationInsertPersonArgs = {
  input: CreatePersonInput;
};


export type MutationSoftDeleteRoundArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateClassSettingsArgs = {
  id: Scalars['String']['input'];
  input: UpdateClassSettingsInput;
};


export type MutationUpdateHorseArgs = {
  id: Scalars['String']['input'];
  input: CreateHorseInput;
};


export type MutationUpdateImpulseArgs = {
  id: Scalars['String']['input'];
  input: UpdateImpulseInput;
};


export type MutationUpdatePersonArgs = {
  id: Scalars['String']['input'];
  input: CreatePersonInput;
};


export type MutationUpdateRoundArgs = {
  id: Scalars['String']['input'];
  input: UpdateRoundInput;
};

/** Person domain model exposed via GraphQL. */
export type Person = {
  __typename?: 'Person';
  federations: Scalars['Federations']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

/** Filter parameters for querying people. */
export type PersonFilterParams = {
  classSettingsId?: InputMaybe<Scalars['String']['input']>;
  filterString?: InputMaybe<Scalars['String']['input']>;
};

/** Represents a Pokémon */
export type Pokemon = {
  __typename?: 'Pokemon';
  /** The attacks of this Pokémon */
  attacks?: Maybe<PokemonAttack>;
  /** The classification of this Pokémon */
  classification?: Maybe<Scalars['String']['output']>;
  /** The evolution requirements of this Pokémon */
  evolutionRequirements?: Maybe<PokemonEvolutionRequirement>;
  /** The evolutions of this Pokémon */
  evolutions?: Maybe<Array<Maybe<Pokemon>>>;
  fleeRate?: Maybe<Scalars['Float']['output']>;
  /** The minimum and maximum weight of this Pokémon */
  height?: Maybe<PokemonDimension>;
  /** The ID of an object */
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  /** The maximum CP of this Pokémon */
  maxCP?: Maybe<Scalars['Int']['output']>;
  /** The maximum HP of this Pokémon */
  maxHP?: Maybe<Scalars['Int']['output']>;
  /** The name of this Pokémon */
  name?: Maybe<Scalars['String']['output']>;
  /** The identifier of this Pokémon */
  number?: Maybe<Scalars['String']['output']>;
  /** The type(s) of Pokémons that this Pokémon is resistant to */
  resistant?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The type(s) of this Pokémon */
  types?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The type(s) of Pokémons that this Pokémon weak to */
  weaknesses?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The minimum and maximum weight of this Pokémon */
  weight?: Maybe<PokemonDimension>;
};

/** Represents a Pokémon's attack types */
export type PokemonAttack = {
  __typename?: 'PokemonAttack';
  /** The fast attacks of this Pokémon */
  fast?: Maybe<Array<Maybe<Attack>>>;
  /** The special attacks of this Pokémon */
  special?: Maybe<Array<Maybe<Attack>>>;
};

/** Represents a Pokémon's dimensions */
export type PokemonDimension = {
  __typename?: 'PokemonDimension';
  /** The maximum value of this dimension */
  maximum?: Maybe<Scalars['String']['output']>;
  /** The minimum value of this dimension */
  minimum?: Maybe<Scalars['String']['output']>;
};

/** Represents a Pokémon's requirement to evolve */
export type PokemonEvolutionRequirement = {
  __typename?: 'PokemonEvolutionRequirement';
  /** The amount of candy to evolve */
  amount?: Maybe<Scalars['Int']['output']>;
  /** The name of the candy to evolve */
  name?: Maybe<Scalars['String']['output']>;
};

/** Query any Pokémon by number or name */
export type Query = {
  __typename?: 'Query';
  /** List all class settings. */
  classSettings: Array<ClassSettings>;
  /** List class settings by filter parameters. */
  classSettingsByFilterTerm: Array<ClassSettings>;
  /** Get class settings by id. */
  classSettingsById?: Maybe<ClassSettings>;
  /** Get horse by id. */
  horseById?: Maybe<Horse>;
  /** List all horse-person relationship references. */
  horsePeopleRelations: Array<HorsePersonRelationRef>;
  /** List horse-person relations by filter parameters. */
  horsePeopleRelationsByFilterTerm: Array<HorsePersonRelationRef>;
  /** List horse-person relations by horse id. */
  horsePeopleRelationsByHorse: Array<HorsePersonRelationRef>;
  /** List horse-person relations by person id. */
  horsePeopleRelationsByPerson: Array<HorsePersonRelationRef>;
  /** Get horse-person relationship reference by id. */
  horsePersonRelationById?: Maybe<HorsePersonRelationRef>;
  /** List all horses. */
  horses: Array<Horse>;
  /** List horses by filter parameters. */
  horsesByFilterTerm: Array<Horse>;
  /** Get impulse by id. */
  impulseById?: Maybe<Impulse>;
  /** List all impulses. */
  impulses: Array<Impulse>;
  /** List impulses by entry number. */
  impulsesByEntryNumber: Array<Impulse>;
  /** List impulses by round id. */
  impulsesByRoundId: Array<Impulse>;
  /** Get all available jump actions. */
  jumpActions: Array<JumpAction>;
  /** Get all available jump types. */
  jumpTypes: Array<JumpType>;
  /** List all people. */
  people: Array<Person>;
  /** List people by filter parameters. */
  peopleByFilterTerm: Array<Person>;
  /** Get person by id. */
  personById?: Maybe<Person>;
  pokemon?: Maybe<Pokemon>;
  pokemons?: Maybe<Array<Maybe<Pokemon>>>;
  query?: Maybe<Query>;
  /** Get round by id. */
  roundById?: Maybe<Round>;
  /** List all rounds. */
  rounds: Array<Round>;
  /** List rounds by class settings id. */
  roundsByClassSettings: Array<Round>;
  /** List rounds by filter parameters. */
  roundsByFilterTerm: Array<Round>;
};


/** Query any Pokémon by number or name */
export type QueryClassSettingsByFilterTermArgs = {
  filterTerm?: InputMaybe<ClassSettingsFilterParams>;
};


/** Query any Pokémon by number or name */
export type QueryClassSettingsByIdArgs = {
  id: Scalars['String']['input'];
};


/** Query any Pokémon by number or name */
export type QueryHorseByIdArgs = {
  id: Scalars['String']['input'];
};


/** Query any Pokémon by number or name */
export type QueryHorsePeopleRelationsByFilterTermArgs = {
  filterTerm?: InputMaybe<HorsePeopleRelationFilterParams>;
};


/** Query any Pokémon by number or name */
export type QueryHorsePeopleRelationsByHorseArgs = {
  horseId: Scalars['String']['input'];
};


/** Query any Pokémon by number or name */
export type QueryHorsePeopleRelationsByPersonArgs = {
  personId: Scalars['String']['input'];
};


/** Query any Pokémon by number or name */
export type QueryHorsePersonRelationByIdArgs = {
  id: Scalars['String']['input'];
};


/** Query any Pokémon by number or name */
export type QueryHorsesByFilterTermArgs = {
  filterTerm?: InputMaybe<HorseFilterParams>;
};


/** Query any Pokémon by number or name */
export type QueryImpulseByIdArgs = {
  id: Scalars['String']['input'];
};


/** Query any Pokémon by number or name */
export type QueryImpulsesByEntryNumberArgs = {
  entryNumber: Scalars['Int']['input'];
};


/** Query any Pokémon by number or name */
export type QueryImpulsesByRoundIdArgs = {
  roundId: Scalars['String']['input'];
};


/** Query any Pokémon by number or name */
export type QueryPeopleByFilterTermArgs = {
  filterTerm?: InputMaybe<PersonFilterParams>;
};


/** Query any Pokémon by number or name */
export type QueryPersonByIdArgs = {
  id: Scalars['String']['input'];
};


/** Query any Pokémon by number or name */
export type QueryPokemonArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


/** Query any Pokémon by number or name */
export type QueryPokemonsArgs = {
  first: Scalars['Int']['input'];
};


/** Query any Pokémon by number or name */
export type QueryRoundByIdArgs = {
  id: Scalars['String']['input'];
};


/** Query any Pokémon by number or name */
export type QueryRoundsByClassSettingsArgs = {
  classSettingsId: Scalars['String']['input'];
};


/** Query any Pokémon by number or name */
export type QueryRoundsByFilterTermArgs = {
  filterTerm?: InputMaybe<RoundFilterParams>;
};

/** Relationship between a `Person` and a `Horse`. */
export enum RelationshipType {
  Owner = 'OWNER',
  Rider = 'RIDER'
}

/** Round domain model, with complex resolvers for relations and derived data. */
export type Round = {
  __typename?: 'Round';
  cdHold: Scalars['HoldIntervals']['output'];
  /** Resolve `cd_hold` into impulses while preserving order. */
  cdHoldResolved: Array<HoldIntervalResolved>;
  /** Resolve `cd_start` impulse. */
  cdStart?: Maybe<Impulse>;
  cdStartId?: Maybe<Scalars['UUID']['output']>;
  /** Resolve `ClassSettings` for this round. */
  classSettings: ClassSettings;
  classSettingsId: Scalars['UUID']['output'];
  computedTime: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  currentTime: Scalars['Float']['output'];
  /** Resolve associated `HorsePersonRelationRef` entry. */
  entry?: Maybe<HorsePersonRelationRef>;
  entryId?: Maybe<Scalars['UUID']['output']>;
  finalStatus: RoundFinalStatus;
  finalTime: Scalars['Float']['output'];
  id: Scalars['UUID']['output'];
  /** Resolve `presumed_trip_start` impulse. */
  presumedTripStart?: Maybe<Impulse>;
  presumedTripStartId?: Maybe<Scalars['UUID']['output']>;
  scoreCard: Scalars['ScoreCard']['output'];
  sequenceNumber?: Maybe<Scalars['Int']['output']>;
  totalFaults: Scalars['TotalFaults']['output'];
  /** Resolve `trip_end` impulse. */
  tripEnd?: Maybe<Impulse>;
  tripEndId?: Maybe<Scalars['UUID']['output']>;
  tripHold: Scalars['HoldIntervals']['output'];
  /** Resolve `trip_hold` into impulses while preserving order. */
  tripHoldResolved: Array<HoldIntervalResolved>;
  /** Resolve `trip_start` impulse. */
  tripStart?: Maybe<Impulse>;
  tripStartId?: Maybe<Scalars['UUID']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

/** Filter parameters for querying rounds. */
export type RoundFilterParams = {
  classSettingsId?: InputMaybe<Scalars['String']['input']>;
  filterString?: InputMaybe<Scalars['String']['input']>;
};

/** Final status state of a `Round`. */
export enum RoundFinalStatus {
  Active = 'ACTIVE',
  Completed = 'COMPLETED',
  Disqualified = 'DISQUALIFIED',
  Dns = 'DNS',
  Eliminated = 'ELIMINATED',
  EliminatedOut = 'ELIMINATED_OUT',
  Excused = 'EXCUSED',
  HorseFall = 'HORSE_FALL',
  HorsConcours = 'HORS_CONCOURS',
  NotStarted = 'NOT_STARTED',
  OffCourse = 'OFF_COURSE',
  RiderFall = 'RIDER_FALL',
  Started = 'STARTED',
  Withdraw = 'WITHDRAW'
}

/** Source of an `Impulse` as recorded or computed by the system. */
export enum SourceType {
  Computed = 'COMPUTED',
  Copied = 'COPIED',
  FromInput = 'FROM_INPUT',
  Inserted = 'INSERTED',
  ManualTime = 'MANUAL_TIME',
  SoftGenerated = 'SOFT_GENERATED'
}

/** How the start list is constructed for a class. */
export enum StartListType {
  ListOnly = 'LIST_ONLY',
  SetOrder = 'SET_ORDER',
  SignupOrder = 'SIGNUP_ORDER'
}

/** Input for updating class settings (partial update). */
export type UpdateClassSettingsInput = {
  activeRoundDataId?: InputMaybe<Scalars['String']['input']>;
  classNumber?: InputMaybe<Scalars['Int']['input']>;
  countdownTime?: InputMaybe<Scalars['Int']['input']>;
  impulseToActionMapping?: InputMaybe<Scalars['ImpulseToActionMappingSet']['input']>;
  jumpSequence?: InputMaybe<Scalars['JumpSequence']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  penaltiesPerFault?: InputMaybe<Scalars['Int']['input']>;
  penaltiesPerSecondOverTime?: InputMaybe<Scalars['Int']['input']>;
  penaltySecondsPerOccurrence?: InputMaybe<Scalars['Int']['input']>;
  rebuildPenaltySeconds?: InputMaybe<Scalars['Int']['input']>;
  startListType?: InputMaybe<StartListType>;
  timeAllowed?: InputMaybe<Scalars['Int']['input']>;
};

/** Partial update input for an impulse. */
export type UpdateImpulseInput = {
  channelNumber?: InputMaybe<Scalars['Int']['input']>;
  datetime?: InputMaybe<Scalars['DateTime']['input']>;
  daysSince2001?: InputMaybe<Scalars['Int']['input']>;
  entryNumber?: InputMaybe<Scalars['Int']['input']>;
  inputNumber?: InputMaybe<Scalars['Int']['input']>;
  radioFlags?: InputMaybe<Scalars['Int']['input']>;
  roundId?: InputMaybe<Scalars['String']['input']>;
  sequentialNumber?: InputMaybe<Scalars['Int']['input']>;
  sourceType?: InputMaybe<SourceType>;
  timeMsec?: InputMaybe<Scalars['Int']['input']>;
  timeSeconds?: InputMaybe<Scalars['Int']['input']>;
  timeUsec?: InputMaybe<Scalars['Int']['input']>;
};

/** Partial update input for a round. */
export type UpdateRoundInput = {
  cdHold?: InputMaybe<Scalars['HoldIntervals']['input']>;
  cdStartId?: InputMaybe<Scalars['String']['input']>;
  classSettingsId?: InputMaybe<Scalars['String']['input']>;
  computedTime?: InputMaybe<Scalars['Float']['input']>;
  currentTime?: InputMaybe<Scalars['Float']['input']>;
  entryId?: InputMaybe<Scalars['String']['input']>;
  finalStatus?: InputMaybe<RoundFinalStatus>;
  finalTime?: InputMaybe<Scalars['Float']['input']>;
  presumedTripStartId?: InputMaybe<Scalars['String']['input']>;
  scoreCard?: InputMaybe<Scalars['ScoreCard']['input']>;
  sequenceNumber?: InputMaybe<Scalars['Int']['input']>;
  totalFaults?: InputMaybe<Scalars['TotalFaults']['input']>;
  tripEndId?: InputMaybe<Scalars['String']['input']>;
  tripHold?: InputMaybe<Scalars['HoldIntervals']['input']>;
  tripStartId?: InputMaybe<Scalars['String']['input']>;
};

export type ReadPeopleQueryVariables = Exact<{ [key: string]: never; }>;


export type ReadPeopleQuery = { __typename?: 'Query', people: Array<{ __typename?: 'Person', id: any, name: string }> };

export type InsertPersonMutationVariables = Exact<{
  input: CreatePersonInput;
}>;


export type InsertPersonMutation = { __typename?: 'Mutation', insertPerson: { __typename?: 'Person', id: any, name: string } };

export type GetPokemonQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type GetPokemonQuery = { __typename?: 'Query', pokemon?: { __typename?: 'Pokemon', name?: string | null, number?: string | null, image?: string | null, classification?: string | null, types?: Array<string | null> | null } | null };

export type BadNetworkQueryQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type BadNetworkQueryQuery = { __typename?: 'Query', pokemon?: { __typename?: 'Pokemon', name?: string | null } | null };


export const ReadPeopleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ReadPeople"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"people"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ReadPeopleQuery, ReadPeopleQueryVariables>;
export const InsertPersonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InsertPerson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePersonInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertPerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<InsertPersonMutation, InsertPersonMutationVariables>;
export const GetPokemonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPokemon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pokemon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"classification"}},{"kind":"Field","name":{"kind":"Name","value":"types"}}]}}]}}]} as unknown as DocumentNode<GetPokemonQuery, GetPokemonQueryVariables>;
export const BadNetworkQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BadNetworkQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pokemon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<BadNetworkQueryQuery, BadNetworkQueryQueryVariables>;