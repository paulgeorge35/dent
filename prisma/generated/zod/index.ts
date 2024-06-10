import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','type','provider','refresh_token','access_token','expires_at','refresh_token_expires_in','token_type','scope','id_token','session_state']);

export const UserScalarFieldEnumSchema = z.enum(['id','index','name','email','emailVerified','phone','passwordHash','role','banned','createdAt','updatedAt']);

export const ProfileScalarFieldEnumSchema = z.enum(['id','firstName','lastName','avatar','userId','createdAt','updatedAt']);

export const TokenScalarFieldEnumSchema = z.enum(['id','type','token','expires','userId']);

export const PatientScalarFieldEnumSchema = z.enum(['id','firstName','lastName','gender','dob','email','phone','city','county','status','smsNotifications','emailNotifications','userId','createdAt','updatedAt']);

export const EventScalarFieldEnumSchema = z.enum(['id','title','description','date','start','end','allDay','type','status','patientId','createdAt','updatedAt']);

export const ProposedTimeScalarFieldEnumSchema = z.enum(['id','date','start','end','status','notified','eventId','createdAt','updatedAt']);

export const ProductScalarFieldEnumSchema = z.enum(['id','name','description','price','priceMax','image','tags','isDeleted','eventId','createdAt','updatedAt']);

export const CountyScalarFieldEnumSchema = z.enum(['id','name','code','createdAt','updatedAt']);

export const CityScalarFieldEnumSchema = z.enum(['id','name','countyId','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const RoleSchema = z.enum(['USER','ADMIN']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const StatusSchema = z.enum(['ACTIVE','INACTIVE']);

export type StatusType = `${z.infer<typeof StatusSchema>}`

export const TokenTypeSchema = z.enum(['ACTIVATION','PASSWORD_RESET','MAGIC_LINK']);

export type TokenTypeType = `${z.infer<typeof TokenTypeSchema>}`

export const EventStatusSchema = z.enum(['CREATED','CONFIRMED','COMPLETED','CANCELLED','RESCHEDULED']);

export type EventStatusType = `${z.infer<typeof EventStatusSchema>}`

export const EventTypeSchema = z.enum(['APPOINTMENT']);

export type EventTypeType = `${z.infer<typeof EventTypeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.coerce.date().nullable(),
  refresh_token_expires_in: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleSchema,
  id: z.string().cuid(),
  index: z.number().int(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.coerce.date().nullable(),
  phone: z.string().nullable(),
  passwordHash: z.string().nullable(),
  banned: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// PROFILE SCHEMA
/////////////////////////////////////////

export const ProfileSchema = z.object({
  id: z.string().cuid(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Profile = z.infer<typeof ProfileSchema>

/////////////////////////////////////////
// TOKEN SCHEMA
/////////////////////////////////////////

export const TokenSchema = z.object({
  type: TokenTypeSchema,
  id: z.string().cuid(),
  token: z.string(),
  expires: z.coerce.date(),
  userId: z.string(),
})

export type Token = z.infer<typeof TokenSchema>

/////////////////////////////////////////
// PATIENT SCHEMA
/////////////////////////////////////////

export const PatientSchema = z.object({
  status: StatusSchema,
  id: z.string().cuid(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string().nullable(),
  dob: z.coerce.date().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  city: z.string().nullable(),
  county: z.string().nullable(),
  smsNotifications: z.boolean(),
  emailNotifications: z.boolean(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Patient = z.infer<typeof PatientSchema>

/////////////////////////////////////////
// EVENT SCHEMA
/////////////////////////////////////////

export const EventSchema = z.object({
  type: EventTypeSchema,
  status: EventStatusSchema,
  id: z.string().cuid(),
  title: z.string(),
  description: z.string().nullable(),
  date: z.coerce.date(),
  start: z.coerce.date().nullable(),
  end: z.coerce.date().nullable(),
  allDay: z.boolean(),
  patientId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Event = z.infer<typeof EventSchema>

/////////////////////////////////////////
// PROPOSED TIME SCHEMA
/////////////////////////////////////////

export const ProposedTimeSchema = z.object({
  status: EventStatusSchema,
  id: z.string().cuid(),
  date: z.coerce.date(),
  start: z.coerce.date().nullable(),
  end: z.coerce.date().nullable(),
  notified: z.boolean(),
  eventId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ProposedTime = z.infer<typeof ProposedTimeSchema>

/////////////////////////////////////////
// PRODUCT SCHEMA
/////////////////////////////////////////

export const ProductSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  priceMax: z.number().nullable(),
  image: z.string().nullable(),
  tags: z.string().array(),
  isDeleted: z.boolean(),
  eventId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Product = z.infer<typeof ProductSchema>

/////////////////////////////////////////
// COUNTY SCHEMA
/////////////////////////////////////////

export const CountySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type County = z.infer<typeof CountySchema>

/////////////////////////////////////////
// CITY SCHEMA
/////////////////////////////////////////

export const CitySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  countyId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type City = z.infer<typeof CitySchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const AccountArgsSchema: z.ZodType<Prisma.AccountDefaultArgs> = z.object({
  select: z.lazy(() => AccountSelectSchema).optional(),
  include: z.lazy(() => AccountIncludeSchema).optional(),
}).strict();

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  type: z.boolean().optional(),
  provider: z.boolean().optional(),
  refresh_token: z.boolean().optional(),
  access_token: z.boolean().optional(),
  expires_at: z.boolean().optional(),
  refresh_token_expires_in: z.boolean().optional(),
  token_type: z.boolean().optional(),
  scope: z.boolean().optional(),
  id_token: z.boolean().optional(),
  session_state: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  profile: z.union([z.boolean(),z.lazy(() => ProfileArgsSchema)]).optional(),
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  tokens: z.union([z.boolean(),z.lazy(() => TokenFindManyArgsSchema)]).optional(),
  patients: z.union([z.boolean(),z.lazy(() => PatientFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  accounts: z.boolean().optional(),
  tokens: z.boolean().optional(),
  patients: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  index: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  phone: z.boolean().optional(),
  passwordHash: z.boolean().optional(),
  role: z.boolean().optional(),
  banned: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  profile: z.union([z.boolean(),z.lazy(() => ProfileArgsSchema)]).optional(),
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  tokens: z.union([z.boolean(),z.lazy(() => TokenFindManyArgsSchema)]).optional(),
  patients: z.union([z.boolean(),z.lazy(() => PatientFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PROFILE
//------------------------------------------------------

export const ProfileIncludeSchema: z.ZodType<Prisma.ProfileInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const ProfileArgsSchema: z.ZodType<Prisma.ProfileDefaultArgs> = z.object({
  select: z.lazy(() => ProfileSelectSchema).optional(),
  include: z.lazy(() => ProfileIncludeSchema).optional(),
}).strict();

export const ProfileSelectSchema: z.ZodType<Prisma.ProfileSelect> = z.object({
  id: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  avatar: z.boolean().optional(),
  userId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// TOKEN
//------------------------------------------------------

export const TokenIncludeSchema: z.ZodType<Prisma.TokenInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const TokenArgsSchema: z.ZodType<Prisma.TokenDefaultArgs> = z.object({
  select: z.lazy(() => TokenSelectSchema).optional(),
  include: z.lazy(() => TokenIncludeSchema).optional(),
}).strict();

export const TokenSelectSchema: z.ZodType<Prisma.TokenSelect> = z.object({
  id: z.boolean().optional(),
  type: z.boolean().optional(),
  token: z.boolean().optional(),
  expires: z.boolean().optional(),
  userId: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// PATIENT
//------------------------------------------------------

export const PatientIncludeSchema: z.ZodType<Prisma.PatientInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  appointments: z.union([z.boolean(),z.lazy(() => EventFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PatientCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PatientArgsSchema: z.ZodType<Prisma.PatientDefaultArgs> = z.object({
  select: z.lazy(() => PatientSelectSchema).optional(),
  include: z.lazy(() => PatientIncludeSchema).optional(),
}).strict();

export const PatientCountOutputTypeArgsSchema: z.ZodType<Prisma.PatientCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PatientCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PatientCountOutputTypeSelectSchema: z.ZodType<Prisma.PatientCountOutputTypeSelect> = z.object({
  appointments: z.boolean().optional(),
}).strict();

export const PatientSelectSchema: z.ZodType<Prisma.PatientSelect> = z.object({
  id: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  gender: z.boolean().optional(),
  dob: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  city: z.boolean().optional(),
  county: z.boolean().optional(),
  status: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  userId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  appointments: z.union([z.boolean(),z.lazy(() => EventFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PatientCountOutputTypeArgsSchema)]).optional(),
}).strict()

// EVENT
//------------------------------------------------------

export const EventIncludeSchema: z.ZodType<Prisma.EventInclude> = z.object({
  proposedTimes: z.union([z.boolean(),z.lazy(() => ProposedTimeFindManyArgsSchema)]).optional(),
  products: z.union([z.boolean(),z.lazy(() => ProductFindManyArgsSchema)]).optional(),
  patient: z.union([z.boolean(),z.lazy(() => PatientArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EventCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const EventArgsSchema: z.ZodType<Prisma.EventDefaultArgs> = z.object({
  select: z.lazy(() => EventSelectSchema).optional(),
  include: z.lazy(() => EventIncludeSchema).optional(),
}).strict();

export const EventCountOutputTypeArgsSchema: z.ZodType<Prisma.EventCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => EventCountOutputTypeSelectSchema).nullish(),
}).strict();

export const EventCountOutputTypeSelectSchema: z.ZodType<Prisma.EventCountOutputTypeSelect> = z.object({
  proposedTimes: z.boolean().optional(),
  products: z.boolean().optional(),
}).strict();

export const EventSelectSchema: z.ZodType<Prisma.EventSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  date: z.boolean().optional(),
  start: z.boolean().optional(),
  end: z.boolean().optional(),
  allDay: z.boolean().optional(),
  type: z.boolean().optional(),
  status: z.boolean().optional(),
  patientId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  proposedTimes: z.union([z.boolean(),z.lazy(() => ProposedTimeFindManyArgsSchema)]).optional(),
  products: z.union([z.boolean(),z.lazy(() => ProductFindManyArgsSchema)]).optional(),
  patient: z.union([z.boolean(),z.lazy(() => PatientArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EventCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PROPOSED TIME
//------------------------------------------------------

export const ProposedTimeIncludeSchema: z.ZodType<Prisma.ProposedTimeInclude> = z.object({
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
}).strict()

export const ProposedTimeArgsSchema: z.ZodType<Prisma.ProposedTimeDefaultArgs> = z.object({
  select: z.lazy(() => ProposedTimeSelectSchema).optional(),
  include: z.lazy(() => ProposedTimeIncludeSchema).optional(),
}).strict();

export const ProposedTimeSelectSchema: z.ZodType<Prisma.ProposedTimeSelect> = z.object({
  id: z.boolean().optional(),
  date: z.boolean().optional(),
  start: z.boolean().optional(),
  end: z.boolean().optional(),
  status: z.boolean().optional(),
  notified: z.boolean().optional(),
  eventId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
}).strict()

// PRODUCT
//------------------------------------------------------

export const ProductIncludeSchema: z.ZodType<Prisma.ProductInclude> = z.object({
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
}).strict()

export const ProductArgsSchema: z.ZodType<Prisma.ProductDefaultArgs> = z.object({
  select: z.lazy(() => ProductSelectSchema).optional(),
  include: z.lazy(() => ProductIncludeSchema).optional(),
}).strict();

export const ProductSelectSchema: z.ZodType<Prisma.ProductSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  price: z.boolean().optional(),
  priceMax: z.boolean().optional(),
  image: z.boolean().optional(),
  tags: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  eventId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
}).strict()

// COUNTY
//------------------------------------------------------

export const CountyIncludeSchema: z.ZodType<Prisma.CountyInclude> = z.object({
  cities: z.union([z.boolean(),z.lazy(() => CityFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CountyCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CountyArgsSchema: z.ZodType<Prisma.CountyDefaultArgs> = z.object({
  select: z.lazy(() => CountySelectSchema).optional(),
  include: z.lazy(() => CountyIncludeSchema).optional(),
}).strict();

export const CountyCountOutputTypeArgsSchema: z.ZodType<Prisma.CountyCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CountyCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CountyCountOutputTypeSelectSchema: z.ZodType<Prisma.CountyCountOutputTypeSelect> = z.object({
  cities: z.boolean().optional(),
}).strict();

export const CountySelectSchema: z.ZodType<Prisma.CountySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  code: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  cities: z.union([z.boolean(),z.lazy(() => CityFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CountyCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CITY
//------------------------------------------------------

export const CityIncludeSchema: z.ZodType<Prisma.CityInclude> = z.object({
  county: z.union([z.boolean(),z.lazy(() => CountyArgsSchema)]).optional(),
}).strict()

export const CityArgsSchema: z.ZodType<Prisma.CityDefaultArgs> = z.object({
  select: z.lazy(() => CitySelectSchema).optional(),
  include: z.lazy(() => CityIncludeSchema).optional(),
}).strict();

export const CitySelectSchema: z.ZodType<Prisma.CitySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  countyId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  county: z.union([z.boolean(),z.lazy(() => CountyArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  access_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expires_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  refresh_token_expires_in: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  token_type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  id_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  session_state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  access_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expires_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  refresh_token_expires_in: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  token_type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  id_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  session_state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AccountAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AccountSumOrderByAggregateInputSchema).optional()
}).strict();

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  index: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  passwordHash: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  banned: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  profile: z.union([ z.lazy(() => ProfileNullableRelationFilterSchema),z.lazy(() => ProfileWhereInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  tokens: z.lazy(() => TokenListRelationFilterSchema).optional(),
  patients: z.lazy(() => PatientListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  index: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  passwordHash: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  banned: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  profile: z.lazy(() => ProfileOrderByWithRelationInputSchema).optional(),
  accounts: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
  tokens: z.lazy(() => TokenOrderByRelationAggregateInputSchema).optional(),
  patients: z.lazy(() => PatientOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    email: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  index: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  passwordHash: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  banned: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  profile: z.union([ z.lazy(() => ProfileNullableRelationFilterSchema),z.lazy(() => ProfileWhereInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  tokens: z.lazy(() => TokenListRelationFilterSchema).optional(),
  patients: z.lazy(() => PatientListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  index: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  passwordHash: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  banned: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  index: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  passwordHash: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleWithAggregatesFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  banned: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProfileWhereInputSchema: z.ZodType<Prisma.ProfileWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProfileWhereInputSchema),z.lazy(() => ProfileWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProfileWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProfileWhereInputSchema),z.lazy(() => ProfileWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  avatar: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const ProfileOrderByWithRelationInputSchema: z.ZodType<Prisma.ProfileOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const ProfileWhereUniqueInputSchema: z.ZodType<Prisma.ProfileWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    userId: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    userId: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  userId: z.string().optional(),
  AND: z.union([ z.lazy(() => ProfileWhereInputSchema),z.lazy(() => ProfileWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProfileWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProfileWhereInputSchema),z.lazy(() => ProfileWhereInputSchema).array() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  avatar: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const ProfileOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProfileOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProfileCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProfileMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProfileMinOrderByAggregateInputSchema).optional()
}).strict();

export const ProfileScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProfileScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema),z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema),z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  avatar: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TokenWhereInputSchema: z.ZodType<Prisma.TokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TokenWhereInputSchema),z.lazy(() => TokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TokenWhereInputSchema),z.lazy(() => TokenWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumTokenTypeFilterSchema),z.lazy(() => TokenTypeSchema) ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const TokenOrderByWithRelationInputSchema: z.ZodType<Prisma.TokenOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const TokenWhereUniqueInputSchema: z.ZodType<Prisma.TokenWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    token: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    token: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  token: z.string().optional(),
  AND: z.union([ z.lazy(() => TokenWhereInputSchema),z.lazy(() => TokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TokenWhereInputSchema),z.lazy(() => TokenWhereInputSchema).array() ]).optional(),
  type: z.union([ z.lazy(() => EnumTokenTypeFilterSchema),z.lazy(() => TokenTypeSchema) ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const TokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.TokenOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TokenMinOrderByAggregateInputSchema).optional()
}).strict();

export const TokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TokenScalarWhereWithAggregatesInputSchema),z.lazy(() => TokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TokenScalarWhereWithAggregatesInputSchema),z.lazy(() => TokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumTokenTypeWithAggregatesFilterSchema),z.lazy(() => TokenTypeSchema) ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const PatientWhereInputSchema: z.ZodType<Prisma.PatientWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PatientWhereInputSchema),z.lazy(() => PatientWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PatientWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PatientWhereInputSchema),z.lazy(() => PatientWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  gender: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dob: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  county: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumStatusFilterSchema),z.lazy(() => StatusSchema) ]).optional(),
  smsNotifications: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  emailNotifications: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  appointments: z.lazy(() => EventListRelationFilterSchema).optional()
}).strict();

export const PatientOrderByWithRelationInputSchema: z.ZodType<Prisma.PatientOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  gender: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dob: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  county: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  smsNotifications: z.lazy(() => SortOrderSchema).optional(),
  emailNotifications: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  appointments: z.lazy(() => EventOrderByRelationAggregateInputSchema).optional()
}).strict();

export const PatientWhereUniqueInputSchema: z.ZodType<Prisma.PatientWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => PatientWhereInputSchema),z.lazy(() => PatientWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PatientWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PatientWhereInputSchema),z.lazy(() => PatientWhereInputSchema).array() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  gender: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dob: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  county: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumStatusFilterSchema),z.lazy(() => StatusSchema) ]).optional(),
  smsNotifications: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  emailNotifications: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  appointments: z.lazy(() => EventListRelationFilterSchema).optional()
}).strict());

export const PatientOrderByWithAggregationInputSchema: z.ZodType<Prisma.PatientOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  gender: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dob: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  county: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  smsNotifications: z.lazy(() => SortOrderSchema).optional(),
  emailNotifications: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PatientCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PatientMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PatientMinOrderByAggregateInputSchema).optional()
}).strict();

export const PatientScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PatientScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PatientScalarWhereWithAggregatesInputSchema),z.lazy(() => PatientScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PatientScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PatientScalarWhereWithAggregatesInputSchema),z.lazy(() => PatientScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  gender: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  dob: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  county: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumStatusWithAggregatesFilterSchema),z.lazy(() => StatusSchema) ]).optional(),
  smsNotifications: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  emailNotifications: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const EventWhereInputSchema: z.ZodType<Prisma.EventWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EventWhereInputSchema),z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventWhereInputSchema),z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  start: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  end: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  allDay: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  type: z.union([ z.lazy(() => EnumEventTypeFilterSchema),z.lazy(() => EventTypeSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumEventStatusFilterSchema),z.lazy(() => EventStatusSchema) ]).optional(),
  patientId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  proposedTimes: z.lazy(() => ProposedTimeListRelationFilterSchema).optional(),
  products: z.lazy(() => ProductListRelationFilterSchema).optional(),
  patient: z.union([ z.lazy(() => PatientNullableRelationFilterSchema),z.lazy(() => PatientWhereInputSchema) ]).optional().nullable(),
}).strict();

export const EventOrderByWithRelationInputSchema: z.ZodType<Prisma.EventOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  start: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  end: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  allDay: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  patientId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  proposedTimes: z.lazy(() => ProposedTimeOrderByRelationAggregateInputSchema).optional(),
  products: z.lazy(() => ProductOrderByRelationAggregateInputSchema).optional(),
  patient: z.lazy(() => PatientOrderByWithRelationInputSchema).optional()
}).strict();

export const EventWhereUniqueInputSchema: z.ZodType<Prisma.EventWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => EventWhereInputSchema),z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventWhereInputSchema),z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  start: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  end: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  allDay: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  type: z.union([ z.lazy(() => EnumEventTypeFilterSchema),z.lazy(() => EventTypeSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumEventStatusFilterSchema),z.lazy(() => EventStatusSchema) ]).optional(),
  patientId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  proposedTimes: z.lazy(() => ProposedTimeListRelationFilterSchema).optional(),
  products: z.lazy(() => ProductListRelationFilterSchema).optional(),
  patient: z.union([ z.lazy(() => PatientNullableRelationFilterSchema),z.lazy(() => PatientWhereInputSchema) ]).optional().nullable(),
}).strict());

export const EventOrderByWithAggregationInputSchema: z.ZodType<Prisma.EventOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  start: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  end: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  allDay: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  patientId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EventCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EventMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EventMinOrderByAggregateInputSchema).optional()
}).strict();

export const EventScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EventScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EventScalarWhereWithAggregatesInputSchema),z.lazy(() => EventScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventScalarWhereWithAggregatesInputSchema),z.lazy(() => EventScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  date: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  start: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  end: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  allDay: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  type: z.union([ z.lazy(() => EnumEventTypeWithAggregatesFilterSchema),z.lazy(() => EventTypeSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumEventStatusWithAggregatesFilterSchema),z.lazy(() => EventStatusSchema) ]).optional(),
  patientId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProposedTimeWhereInputSchema: z.ZodType<Prisma.ProposedTimeWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProposedTimeWhereInputSchema),z.lazy(() => ProposedTimeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProposedTimeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProposedTimeWhereInputSchema),z.lazy(() => ProposedTimeWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  start: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  end: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumEventStatusFilterSchema),z.lazy(() => EventStatusSchema) ]).optional(),
  notified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  event: z.union([ z.lazy(() => EventRelationFilterSchema),z.lazy(() => EventWhereInputSchema) ]).optional(),
}).strict();

export const ProposedTimeOrderByWithRelationInputSchema: z.ZodType<Prisma.ProposedTimeOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  start: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  end: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  notified: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  event: z.lazy(() => EventOrderByWithRelationInputSchema).optional()
}).strict();

export const ProposedTimeWhereUniqueInputSchema: z.ZodType<Prisma.ProposedTimeWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => ProposedTimeWhereInputSchema),z.lazy(() => ProposedTimeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProposedTimeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProposedTimeWhereInputSchema),z.lazy(() => ProposedTimeWhereInputSchema).array() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  start: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  end: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumEventStatusFilterSchema),z.lazy(() => EventStatusSchema) ]).optional(),
  notified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  event: z.union([ z.lazy(() => EventRelationFilterSchema),z.lazy(() => EventWhereInputSchema) ]).optional(),
}).strict());

export const ProposedTimeOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProposedTimeOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  start: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  end: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  notified: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProposedTimeCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProposedTimeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProposedTimeMinOrderByAggregateInputSchema).optional()
}).strict();

export const ProposedTimeScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProposedTimeScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProposedTimeScalarWhereWithAggregatesInputSchema),z.lazy(() => ProposedTimeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProposedTimeScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProposedTimeScalarWhereWithAggregatesInputSchema),z.lazy(() => ProposedTimeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  start: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  end: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumEventStatusWithAggregatesFilterSchema),z.lazy(() => EventStatusSchema) ]).optional(),
  notified: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  eventId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProductWhereInputSchema: z.ZodType<Prisma.ProductWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  priceMax: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  isDeleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  event: z.union([ z.lazy(() => EventRelationFilterSchema),z.lazy(() => EventWhereInputSchema) ]).optional(),
}).strict();

export const ProductOrderByWithRelationInputSchema: z.ZodType<Prisma.ProductOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  priceMax: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  event: z.lazy(() => EventOrderByWithRelationInputSchema).optional()
}).strict();

export const ProductWhereUniqueInputSchema: z.ZodType<Prisma.ProductWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  priceMax: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  isDeleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  event: z.union([ z.lazy(() => EventRelationFilterSchema),z.lazy(() => EventWhereInputSchema) ]).optional(),
}).strict());

export const ProductOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProductOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  priceMax: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProductCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProductAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProductMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProductMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProductSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProductScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProductScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProductScalarWhereWithAggregatesInputSchema),z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductScalarWhereWithAggregatesInputSchema),z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  priceMax: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  isDeleted: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  eventId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CountyWhereInputSchema: z.ZodType<Prisma.CountyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CountyWhereInputSchema),z.lazy(() => CountyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CountyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CountyWhereInputSchema),z.lazy(() => CountyWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  code: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  cities: z.lazy(() => CityListRelationFilterSchema).optional()
}).strict();

export const CountyOrderByWithRelationInputSchema: z.ZodType<Prisma.CountyOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  cities: z.lazy(() => CityOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CountyWhereUniqueInputSchema: z.ZodType<Prisma.CountyWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => CountyWhereInputSchema),z.lazy(() => CountyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CountyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CountyWhereInputSchema),z.lazy(() => CountyWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  code: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  cities: z.lazy(() => CityListRelationFilterSchema).optional()
}).strict());

export const CountyOrderByWithAggregationInputSchema: z.ZodType<Prisma.CountyOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CountyCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CountyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CountyMinOrderByAggregateInputSchema).optional()
}).strict();

export const CountyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CountyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CountyScalarWhereWithAggregatesInputSchema),z.lazy(() => CountyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CountyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CountyScalarWhereWithAggregatesInputSchema),z.lazy(() => CountyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  code: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CityWhereInputSchema: z.ZodType<Prisma.CityWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CityWhereInputSchema),z.lazy(() => CityWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CityWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CityWhereInputSchema),z.lazy(() => CityWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  countyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  county: z.union([ z.lazy(() => CountyRelationFilterSchema),z.lazy(() => CountyWhereInputSchema) ]).optional(),
}).strict();

export const CityOrderByWithRelationInputSchema: z.ZodType<Prisma.CityOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  countyId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  county: z.lazy(() => CountyOrderByWithRelationInputSchema).optional()
}).strict();

export const CityWhereUniqueInputSchema: z.ZodType<Prisma.CityWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => CityWhereInputSchema),z.lazy(() => CityWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CityWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CityWhereInputSchema),z.lazy(() => CityWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  countyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  county: z.union([ z.lazy(() => CountyRelationFilterSchema),z.lazy(() => CountyWhereInputSchema) ]).optional(),
}).strict());

export const CityOrderByWithAggregationInputSchema: z.ZodType<Prisma.CityOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  countyId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CityCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CityMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CityMinOrderByAggregateInputSchema).optional()
}).strict();

export const CityScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CityScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CityScalarWhereWithAggregatesInputSchema),z.lazy(() => CityScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CityScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CityScalarWhereWithAggregatesInputSchema),z.lazy(() => CityScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  countyId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  provider: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.coerce.date().optional().nullable(),
  refresh_token_expires_in: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema)
}).strict();

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.coerce.date().optional().nullable(),
  refresh_token_expires_in: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable()
}).strict();

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema).optional()
}).strict();

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.coerce.date().optional().nullable(),
  refresh_token_expires_in: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable()
}).strict();

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().cuid().optional(),
  index: z.number().int().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  phone: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  banned: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileCreateNestedOneWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  tokens: z.lazy(() => TokenCreateNestedManyWithoutUserInputSchema).optional(),
  patients: z.lazy(() => PatientCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  index: z.number().int().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  phone: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  banned: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tokens: z.lazy(() => TokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  patients: z.lazy(() => PatientUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  banned: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUpdateOneWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  tokens: z.lazy(() => TokenUpdateManyWithoutUserNestedInputSchema).optional(),
  patients: z.lazy(() => PatientUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  banned: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tokens: z.lazy(() => TokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  patients: z.lazy(() => PatientUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  index: z.number().int().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  phone: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  banned: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  banned: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  banned: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProfileCreateInputSchema: z.ZodType<Prisma.ProfileCreateInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutProfileInputSchema)
}).strict();

export const ProfileUncheckedCreateInputSchema: z.ZodType<Prisma.ProfileUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProfileUpdateInputSchema: z.ZodType<Prisma.ProfileUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutProfileNestedInputSchema).optional()
}).strict();

export const ProfileUncheckedUpdateInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProfileCreateManyInputSchema: z.ZodType<Prisma.ProfileCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProfileUpdateManyMutationInputSchema: z.ZodType<Prisma.ProfileUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProfileUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TokenCreateInputSchema: z.ZodType<Prisma.TokenCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => TokenTypeSchema),
  token: z.string(),
  expires: z.coerce.date(),
  user: z.lazy(() => UserCreateNestedOneWithoutTokensInputSchema)
}).strict();

export const TokenUncheckedCreateInputSchema: z.ZodType<Prisma.TokenUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => TokenTypeSchema),
  token: z.string(),
  expires: z.coerce.date(),
  userId: z.string()
}).strict();

export const TokenUpdateInputSchema: z.ZodType<Prisma.TokenUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TokenTypeSchema),z.lazy(() => EnumTokenTypeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutTokensNestedInputSchema).optional()
}).strict();

export const TokenUncheckedUpdateInputSchema: z.ZodType<Prisma.TokenUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TokenTypeSchema),z.lazy(() => EnumTokenTypeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TokenCreateManyInputSchema: z.ZodType<Prisma.TokenCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => TokenTypeSchema),
  token: z.string(),
  expires: z.coerce.date(),
  userId: z.string()
}).strict();

export const TokenUpdateManyMutationInputSchema: z.ZodType<Prisma.TokenUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TokenTypeSchema),z.lazy(() => EnumTokenTypeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TokenUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TokenTypeSchema),z.lazy(() => EnumTokenTypeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PatientCreateInputSchema: z.ZodType<Prisma.PatientCreateInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string().optional().nullable(),
  dob: z.coerce.date().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
  status: z.lazy(() => StatusSchema).optional(),
  smsNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutPatientsInputSchema),
  appointments: z.lazy(() => EventCreateNestedManyWithoutPatientInputSchema).optional()
}).strict();

export const PatientUncheckedCreateInputSchema: z.ZodType<Prisma.PatientUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string().optional().nullable(),
  dob: z.coerce.date().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
  status: z.lazy(() => StatusSchema).optional(),
  smsNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  appointments: z.lazy(() => EventUncheckedCreateNestedManyWithoutPatientInputSchema).optional()
}).strict();

export const PatientUpdateInputSchema: z.ZodType<Prisma.PatientUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  county: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  smsNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  emailNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPatientsNestedInputSchema).optional(),
  appointments: z.lazy(() => EventUpdateManyWithoutPatientNestedInputSchema).optional()
}).strict();

export const PatientUncheckedUpdateInputSchema: z.ZodType<Prisma.PatientUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  county: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  smsNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  emailNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  appointments: z.lazy(() => EventUncheckedUpdateManyWithoutPatientNestedInputSchema).optional()
}).strict();

export const PatientCreateManyInputSchema: z.ZodType<Prisma.PatientCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string().optional().nullable(),
  dob: z.coerce.date().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
  status: z.lazy(() => StatusSchema).optional(),
  smsNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PatientUpdateManyMutationInputSchema: z.ZodType<Prisma.PatientUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  county: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  smsNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  emailNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PatientUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PatientUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  county: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  smsNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  emailNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EventCreateInputSchema: z.ZodType<Prisma.EventCreateInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  date: z.coerce.date(),
  start: z.coerce.date().optional().nullable(),
  end: z.coerce.date().optional().nullable(),
  allDay: z.boolean().optional(),
  type: z.lazy(() => EventTypeSchema).optional(),
  status: z.lazy(() => EventStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  proposedTimes: z.lazy(() => ProposedTimeCreateNestedManyWithoutEventInputSchema).optional(),
  products: z.lazy(() => ProductCreateNestedManyWithoutEventInputSchema).optional(),
  patient: z.lazy(() => PatientCreateNestedOneWithoutAppointmentsInputSchema).optional()
}).strict();

export const EventUncheckedCreateInputSchema: z.ZodType<Prisma.EventUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  date: z.coerce.date(),
  start: z.coerce.date().optional().nullable(),
  end: z.coerce.date().optional().nullable(),
  allDay: z.boolean().optional(),
  type: z.lazy(() => EventTypeSchema).optional(),
  status: z.lazy(() => EventStatusSchema).optional(),
  patientId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  proposedTimes: z.lazy(() => ProposedTimeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  products: z.lazy(() => ProductUncheckedCreateNestedManyWithoutEventInputSchema).optional()
}).strict();

export const EventUpdateInputSchema: z.ZodType<Prisma.EventUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => EventTypeSchema),z.lazy(() => EnumEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  proposedTimes: z.lazy(() => ProposedTimeUpdateManyWithoutEventNestedInputSchema).optional(),
  products: z.lazy(() => ProductUpdateManyWithoutEventNestedInputSchema).optional(),
  patient: z.lazy(() => PatientUpdateOneWithoutAppointmentsNestedInputSchema).optional()
}).strict();

export const EventUncheckedUpdateInputSchema: z.ZodType<Prisma.EventUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => EventTypeSchema),z.lazy(() => EnumEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  patientId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  proposedTimes: z.lazy(() => ProposedTimeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  products: z.lazy(() => ProductUncheckedUpdateManyWithoutEventNestedInputSchema).optional()
}).strict();

export const EventCreateManyInputSchema: z.ZodType<Prisma.EventCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  date: z.coerce.date(),
  start: z.coerce.date().optional().nullable(),
  end: z.coerce.date().optional().nullable(),
  allDay: z.boolean().optional(),
  type: z.lazy(() => EventTypeSchema).optional(),
  status: z.lazy(() => EventStatusSchema).optional(),
  patientId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const EventUpdateManyMutationInputSchema: z.ZodType<Prisma.EventUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => EventTypeSchema),z.lazy(() => EnumEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EventUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EventUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => EventTypeSchema),z.lazy(() => EnumEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  patientId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProposedTimeCreateInputSchema: z.ZodType<Prisma.ProposedTimeCreateInput> = z.object({
  id: z.string().cuid().optional(),
  date: z.coerce.date(),
  start: z.coerce.date().optional().nullable(),
  end: z.coerce.date().optional().nullable(),
  status: z.lazy(() => EventStatusSchema).optional(),
  notified: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  event: z.lazy(() => EventCreateNestedOneWithoutProposedTimesInputSchema)
}).strict();

export const ProposedTimeUncheckedCreateInputSchema: z.ZodType<Prisma.ProposedTimeUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  date: z.coerce.date(),
  start: z.coerce.date().optional().nullable(),
  end: z.coerce.date().optional().nullable(),
  status: z.lazy(() => EventStatusSchema).optional(),
  notified: z.boolean().optional(),
  eventId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProposedTimeUpdateInputSchema: z.ZodType<Prisma.ProposedTimeUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutProposedTimesNestedInputSchema).optional()
}).strict();

export const ProposedTimeUncheckedUpdateInputSchema: z.ZodType<Prisma.ProposedTimeUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProposedTimeCreateManyInputSchema: z.ZodType<Prisma.ProposedTimeCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  date: z.coerce.date(),
  start: z.coerce.date().optional().nullable(),
  end: z.coerce.date().optional().nullable(),
  status: z.lazy(() => EventStatusSchema).optional(),
  notified: z.boolean().optional(),
  eventId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProposedTimeUpdateManyMutationInputSchema: z.ZodType<Prisma.ProposedTimeUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProposedTimeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProposedTimeUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductCreateInputSchema: z.ZodType<Prisma.ProductCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  price: z.number(),
  priceMax: z.number().optional().nullable(),
  image: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => ProductCreatetagsInputSchema),z.string().array() ]).optional(),
  isDeleted: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  event: z.lazy(() => EventCreateNestedOneWithoutProductsInputSchema)
}).strict();

export const ProductUncheckedCreateInputSchema: z.ZodType<Prisma.ProductUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  price: z.number(),
  priceMax: z.number().optional().nullable(),
  image: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => ProductCreatetagsInputSchema),z.string().array() ]).optional(),
  isDeleted: z.boolean().optional(),
  eventId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductUpdateInputSchema: z.ZodType<Prisma.ProductUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  priceMax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => ProductUpdatetagsInputSchema),z.string().array() ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutProductsNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  priceMax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => ProductUpdatetagsInputSchema),z.string().array() ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductCreateManyInputSchema: z.ZodType<Prisma.ProductCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  price: z.number(),
  priceMax: z.number().optional().nullable(),
  image: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => ProductCreatetagsInputSchema),z.string().array() ]).optional(),
  isDeleted: z.boolean().optional(),
  eventId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductUpdateManyMutationInputSchema: z.ZodType<Prisma.ProductUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  priceMax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => ProductUpdatetagsInputSchema),z.string().array() ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  priceMax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => ProductUpdatetagsInputSchema),z.string().array() ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CountyCreateInputSchema: z.ZodType<Prisma.CountyCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  code: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  cities: z.lazy(() => CityCreateNestedManyWithoutCountyInputSchema).optional()
}).strict();

export const CountyUncheckedCreateInputSchema: z.ZodType<Prisma.CountyUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  code: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  cities: z.lazy(() => CityUncheckedCreateNestedManyWithoutCountyInputSchema).optional()
}).strict();

export const CountyUpdateInputSchema: z.ZodType<Prisma.CountyUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  cities: z.lazy(() => CityUpdateManyWithoutCountyNestedInputSchema).optional()
}).strict();

export const CountyUncheckedUpdateInputSchema: z.ZodType<Prisma.CountyUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  cities: z.lazy(() => CityUncheckedUpdateManyWithoutCountyNestedInputSchema).optional()
}).strict();

export const CountyCreateManyInputSchema: z.ZodType<Prisma.CountyCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  code: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CountyUpdateManyMutationInputSchema: z.ZodType<Prisma.CountyUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CountyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CountyUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CityCreateInputSchema: z.ZodType<Prisma.CityCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  county: z.lazy(() => CountyCreateNestedOneWithoutCitiesInputSchema)
}).strict();

export const CityUncheckedCreateInputSchema: z.ZodType<Prisma.CityUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  countyId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CityUpdateInputSchema: z.ZodType<Prisma.CityUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  county: z.lazy(() => CountyUpdateOneRequiredWithoutCitiesNestedInputSchema).optional()
}).strict();

export const CityUncheckedUpdateInputSchema: z.ZodType<Prisma.CityUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  countyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CityCreateManyInputSchema: z.ZodType<Prisma.CityCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  countyId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CityUpdateManyMutationInputSchema: z.ZodType<Prisma.CityUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CityUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CityUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  countyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  refresh_token_expires_in: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AccountAvgOrderByAggregateInput> = z.object({
  refresh_token_expires_in: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  refresh_token_expires_in: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  refresh_token_expires_in: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountSumOrderByAggregateInputSchema: z.ZodType<Prisma.AccountSumOrderByAggregateInput> = z.object({
  refresh_token_expires_in: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const EnumRoleFilterSchema: z.ZodType<Prisma.EnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const ProfileNullableRelationFilterSchema: z.ZodType<Prisma.ProfileNullableRelationFilter> = z.object({
  is: z.lazy(() => ProfileWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ProfileWhereInputSchema).optional().nullable()
}).strict();

export const AccountListRelationFilterSchema: z.ZodType<Prisma.AccountListRelationFilter> = z.object({
  every: z.lazy(() => AccountWhereInputSchema).optional(),
  some: z.lazy(() => AccountWhereInputSchema).optional(),
  none: z.lazy(() => AccountWhereInputSchema).optional()
}).strict();

export const TokenListRelationFilterSchema: z.ZodType<Prisma.TokenListRelationFilter> = z.object({
  every: z.lazy(() => TokenWhereInputSchema).optional(),
  some: z.lazy(() => TokenWhereInputSchema).optional(),
  none: z.lazy(() => TokenWhereInputSchema).optional()
}).strict();

export const PatientListRelationFilterSchema: z.ZodType<Prisma.PatientListRelationFilter> = z.object({
  every: z.lazy(() => PatientWhereInputSchema).optional(),
  some: z.lazy(() => PatientWhereInputSchema).optional(),
  none: z.lazy(() => PatientWhereInputSchema).optional()
}).strict();

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TokenOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TokenOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PatientOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PatientOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  index: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  passwordHash: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  banned: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.object({
  index: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  index: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  passwordHash: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  banned: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  index: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  passwordHash: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  banned: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.object({
  index: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const EnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const ProfileCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProfileCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProfileMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProfileMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProfileMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProfileMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumTokenTypeFilterSchema: z.ZodType<Prisma.EnumTokenTypeFilter> = z.object({
  equals: z.lazy(() => TokenTypeSchema).optional(),
  in: z.lazy(() => TokenTypeSchema).array().optional(),
  notIn: z.lazy(() => TokenTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TokenTypeSchema),z.lazy(() => NestedEnumTokenTypeFilterSchema) ]).optional(),
}).strict();

export const TokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.TokenCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TokenMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.TokenMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumTokenTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumTokenTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TokenTypeSchema).optional(),
  in: z.lazy(() => TokenTypeSchema).array().optional(),
  notIn: z.lazy(() => TokenTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TokenTypeSchema),z.lazy(() => NestedEnumTokenTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTokenTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTokenTypeFilterSchema).optional()
}).strict();

export const EnumStatusFilterSchema: z.ZodType<Prisma.EnumStatusFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema),z.lazy(() => NestedEnumStatusFilterSchema) ]).optional(),
}).strict();

export const EventListRelationFilterSchema: z.ZodType<Prisma.EventListRelationFilter> = z.object({
  every: z.lazy(() => EventWhereInputSchema).optional(),
  some: z.lazy(() => EventWhereInputSchema).optional(),
  none: z.lazy(() => EventWhereInputSchema).optional()
}).strict();

export const EventOrderByRelationAggregateInputSchema: z.ZodType<Prisma.EventOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PatientCountOrderByAggregateInputSchema: z.ZodType<Prisma.PatientCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  dob: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  county: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  smsNotifications: z.lazy(() => SortOrderSchema).optional(),
  emailNotifications: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PatientMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PatientMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  dob: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  county: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  smsNotifications: z.lazy(() => SortOrderSchema).optional(),
  emailNotifications: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PatientMinOrderByAggregateInputSchema: z.ZodType<Prisma.PatientMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  dob: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  county: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  smsNotifications: z.lazy(() => SortOrderSchema).optional(),
  emailNotifications: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema),z.lazy(() => NestedEnumStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumStatusFilterSchema).optional()
}).strict();

export const EnumEventTypeFilterSchema: z.ZodType<Prisma.EnumEventTypeFilter> = z.object({
  equals: z.lazy(() => EventTypeSchema).optional(),
  in: z.lazy(() => EventTypeSchema).array().optional(),
  notIn: z.lazy(() => EventTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EventTypeSchema),z.lazy(() => NestedEnumEventTypeFilterSchema) ]).optional(),
}).strict();

export const EnumEventStatusFilterSchema: z.ZodType<Prisma.EnumEventStatusFilter> = z.object({
  equals: z.lazy(() => EventStatusSchema).optional(),
  in: z.lazy(() => EventStatusSchema).array().optional(),
  notIn: z.lazy(() => EventStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => NestedEnumEventStatusFilterSchema) ]).optional(),
}).strict();

export const ProposedTimeListRelationFilterSchema: z.ZodType<Prisma.ProposedTimeListRelationFilter> = z.object({
  every: z.lazy(() => ProposedTimeWhereInputSchema).optional(),
  some: z.lazy(() => ProposedTimeWhereInputSchema).optional(),
  none: z.lazy(() => ProposedTimeWhereInputSchema).optional()
}).strict();

export const ProductListRelationFilterSchema: z.ZodType<Prisma.ProductListRelationFilter> = z.object({
  every: z.lazy(() => ProductWhereInputSchema).optional(),
  some: z.lazy(() => ProductWhereInputSchema).optional(),
  none: z.lazy(() => ProductWhereInputSchema).optional()
}).strict();

export const PatientNullableRelationFilterSchema: z.ZodType<Prisma.PatientNullableRelationFilter> = z.object({
  is: z.lazy(() => PatientWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => PatientWhereInputSchema).optional().nullable()
}).strict();

export const ProposedTimeOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProposedTimeOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProductOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EventCountOrderByAggregateInputSchema: z.ZodType<Prisma.EventCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  start: z.lazy(() => SortOrderSchema).optional(),
  end: z.lazy(() => SortOrderSchema).optional(),
  allDay: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  patientId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EventMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EventMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  start: z.lazy(() => SortOrderSchema).optional(),
  end: z.lazy(() => SortOrderSchema).optional(),
  allDay: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  patientId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EventMinOrderByAggregateInputSchema: z.ZodType<Prisma.EventMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  start: z.lazy(() => SortOrderSchema).optional(),
  end: z.lazy(() => SortOrderSchema).optional(),
  allDay: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  patientId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumEventTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumEventTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => EventTypeSchema).optional(),
  in: z.lazy(() => EventTypeSchema).array().optional(),
  notIn: z.lazy(() => EventTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EventTypeSchema),z.lazy(() => NestedEnumEventTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumEventTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumEventTypeFilterSchema).optional()
}).strict();

export const EnumEventStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumEventStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => EventStatusSchema).optional(),
  in: z.lazy(() => EventStatusSchema).array().optional(),
  notIn: z.lazy(() => EventStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => NestedEnumEventStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumEventStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumEventStatusFilterSchema).optional()
}).strict();

export const EventRelationFilterSchema: z.ZodType<Prisma.EventRelationFilter> = z.object({
  is: z.lazy(() => EventWhereInputSchema).optional(),
  isNot: z.lazy(() => EventWhereInputSchema).optional()
}).strict();

export const ProposedTimeCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProposedTimeCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  start: z.lazy(() => SortOrderSchema).optional(),
  end: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  notified: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProposedTimeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProposedTimeMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  start: z.lazy(() => SortOrderSchema).optional(),
  end: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  notified: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProposedTimeMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProposedTimeMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  start: z.lazy(() => SortOrderSchema).optional(),
  end: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  notified: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const ProductCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProductCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  priceMax: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProductAvgOrderByAggregateInput> = z.object({
  price: z.lazy(() => SortOrderSchema).optional(),
  priceMax: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProductMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  priceMax: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProductMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  priceMax: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProductSumOrderByAggregateInput> = z.object({
  price: z.lazy(() => SortOrderSchema).optional(),
  priceMax: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const CityListRelationFilterSchema: z.ZodType<Prisma.CityListRelationFilter> = z.object({
  every: z.lazy(() => CityWhereInputSchema).optional(),
  some: z.lazy(() => CityWhereInputSchema).optional(),
  none: z.lazy(() => CityWhereInputSchema).optional()
}).strict();

export const CityOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CityOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountyCountOrderByAggregateInputSchema: z.ZodType<Prisma.CountyCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CountyMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountyMinOrderByAggregateInputSchema: z.ZodType<Prisma.CountyMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountyRelationFilterSchema: z.ZodType<Prisma.CountyRelationFilter> = z.object({
  is: z.lazy(() => CountyWhereInputSchema).optional(),
  isNot: z.lazy(() => CountyWhereInputSchema).optional()
}).strict();

export const CityCountOrderByAggregateInputSchema: z.ZodType<Prisma.CityCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  countyId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CityMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CityMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  countyId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CityMinOrderByAggregateInputSchema: z.ZodType<Prisma.CityMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  countyId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const UserUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAccountsInputSchema),z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]).optional(),
}).strict();

export const ProfileCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.ProfileCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => ProfileWhereUniqueInputSchema).optional()
}).strict();

export const AccountCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TokenCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.TokenCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => TokenCreateWithoutUserInputSchema),z.lazy(() => TokenCreateWithoutUserInputSchema).array(),z.lazy(() => TokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => TokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => TokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TokenCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TokenWhereUniqueInputSchema),z.lazy(() => TokenWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PatientCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.PatientCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => PatientCreateWithoutUserInputSchema),z.lazy(() => PatientCreateWithoutUserInputSchema).array(),z.lazy(() => PatientUncheckedCreateWithoutUserInputSchema),z.lazy(() => PatientUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientCreateOrConnectWithoutUserInputSchema),z.lazy(() => PatientCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PatientWhereUniqueInputSchema),z.lazy(() => PatientWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProfileUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.ProfileUncheckedCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => ProfileWhereUniqueInputSchema).optional()
}).strict();

export const AccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TokenUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.TokenUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => TokenCreateWithoutUserInputSchema),z.lazy(() => TokenCreateWithoutUserInputSchema).array(),z.lazy(() => TokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => TokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => TokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TokenCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TokenWhereUniqueInputSchema),z.lazy(() => TokenWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PatientUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.PatientUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => PatientCreateWithoutUserInputSchema),z.lazy(() => PatientCreateWithoutUserInputSchema).array(),z.lazy(() => PatientUncheckedCreateWithoutUserInputSchema),z.lazy(() => PatientUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientCreateOrConnectWithoutUserInputSchema),z.lazy(() => PatientCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PatientWhereUniqueInputSchema),z.lazy(() => PatientWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const EnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => RoleSchema).optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const ProfileUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.ProfileUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => ProfileUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProfileWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProfileWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProfileWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProfileUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => ProfileUpdateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const AccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TokenUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.TokenUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => TokenCreateWithoutUserInputSchema),z.lazy(() => TokenCreateWithoutUserInputSchema).array(),z.lazy(() => TokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => TokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => TokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TokenUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TokenUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TokenCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TokenWhereUniqueInputSchema),z.lazy(() => TokenWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TokenWhereUniqueInputSchema),z.lazy(() => TokenWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TokenWhereUniqueInputSchema),z.lazy(() => TokenWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TokenWhereUniqueInputSchema),z.lazy(() => TokenWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TokenUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TokenUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TokenUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => TokenUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TokenScalarWhereInputSchema),z.lazy(() => TokenScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PatientUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.PatientUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => PatientCreateWithoutUserInputSchema),z.lazy(() => PatientCreateWithoutUserInputSchema).array(),z.lazy(() => PatientUncheckedCreateWithoutUserInputSchema),z.lazy(() => PatientUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientCreateOrConnectWithoutUserInputSchema),z.lazy(() => PatientCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PatientUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PatientUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PatientWhereUniqueInputSchema),z.lazy(() => PatientWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PatientWhereUniqueInputSchema),z.lazy(() => PatientWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PatientWhereUniqueInputSchema),z.lazy(() => PatientWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PatientWhereUniqueInputSchema),z.lazy(() => PatientWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PatientUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PatientUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PatientUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => PatientUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PatientScalarWhereInputSchema),z.lazy(() => PatientScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProfileUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => ProfileUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProfileWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProfileWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProfileWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProfileUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => ProfileUpdateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TokenUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.TokenUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => TokenCreateWithoutUserInputSchema),z.lazy(() => TokenCreateWithoutUserInputSchema).array(),z.lazy(() => TokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => TokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => TokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TokenUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TokenUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TokenCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TokenWhereUniqueInputSchema),z.lazy(() => TokenWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TokenWhereUniqueInputSchema),z.lazy(() => TokenWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TokenWhereUniqueInputSchema),z.lazy(() => TokenWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TokenWhereUniqueInputSchema),z.lazy(() => TokenWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TokenUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TokenUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TokenUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => TokenUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TokenScalarWhereInputSchema),z.lazy(() => TokenScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PatientUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.PatientUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => PatientCreateWithoutUserInputSchema),z.lazy(() => PatientCreateWithoutUserInputSchema).array(),z.lazy(() => PatientUncheckedCreateWithoutUserInputSchema),z.lazy(() => PatientUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientCreateOrConnectWithoutUserInputSchema),z.lazy(() => PatientCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PatientUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PatientUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PatientWhereUniqueInputSchema),z.lazy(() => PatientWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PatientWhereUniqueInputSchema),z.lazy(() => PatientWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PatientWhereUniqueInputSchema),z.lazy(() => PatientWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PatientWhereUniqueInputSchema),z.lazy(() => PatientWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PatientUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PatientUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PatientUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => PatientUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PatientScalarWhereInputSchema),z.lazy(() => PatientScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutProfileInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutProfileInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutProfileInputSchema),z.lazy(() => UserUncheckedCreateWithoutProfileInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutProfileInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutProfileNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutProfileNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutProfileInputSchema),z.lazy(() => UserUncheckedCreateWithoutProfileInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutProfileInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutProfileInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutProfileInputSchema),z.lazy(() => UserUpdateWithoutProfileInputSchema),z.lazy(() => UserUncheckedUpdateWithoutProfileInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutTokensInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutTokensInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutTokensInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTokensInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const EnumTokenTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumTokenTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => TokenTypeSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutTokensNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutTokensNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutTokensInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTokensInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutTokensInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutTokensInputSchema),z.lazy(() => UserUpdateWithoutTokensInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTokensInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutPatientsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutPatientsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPatientsInputSchema),z.lazy(() => UserUncheckedCreateWithoutPatientsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPatientsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const EventCreateNestedManyWithoutPatientInputSchema: z.ZodType<Prisma.EventCreateNestedManyWithoutPatientInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutPatientInputSchema),z.lazy(() => EventCreateWithoutPatientInputSchema).array(),z.lazy(() => EventUncheckedCreateWithoutPatientInputSchema),z.lazy(() => EventUncheckedCreateWithoutPatientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutPatientInputSchema),z.lazy(() => EventCreateOrConnectWithoutPatientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyPatientInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EventUncheckedCreateNestedManyWithoutPatientInputSchema: z.ZodType<Prisma.EventUncheckedCreateNestedManyWithoutPatientInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutPatientInputSchema),z.lazy(() => EventCreateWithoutPatientInputSchema).array(),z.lazy(() => EventUncheckedCreateWithoutPatientInputSchema),z.lazy(() => EventUncheckedCreateWithoutPatientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutPatientInputSchema),z.lazy(() => EventCreateOrConnectWithoutPatientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyPatientInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => StatusSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutPatientsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutPatientsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPatientsInputSchema),z.lazy(() => UserUncheckedCreateWithoutPatientsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPatientsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPatientsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutPatientsInputSchema),z.lazy(() => UserUpdateWithoutPatientsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPatientsInputSchema) ]).optional(),
}).strict();

export const EventUpdateManyWithoutPatientNestedInputSchema: z.ZodType<Prisma.EventUpdateManyWithoutPatientNestedInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutPatientInputSchema),z.lazy(() => EventCreateWithoutPatientInputSchema).array(),z.lazy(() => EventUncheckedCreateWithoutPatientInputSchema),z.lazy(() => EventUncheckedCreateWithoutPatientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutPatientInputSchema),z.lazy(() => EventCreateOrConnectWithoutPatientInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EventUpsertWithWhereUniqueWithoutPatientInputSchema),z.lazy(() => EventUpsertWithWhereUniqueWithoutPatientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyPatientInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EventUpdateWithWhereUniqueWithoutPatientInputSchema),z.lazy(() => EventUpdateWithWhereUniqueWithoutPatientInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EventUpdateManyWithWhereWithoutPatientInputSchema),z.lazy(() => EventUpdateManyWithWhereWithoutPatientInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EventScalarWhereInputSchema),z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EventUncheckedUpdateManyWithoutPatientNestedInputSchema: z.ZodType<Prisma.EventUncheckedUpdateManyWithoutPatientNestedInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutPatientInputSchema),z.lazy(() => EventCreateWithoutPatientInputSchema).array(),z.lazy(() => EventUncheckedCreateWithoutPatientInputSchema),z.lazy(() => EventUncheckedCreateWithoutPatientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutPatientInputSchema),z.lazy(() => EventCreateOrConnectWithoutPatientInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EventUpsertWithWhereUniqueWithoutPatientInputSchema),z.lazy(() => EventUpsertWithWhereUniqueWithoutPatientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyPatientInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EventUpdateWithWhereUniqueWithoutPatientInputSchema),z.lazy(() => EventUpdateWithWhereUniqueWithoutPatientInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EventUpdateManyWithWhereWithoutPatientInputSchema),z.lazy(() => EventUpdateManyWithWhereWithoutPatientInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EventScalarWhereInputSchema),z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProposedTimeCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.ProposedTimeCreateNestedManyWithoutEventInput> = z.object({
  create: z.union([ z.lazy(() => ProposedTimeCreateWithoutEventInputSchema),z.lazy(() => ProposedTimeCreateWithoutEventInputSchema).array(),z.lazy(() => ProposedTimeUncheckedCreateWithoutEventInputSchema),z.lazy(() => ProposedTimeUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProposedTimeCreateOrConnectWithoutEventInputSchema),z.lazy(() => ProposedTimeCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProposedTimeCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProposedTimeWhereUniqueInputSchema),z.lazy(() => ProposedTimeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.ProductCreateNestedManyWithoutEventInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutEventInputSchema),z.lazy(() => ProductCreateWithoutEventInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutEventInputSchema),z.lazy(() => ProductUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutEventInputSchema),z.lazy(() => ProductCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PatientCreateNestedOneWithoutAppointmentsInputSchema: z.ZodType<Prisma.PatientCreateNestedOneWithoutAppointmentsInput> = z.object({
  create: z.union([ z.lazy(() => PatientCreateWithoutAppointmentsInputSchema),z.lazy(() => PatientUncheckedCreateWithoutAppointmentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PatientCreateOrConnectWithoutAppointmentsInputSchema).optional(),
  connect: z.lazy(() => PatientWhereUniqueInputSchema).optional()
}).strict();

export const ProposedTimeUncheckedCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.ProposedTimeUncheckedCreateNestedManyWithoutEventInput> = z.object({
  create: z.union([ z.lazy(() => ProposedTimeCreateWithoutEventInputSchema),z.lazy(() => ProposedTimeCreateWithoutEventInputSchema).array(),z.lazy(() => ProposedTimeUncheckedCreateWithoutEventInputSchema),z.lazy(() => ProposedTimeUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProposedTimeCreateOrConnectWithoutEventInputSchema),z.lazy(() => ProposedTimeCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProposedTimeCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProposedTimeWhereUniqueInputSchema),z.lazy(() => ProposedTimeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductUncheckedCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutEventInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutEventInputSchema),z.lazy(() => ProductCreateWithoutEventInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutEventInputSchema),z.lazy(() => ProductUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutEventInputSchema),z.lazy(() => ProductCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumEventTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumEventTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => EventTypeSchema).optional()
}).strict();

export const EnumEventStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumEventStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => EventStatusSchema).optional()
}).strict();

export const ProposedTimeUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.ProposedTimeUpdateManyWithoutEventNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProposedTimeCreateWithoutEventInputSchema),z.lazy(() => ProposedTimeCreateWithoutEventInputSchema).array(),z.lazy(() => ProposedTimeUncheckedCreateWithoutEventInputSchema),z.lazy(() => ProposedTimeUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProposedTimeCreateOrConnectWithoutEventInputSchema),z.lazy(() => ProposedTimeCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProposedTimeUpsertWithWhereUniqueWithoutEventInputSchema),z.lazy(() => ProposedTimeUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProposedTimeCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProposedTimeWhereUniqueInputSchema),z.lazy(() => ProposedTimeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProposedTimeWhereUniqueInputSchema),z.lazy(() => ProposedTimeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProposedTimeWhereUniqueInputSchema),z.lazy(() => ProposedTimeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProposedTimeWhereUniqueInputSchema),z.lazy(() => ProposedTimeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProposedTimeUpdateWithWhereUniqueWithoutEventInputSchema),z.lazy(() => ProposedTimeUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProposedTimeUpdateManyWithWhereWithoutEventInputSchema),z.lazy(() => ProposedTimeUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProposedTimeScalarWhereInputSchema),z.lazy(() => ProposedTimeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.ProductUpdateManyWithoutEventNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutEventInputSchema),z.lazy(() => ProductCreateWithoutEventInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutEventInputSchema),z.lazy(() => ProductUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutEventInputSchema),z.lazy(() => ProductCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutEventInputSchema),z.lazy(() => ProductUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutEventInputSchema),z.lazy(() => ProductUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutEventInputSchema),z.lazy(() => ProductUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PatientUpdateOneWithoutAppointmentsNestedInputSchema: z.ZodType<Prisma.PatientUpdateOneWithoutAppointmentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => PatientCreateWithoutAppointmentsInputSchema),z.lazy(() => PatientUncheckedCreateWithoutAppointmentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PatientCreateOrConnectWithoutAppointmentsInputSchema).optional(),
  upsert: z.lazy(() => PatientUpsertWithoutAppointmentsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PatientWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PatientWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PatientWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PatientUpdateToOneWithWhereWithoutAppointmentsInputSchema),z.lazy(() => PatientUpdateWithoutAppointmentsInputSchema),z.lazy(() => PatientUncheckedUpdateWithoutAppointmentsInputSchema) ]).optional(),
}).strict();

export const ProposedTimeUncheckedUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.ProposedTimeUncheckedUpdateManyWithoutEventNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProposedTimeCreateWithoutEventInputSchema),z.lazy(() => ProposedTimeCreateWithoutEventInputSchema).array(),z.lazy(() => ProposedTimeUncheckedCreateWithoutEventInputSchema),z.lazy(() => ProposedTimeUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProposedTimeCreateOrConnectWithoutEventInputSchema),z.lazy(() => ProposedTimeCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProposedTimeUpsertWithWhereUniqueWithoutEventInputSchema),z.lazy(() => ProposedTimeUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProposedTimeCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProposedTimeWhereUniqueInputSchema),z.lazy(() => ProposedTimeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProposedTimeWhereUniqueInputSchema),z.lazy(() => ProposedTimeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProposedTimeWhereUniqueInputSchema),z.lazy(() => ProposedTimeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProposedTimeWhereUniqueInputSchema),z.lazy(() => ProposedTimeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProposedTimeUpdateWithWhereUniqueWithoutEventInputSchema),z.lazy(() => ProposedTimeUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProposedTimeUpdateManyWithWhereWithoutEventInputSchema),z.lazy(() => ProposedTimeUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProposedTimeScalarWhereInputSchema),z.lazy(() => ProposedTimeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductUncheckedUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutEventNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutEventInputSchema),z.lazy(() => ProductCreateWithoutEventInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutEventInputSchema),z.lazy(() => ProductUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutEventInputSchema),z.lazy(() => ProductCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutEventInputSchema),z.lazy(() => ProductUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutEventInputSchema),z.lazy(() => ProductUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutEventInputSchema),z.lazy(() => ProductUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EventCreateNestedOneWithoutProposedTimesInputSchema: z.ZodType<Prisma.EventCreateNestedOneWithoutProposedTimesInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutProposedTimesInputSchema),z.lazy(() => EventUncheckedCreateWithoutProposedTimesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutProposedTimesInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional()
}).strict();

export const EventUpdateOneRequiredWithoutProposedTimesNestedInputSchema: z.ZodType<Prisma.EventUpdateOneRequiredWithoutProposedTimesNestedInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutProposedTimesInputSchema),z.lazy(() => EventUncheckedCreateWithoutProposedTimesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutProposedTimesInputSchema).optional(),
  upsert: z.lazy(() => EventUpsertWithoutProposedTimesInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EventUpdateToOneWithWhereWithoutProposedTimesInputSchema),z.lazy(() => EventUpdateWithoutProposedTimesInputSchema),z.lazy(() => EventUncheckedUpdateWithoutProposedTimesInputSchema) ]).optional(),
}).strict();

export const ProductCreatetagsInputSchema: z.ZodType<Prisma.ProductCreatetagsInput> = z.object({
  set: z.string().array()
}).strict();

export const EventCreateNestedOneWithoutProductsInputSchema: z.ZodType<Prisma.EventCreateNestedOneWithoutProductsInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutProductsInputSchema),z.lazy(() => EventUncheckedCreateWithoutProductsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutProductsInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional()
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const ProductUpdatetagsInputSchema: z.ZodType<Prisma.ProductUpdatetagsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const EventUpdateOneRequiredWithoutProductsNestedInputSchema: z.ZodType<Prisma.EventUpdateOneRequiredWithoutProductsNestedInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutProductsInputSchema),z.lazy(() => EventUncheckedCreateWithoutProductsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutProductsInputSchema).optional(),
  upsert: z.lazy(() => EventUpsertWithoutProductsInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EventUpdateToOneWithWhereWithoutProductsInputSchema),z.lazy(() => EventUpdateWithoutProductsInputSchema),z.lazy(() => EventUncheckedUpdateWithoutProductsInputSchema) ]).optional(),
}).strict();

export const CityCreateNestedManyWithoutCountyInputSchema: z.ZodType<Prisma.CityCreateNestedManyWithoutCountyInput> = z.object({
  create: z.union([ z.lazy(() => CityCreateWithoutCountyInputSchema),z.lazy(() => CityCreateWithoutCountyInputSchema).array(),z.lazy(() => CityUncheckedCreateWithoutCountyInputSchema),z.lazy(() => CityUncheckedCreateWithoutCountyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CityCreateOrConnectWithoutCountyInputSchema),z.lazy(() => CityCreateOrConnectWithoutCountyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CityCreateManyCountyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CityWhereUniqueInputSchema),z.lazy(() => CityWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CityUncheckedCreateNestedManyWithoutCountyInputSchema: z.ZodType<Prisma.CityUncheckedCreateNestedManyWithoutCountyInput> = z.object({
  create: z.union([ z.lazy(() => CityCreateWithoutCountyInputSchema),z.lazy(() => CityCreateWithoutCountyInputSchema).array(),z.lazy(() => CityUncheckedCreateWithoutCountyInputSchema),z.lazy(() => CityUncheckedCreateWithoutCountyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CityCreateOrConnectWithoutCountyInputSchema),z.lazy(() => CityCreateOrConnectWithoutCountyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CityCreateManyCountyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CityWhereUniqueInputSchema),z.lazy(() => CityWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CityUpdateManyWithoutCountyNestedInputSchema: z.ZodType<Prisma.CityUpdateManyWithoutCountyNestedInput> = z.object({
  create: z.union([ z.lazy(() => CityCreateWithoutCountyInputSchema),z.lazy(() => CityCreateWithoutCountyInputSchema).array(),z.lazy(() => CityUncheckedCreateWithoutCountyInputSchema),z.lazy(() => CityUncheckedCreateWithoutCountyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CityCreateOrConnectWithoutCountyInputSchema),z.lazy(() => CityCreateOrConnectWithoutCountyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CityUpsertWithWhereUniqueWithoutCountyInputSchema),z.lazy(() => CityUpsertWithWhereUniqueWithoutCountyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CityCreateManyCountyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CityWhereUniqueInputSchema),z.lazy(() => CityWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CityWhereUniqueInputSchema),z.lazy(() => CityWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CityWhereUniqueInputSchema),z.lazy(() => CityWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CityWhereUniqueInputSchema),z.lazy(() => CityWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CityUpdateWithWhereUniqueWithoutCountyInputSchema),z.lazy(() => CityUpdateWithWhereUniqueWithoutCountyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CityUpdateManyWithWhereWithoutCountyInputSchema),z.lazy(() => CityUpdateManyWithWhereWithoutCountyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CityScalarWhereInputSchema),z.lazy(() => CityScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CityUncheckedUpdateManyWithoutCountyNestedInputSchema: z.ZodType<Prisma.CityUncheckedUpdateManyWithoutCountyNestedInput> = z.object({
  create: z.union([ z.lazy(() => CityCreateWithoutCountyInputSchema),z.lazy(() => CityCreateWithoutCountyInputSchema).array(),z.lazy(() => CityUncheckedCreateWithoutCountyInputSchema),z.lazy(() => CityUncheckedCreateWithoutCountyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CityCreateOrConnectWithoutCountyInputSchema),z.lazy(() => CityCreateOrConnectWithoutCountyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CityUpsertWithWhereUniqueWithoutCountyInputSchema),z.lazy(() => CityUpsertWithWhereUniqueWithoutCountyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CityCreateManyCountyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CityWhereUniqueInputSchema),z.lazy(() => CityWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CityWhereUniqueInputSchema),z.lazy(() => CityWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CityWhereUniqueInputSchema),z.lazy(() => CityWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CityWhereUniqueInputSchema),z.lazy(() => CityWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CityUpdateWithWhereUniqueWithoutCountyInputSchema),z.lazy(() => CityUpdateWithWhereUniqueWithoutCountyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CityUpdateManyWithWhereWithoutCountyInputSchema),z.lazy(() => CityUpdateManyWithWhereWithoutCountyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CityScalarWhereInputSchema),z.lazy(() => CityScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CountyCreateNestedOneWithoutCitiesInputSchema: z.ZodType<Prisma.CountyCreateNestedOneWithoutCitiesInput> = z.object({
  create: z.union([ z.lazy(() => CountyCreateWithoutCitiesInputSchema),z.lazy(() => CountyUncheckedCreateWithoutCitiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CountyCreateOrConnectWithoutCitiesInputSchema).optional(),
  connect: z.lazy(() => CountyWhereUniqueInputSchema).optional()
}).strict();

export const CountyUpdateOneRequiredWithoutCitiesNestedInputSchema: z.ZodType<Prisma.CountyUpdateOneRequiredWithoutCitiesNestedInput> = z.object({
  create: z.union([ z.lazy(() => CountyCreateWithoutCitiesInputSchema),z.lazy(() => CountyUncheckedCreateWithoutCitiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CountyCreateOrConnectWithoutCitiesInputSchema).optional(),
  upsert: z.lazy(() => CountyUpsertWithoutCitiesInputSchema).optional(),
  connect: z.lazy(() => CountyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CountyUpdateToOneWithWhereWithoutCitiesInputSchema),z.lazy(() => CountyUpdateWithoutCitiesInputSchema),z.lazy(() => CountyUncheckedUpdateWithoutCitiesInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumRoleFilterSchema: z.ZodType<Prisma.NestedEnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedEnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedEnumTokenTypeFilterSchema: z.ZodType<Prisma.NestedEnumTokenTypeFilter> = z.object({
  equals: z.lazy(() => TokenTypeSchema).optional(),
  in: z.lazy(() => TokenTypeSchema).array().optional(),
  notIn: z.lazy(() => TokenTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TokenTypeSchema),z.lazy(() => NestedEnumTokenTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumTokenTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumTokenTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TokenTypeSchema).optional(),
  in: z.lazy(() => TokenTypeSchema).array().optional(),
  notIn: z.lazy(() => TokenTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TokenTypeSchema),z.lazy(() => NestedEnumTokenTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTokenTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTokenTypeFilterSchema).optional()
}).strict();

export const NestedEnumStatusFilterSchema: z.ZodType<Prisma.NestedEnumStatusFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema),z.lazy(() => NestedEnumStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema),z.lazy(() => NestedEnumStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumStatusFilterSchema).optional()
}).strict();

export const NestedEnumEventTypeFilterSchema: z.ZodType<Prisma.NestedEnumEventTypeFilter> = z.object({
  equals: z.lazy(() => EventTypeSchema).optional(),
  in: z.lazy(() => EventTypeSchema).array().optional(),
  notIn: z.lazy(() => EventTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EventTypeSchema),z.lazy(() => NestedEnumEventTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumEventStatusFilterSchema: z.ZodType<Prisma.NestedEnumEventStatusFilter> = z.object({
  equals: z.lazy(() => EventStatusSchema).optional(),
  in: z.lazy(() => EventStatusSchema).array().optional(),
  notIn: z.lazy(() => EventStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => NestedEnumEventStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumEventTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumEventTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => EventTypeSchema).optional(),
  in: z.lazy(() => EventTypeSchema).array().optional(),
  notIn: z.lazy(() => EventTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EventTypeSchema),z.lazy(() => NestedEnumEventTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumEventTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumEventTypeFilterSchema).optional()
}).strict();

export const NestedEnumEventStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumEventStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => EventStatusSchema).optional(),
  in: z.lazy(() => EventStatusSchema).array().optional(),
  notIn: z.lazy(() => EventStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => NestedEnumEventStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumEventStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumEventStatusFilterSchema).optional()
}).strict();

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const UserCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  index: z.number().int().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  phone: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  banned: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileCreateNestedOneWithoutUserInputSchema).optional(),
  tokens: z.lazy(() => TokenCreateNestedManyWithoutUserInputSchema).optional(),
  patients: z.lazy(() => PatientCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  index: z.number().int().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  phone: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  banned: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  tokens: z.lazy(() => TokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  patients: z.lazy(() => PatientUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpsertWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutAccountsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  banned: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUpdateOneWithoutUserNestedInputSchema).optional(),
  tokens: z.lazy(() => TokenUpdateManyWithoutUserNestedInputSchema).optional(),
  patients: z.lazy(() => PatientUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  banned: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  tokens: z.lazy(() => TokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  patients: z.lazy(() => PatientUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ProfileCreateWithoutUserInputSchema: z.ZodType<Prisma.ProfileCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProfileUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ProfileUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProfileCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ProfileCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ProfileWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  provider: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.coerce.date().optional().nullable(),
  refresh_token_expires_in: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable()
}).strict();

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  provider: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.coerce.date().optional().nullable(),
  refresh_token_expires_in: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable()
}).strict();

export const AccountCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AccountCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AccountCreateManyUserInputSchema),z.lazy(() => AccountCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TokenCreateWithoutUserInputSchema: z.ZodType<Prisma.TokenCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => TokenTypeSchema),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const TokenUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.TokenUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => TokenTypeSchema),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const TokenCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.TokenCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => TokenWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TokenCreateWithoutUserInputSchema),z.lazy(() => TokenUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const TokenCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.TokenCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TokenCreateManyUserInputSchema),z.lazy(() => TokenCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PatientCreateWithoutUserInputSchema: z.ZodType<Prisma.PatientCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string().optional().nullable(),
  dob: z.coerce.date().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
  status: z.lazy(() => StatusSchema).optional(),
  smsNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  appointments: z.lazy(() => EventCreateNestedManyWithoutPatientInputSchema).optional()
}).strict();

export const PatientUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.PatientUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string().optional().nullable(),
  dob: z.coerce.date().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
  status: z.lazy(() => StatusSchema).optional(),
  smsNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  appointments: z.lazy(() => EventUncheckedCreateNestedManyWithoutPatientInputSchema).optional()
}).strict();

export const PatientCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.PatientCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => PatientWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PatientCreateWithoutUserInputSchema),z.lazy(() => PatientUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PatientCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.PatientCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PatientCreateManyUserInputSchema),z.lazy(() => PatientCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProfileUpsertWithoutUserInputSchema: z.ZodType<Prisma.ProfileUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => ProfileUpdateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => ProfileWhereInputSchema).optional()
}).strict();

export const ProfileUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ProfileUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ProfileWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProfileUpdateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ProfileUpdateWithoutUserInputSchema: z.ZodType<Prisma.ProfileUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProfileUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => AccountScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateManyMutationInputSchema),z.lazy(() => AccountUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const AccountScalarWhereInputSchema: z.ZodType<Prisma.AccountScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const TokenUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.TokenUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => TokenWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TokenUpdateWithoutUserInputSchema),z.lazy(() => TokenUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => TokenCreateWithoutUserInputSchema),z.lazy(() => TokenUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const TokenUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.TokenUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => TokenWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TokenUpdateWithoutUserInputSchema),z.lazy(() => TokenUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const TokenUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.TokenUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => TokenScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TokenUpdateManyMutationInputSchema),z.lazy(() => TokenUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const TokenScalarWhereInputSchema: z.ZodType<Prisma.TokenScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TokenScalarWhereInputSchema),z.lazy(() => TokenScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TokenScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TokenScalarWhereInputSchema),z.lazy(() => TokenScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumTokenTypeFilterSchema),z.lazy(() => TokenTypeSchema) ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const PatientUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.PatientUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => PatientWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PatientUpdateWithoutUserInputSchema),z.lazy(() => PatientUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => PatientCreateWithoutUserInputSchema),z.lazy(() => PatientUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PatientUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.PatientUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => PatientWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PatientUpdateWithoutUserInputSchema),z.lazy(() => PatientUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const PatientUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.PatientUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => PatientScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PatientUpdateManyMutationInputSchema),z.lazy(() => PatientUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const PatientScalarWhereInputSchema: z.ZodType<Prisma.PatientScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PatientScalarWhereInputSchema),z.lazy(() => PatientScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PatientScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PatientScalarWhereInputSchema),z.lazy(() => PatientScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  gender: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dob: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  county: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumStatusFilterSchema),z.lazy(() => StatusSchema) ]).optional(),
  smsNotifications: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  emailNotifications: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutProfileInputSchema: z.ZodType<Prisma.UserCreateWithoutProfileInput> = z.object({
  id: z.string().cuid().optional(),
  index: z.number().int().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  phone: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  banned: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  tokens: z.lazy(() => TokenCreateNestedManyWithoutUserInputSchema).optional(),
  patients: z.lazy(() => PatientCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutProfileInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutProfileInput> = z.object({
  id: z.string().cuid().optional(),
  index: z.number().int().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  phone: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  banned: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tokens: z.lazy(() => TokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  patients: z.lazy(() => PatientUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutProfileInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutProfileInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutProfileInputSchema),z.lazy(() => UserUncheckedCreateWithoutProfileInputSchema) ]),
}).strict();

export const UserUpsertWithoutProfileInputSchema: z.ZodType<Prisma.UserUpsertWithoutProfileInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutProfileInputSchema),z.lazy(() => UserUncheckedUpdateWithoutProfileInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutProfileInputSchema),z.lazy(() => UserUncheckedCreateWithoutProfileInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutProfileInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutProfileInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutProfileInputSchema),z.lazy(() => UserUncheckedUpdateWithoutProfileInputSchema) ]),
}).strict();

export const UserUpdateWithoutProfileInputSchema: z.ZodType<Prisma.UserUpdateWithoutProfileInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  banned: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  tokens: z.lazy(() => TokenUpdateManyWithoutUserNestedInputSchema).optional(),
  patients: z.lazy(() => PatientUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutProfileInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutProfileInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  banned: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tokens: z.lazy(() => TokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  patients: z.lazy(() => PatientUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutTokensInputSchema: z.ZodType<Prisma.UserCreateWithoutTokensInput> = z.object({
  id: z.string().cuid().optional(),
  index: z.number().int().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  phone: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  banned: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileCreateNestedOneWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  patients: z.lazy(() => PatientCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutTokensInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutTokensInput> = z.object({
  id: z.string().cuid().optional(),
  index: z.number().int().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  phone: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  banned: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  patients: z.lazy(() => PatientUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutTokensInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTokensInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutTokensInputSchema) ]),
}).strict();

export const UserUpsertWithoutTokensInputSchema: z.ZodType<Prisma.UserUpsertWithoutTokensInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutTokensInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTokensInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutTokensInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutTokensInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTokensInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutTokensInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTokensInputSchema) ]),
}).strict();

export const UserUpdateWithoutTokensInputSchema: z.ZodType<Prisma.UserUpdateWithoutTokensInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  banned: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUpdateOneWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  patients: z.lazy(() => PatientUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutTokensInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutTokensInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  banned: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  patients: z.lazy(() => PatientUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutPatientsInputSchema: z.ZodType<Prisma.UserCreateWithoutPatientsInput> = z.object({
  id: z.string().cuid().optional(),
  index: z.number().int().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  phone: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  banned: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileCreateNestedOneWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  tokens: z.lazy(() => TokenCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutPatientsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPatientsInput> = z.object({
  id: z.string().cuid().optional(),
  index: z.number().int().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  phone: z.string().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  banned: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tokens: z.lazy(() => TokenUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutPatientsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutPatientsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutPatientsInputSchema),z.lazy(() => UserUncheckedCreateWithoutPatientsInputSchema) ]),
}).strict();

export const EventCreateWithoutPatientInputSchema: z.ZodType<Prisma.EventCreateWithoutPatientInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  date: z.coerce.date(),
  start: z.coerce.date().optional().nullable(),
  end: z.coerce.date().optional().nullable(),
  allDay: z.boolean().optional(),
  type: z.lazy(() => EventTypeSchema).optional(),
  status: z.lazy(() => EventStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  proposedTimes: z.lazy(() => ProposedTimeCreateNestedManyWithoutEventInputSchema).optional(),
  products: z.lazy(() => ProductCreateNestedManyWithoutEventInputSchema).optional()
}).strict();

export const EventUncheckedCreateWithoutPatientInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutPatientInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  date: z.coerce.date(),
  start: z.coerce.date().optional().nullable(),
  end: z.coerce.date().optional().nullable(),
  allDay: z.boolean().optional(),
  type: z.lazy(() => EventTypeSchema).optional(),
  status: z.lazy(() => EventStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  proposedTimes: z.lazy(() => ProposedTimeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  products: z.lazy(() => ProductUncheckedCreateNestedManyWithoutEventInputSchema).optional()
}).strict();

export const EventCreateOrConnectWithoutPatientInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutPatientInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutPatientInputSchema),z.lazy(() => EventUncheckedCreateWithoutPatientInputSchema) ]),
}).strict();

export const EventCreateManyPatientInputEnvelopeSchema: z.ZodType<Prisma.EventCreateManyPatientInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => EventCreateManyPatientInputSchema),z.lazy(() => EventCreateManyPatientInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutPatientsInputSchema: z.ZodType<Prisma.UserUpsertWithoutPatientsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutPatientsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPatientsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutPatientsInputSchema),z.lazy(() => UserUncheckedCreateWithoutPatientsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutPatientsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPatientsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutPatientsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPatientsInputSchema) ]),
}).strict();

export const UserUpdateWithoutPatientsInputSchema: z.ZodType<Prisma.UserUpdateWithoutPatientsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  banned: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUpdateOneWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  tokens: z.lazy(() => TokenUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutPatientsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutPatientsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordHash: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  banned: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tokens: z.lazy(() => TokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const EventUpsertWithWhereUniqueWithoutPatientInputSchema: z.ZodType<Prisma.EventUpsertWithWhereUniqueWithoutPatientInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EventUpdateWithoutPatientInputSchema),z.lazy(() => EventUncheckedUpdateWithoutPatientInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutPatientInputSchema),z.lazy(() => EventUncheckedCreateWithoutPatientInputSchema) ]),
}).strict();

export const EventUpdateWithWhereUniqueWithoutPatientInputSchema: z.ZodType<Prisma.EventUpdateWithWhereUniqueWithoutPatientInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EventUpdateWithoutPatientInputSchema),z.lazy(() => EventUncheckedUpdateWithoutPatientInputSchema) ]),
}).strict();

export const EventUpdateManyWithWhereWithoutPatientInputSchema: z.ZodType<Prisma.EventUpdateManyWithWhereWithoutPatientInput> = z.object({
  where: z.lazy(() => EventScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EventUpdateManyMutationInputSchema),z.lazy(() => EventUncheckedUpdateManyWithoutPatientInputSchema) ]),
}).strict();

export const EventScalarWhereInputSchema: z.ZodType<Prisma.EventScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EventScalarWhereInputSchema),z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventScalarWhereInputSchema),z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  start: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  end: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  allDay: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  type: z.union([ z.lazy(() => EnumEventTypeFilterSchema),z.lazy(() => EventTypeSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumEventStatusFilterSchema),z.lazy(() => EventStatusSchema) ]).optional(),
  patientId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProposedTimeCreateWithoutEventInputSchema: z.ZodType<Prisma.ProposedTimeCreateWithoutEventInput> = z.object({
  id: z.string().cuid().optional(),
  date: z.coerce.date(),
  start: z.coerce.date().optional().nullable(),
  end: z.coerce.date().optional().nullable(),
  status: z.lazy(() => EventStatusSchema).optional(),
  notified: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProposedTimeUncheckedCreateWithoutEventInputSchema: z.ZodType<Prisma.ProposedTimeUncheckedCreateWithoutEventInput> = z.object({
  id: z.string().cuid().optional(),
  date: z.coerce.date(),
  start: z.coerce.date().optional().nullable(),
  end: z.coerce.date().optional().nullable(),
  status: z.lazy(() => EventStatusSchema).optional(),
  notified: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProposedTimeCreateOrConnectWithoutEventInputSchema: z.ZodType<Prisma.ProposedTimeCreateOrConnectWithoutEventInput> = z.object({
  where: z.lazy(() => ProposedTimeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProposedTimeCreateWithoutEventInputSchema),z.lazy(() => ProposedTimeUncheckedCreateWithoutEventInputSchema) ]),
}).strict();

export const ProposedTimeCreateManyEventInputEnvelopeSchema: z.ZodType<Prisma.ProposedTimeCreateManyEventInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProposedTimeCreateManyEventInputSchema),z.lazy(() => ProposedTimeCreateManyEventInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProductCreateWithoutEventInputSchema: z.ZodType<Prisma.ProductCreateWithoutEventInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  price: z.number(),
  priceMax: z.number().optional().nullable(),
  image: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => ProductCreatetagsInputSchema),z.string().array() ]).optional(),
  isDeleted: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductUncheckedCreateWithoutEventInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutEventInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  price: z.number(),
  priceMax: z.number().optional().nullable(),
  image: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => ProductCreatetagsInputSchema),z.string().array() ]).optional(),
  isDeleted: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductCreateOrConnectWithoutEventInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutEventInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutEventInputSchema),z.lazy(() => ProductUncheckedCreateWithoutEventInputSchema) ]),
}).strict();

export const ProductCreateManyEventInputEnvelopeSchema: z.ZodType<Prisma.ProductCreateManyEventInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProductCreateManyEventInputSchema),z.lazy(() => ProductCreateManyEventInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PatientCreateWithoutAppointmentsInputSchema: z.ZodType<Prisma.PatientCreateWithoutAppointmentsInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string().optional().nullable(),
  dob: z.coerce.date().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
  status: z.lazy(() => StatusSchema).optional(),
  smsNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutPatientsInputSchema)
}).strict();

export const PatientUncheckedCreateWithoutAppointmentsInputSchema: z.ZodType<Prisma.PatientUncheckedCreateWithoutAppointmentsInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string().optional().nullable(),
  dob: z.coerce.date().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
  status: z.lazy(() => StatusSchema).optional(),
  smsNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PatientCreateOrConnectWithoutAppointmentsInputSchema: z.ZodType<Prisma.PatientCreateOrConnectWithoutAppointmentsInput> = z.object({
  where: z.lazy(() => PatientWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PatientCreateWithoutAppointmentsInputSchema),z.lazy(() => PatientUncheckedCreateWithoutAppointmentsInputSchema) ]),
}).strict();

export const ProposedTimeUpsertWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.ProposedTimeUpsertWithWhereUniqueWithoutEventInput> = z.object({
  where: z.lazy(() => ProposedTimeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProposedTimeUpdateWithoutEventInputSchema),z.lazy(() => ProposedTimeUncheckedUpdateWithoutEventInputSchema) ]),
  create: z.union([ z.lazy(() => ProposedTimeCreateWithoutEventInputSchema),z.lazy(() => ProposedTimeUncheckedCreateWithoutEventInputSchema) ]),
}).strict();

export const ProposedTimeUpdateWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.ProposedTimeUpdateWithWhereUniqueWithoutEventInput> = z.object({
  where: z.lazy(() => ProposedTimeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProposedTimeUpdateWithoutEventInputSchema),z.lazy(() => ProposedTimeUncheckedUpdateWithoutEventInputSchema) ]),
}).strict();

export const ProposedTimeUpdateManyWithWhereWithoutEventInputSchema: z.ZodType<Prisma.ProposedTimeUpdateManyWithWhereWithoutEventInput> = z.object({
  where: z.lazy(() => ProposedTimeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProposedTimeUpdateManyMutationInputSchema),z.lazy(() => ProposedTimeUncheckedUpdateManyWithoutEventInputSchema) ]),
}).strict();

export const ProposedTimeScalarWhereInputSchema: z.ZodType<Prisma.ProposedTimeScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProposedTimeScalarWhereInputSchema),z.lazy(() => ProposedTimeScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProposedTimeScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProposedTimeScalarWhereInputSchema),z.lazy(() => ProposedTimeScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  start: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  end: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumEventStatusFilterSchema),z.lazy(() => EventStatusSchema) ]).optional(),
  notified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProductUpsertWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutEventInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductUpdateWithoutEventInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutEventInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutEventInputSchema),z.lazy(() => ProductUncheckedCreateWithoutEventInputSchema) ]),
}).strict();

export const ProductUpdateWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutEventInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateWithoutEventInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutEventInputSchema) ]),
}).strict();

export const ProductUpdateManyWithWhereWithoutEventInputSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutEventInput> = z.object({
  where: z.lazy(() => ProductScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateManyMutationInputSchema),z.lazy(() => ProductUncheckedUpdateManyWithoutEventInputSchema) ]),
}).strict();

export const ProductScalarWhereInputSchema: z.ZodType<Prisma.ProductScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  priceMax: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  isDeleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PatientUpsertWithoutAppointmentsInputSchema: z.ZodType<Prisma.PatientUpsertWithoutAppointmentsInput> = z.object({
  update: z.union([ z.lazy(() => PatientUpdateWithoutAppointmentsInputSchema),z.lazy(() => PatientUncheckedUpdateWithoutAppointmentsInputSchema) ]),
  create: z.union([ z.lazy(() => PatientCreateWithoutAppointmentsInputSchema),z.lazy(() => PatientUncheckedCreateWithoutAppointmentsInputSchema) ]),
  where: z.lazy(() => PatientWhereInputSchema).optional()
}).strict();

export const PatientUpdateToOneWithWhereWithoutAppointmentsInputSchema: z.ZodType<Prisma.PatientUpdateToOneWithWhereWithoutAppointmentsInput> = z.object({
  where: z.lazy(() => PatientWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PatientUpdateWithoutAppointmentsInputSchema),z.lazy(() => PatientUncheckedUpdateWithoutAppointmentsInputSchema) ]),
}).strict();

export const PatientUpdateWithoutAppointmentsInputSchema: z.ZodType<Prisma.PatientUpdateWithoutAppointmentsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  county: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  smsNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  emailNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPatientsNestedInputSchema).optional()
}).strict();

export const PatientUncheckedUpdateWithoutAppointmentsInputSchema: z.ZodType<Prisma.PatientUncheckedUpdateWithoutAppointmentsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  county: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  smsNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  emailNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EventCreateWithoutProposedTimesInputSchema: z.ZodType<Prisma.EventCreateWithoutProposedTimesInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  date: z.coerce.date(),
  start: z.coerce.date().optional().nullable(),
  end: z.coerce.date().optional().nullable(),
  allDay: z.boolean().optional(),
  type: z.lazy(() => EventTypeSchema).optional(),
  status: z.lazy(() => EventStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  products: z.lazy(() => ProductCreateNestedManyWithoutEventInputSchema).optional(),
  patient: z.lazy(() => PatientCreateNestedOneWithoutAppointmentsInputSchema).optional()
}).strict();

export const EventUncheckedCreateWithoutProposedTimesInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutProposedTimesInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  date: z.coerce.date(),
  start: z.coerce.date().optional().nullable(),
  end: z.coerce.date().optional().nullable(),
  allDay: z.boolean().optional(),
  type: z.lazy(() => EventTypeSchema).optional(),
  status: z.lazy(() => EventStatusSchema).optional(),
  patientId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  products: z.lazy(() => ProductUncheckedCreateNestedManyWithoutEventInputSchema).optional()
}).strict();

export const EventCreateOrConnectWithoutProposedTimesInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutProposedTimesInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutProposedTimesInputSchema),z.lazy(() => EventUncheckedCreateWithoutProposedTimesInputSchema) ]),
}).strict();

export const EventUpsertWithoutProposedTimesInputSchema: z.ZodType<Prisma.EventUpsertWithoutProposedTimesInput> = z.object({
  update: z.union([ z.lazy(() => EventUpdateWithoutProposedTimesInputSchema),z.lazy(() => EventUncheckedUpdateWithoutProposedTimesInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutProposedTimesInputSchema),z.lazy(() => EventUncheckedCreateWithoutProposedTimesInputSchema) ]),
  where: z.lazy(() => EventWhereInputSchema).optional()
}).strict();

export const EventUpdateToOneWithWhereWithoutProposedTimesInputSchema: z.ZodType<Prisma.EventUpdateToOneWithWhereWithoutProposedTimesInput> = z.object({
  where: z.lazy(() => EventWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EventUpdateWithoutProposedTimesInputSchema),z.lazy(() => EventUncheckedUpdateWithoutProposedTimesInputSchema) ]),
}).strict();

export const EventUpdateWithoutProposedTimesInputSchema: z.ZodType<Prisma.EventUpdateWithoutProposedTimesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => EventTypeSchema),z.lazy(() => EnumEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductUpdateManyWithoutEventNestedInputSchema).optional(),
  patient: z.lazy(() => PatientUpdateOneWithoutAppointmentsNestedInputSchema).optional()
}).strict();

export const EventUncheckedUpdateWithoutProposedTimesInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutProposedTimesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => EventTypeSchema),z.lazy(() => EnumEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  patientId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductUncheckedUpdateManyWithoutEventNestedInputSchema).optional()
}).strict();

export const EventCreateWithoutProductsInputSchema: z.ZodType<Prisma.EventCreateWithoutProductsInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  date: z.coerce.date(),
  start: z.coerce.date().optional().nullable(),
  end: z.coerce.date().optional().nullable(),
  allDay: z.boolean().optional(),
  type: z.lazy(() => EventTypeSchema).optional(),
  status: z.lazy(() => EventStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  proposedTimes: z.lazy(() => ProposedTimeCreateNestedManyWithoutEventInputSchema).optional(),
  patient: z.lazy(() => PatientCreateNestedOneWithoutAppointmentsInputSchema).optional()
}).strict();

export const EventUncheckedCreateWithoutProductsInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutProductsInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  date: z.coerce.date(),
  start: z.coerce.date().optional().nullable(),
  end: z.coerce.date().optional().nullable(),
  allDay: z.boolean().optional(),
  type: z.lazy(() => EventTypeSchema).optional(),
  status: z.lazy(() => EventStatusSchema).optional(),
  patientId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  proposedTimes: z.lazy(() => ProposedTimeUncheckedCreateNestedManyWithoutEventInputSchema).optional()
}).strict();

export const EventCreateOrConnectWithoutProductsInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutProductsInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutProductsInputSchema),z.lazy(() => EventUncheckedCreateWithoutProductsInputSchema) ]),
}).strict();

export const EventUpsertWithoutProductsInputSchema: z.ZodType<Prisma.EventUpsertWithoutProductsInput> = z.object({
  update: z.union([ z.lazy(() => EventUpdateWithoutProductsInputSchema),z.lazy(() => EventUncheckedUpdateWithoutProductsInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutProductsInputSchema),z.lazy(() => EventUncheckedCreateWithoutProductsInputSchema) ]),
  where: z.lazy(() => EventWhereInputSchema).optional()
}).strict();

export const EventUpdateToOneWithWhereWithoutProductsInputSchema: z.ZodType<Prisma.EventUpdateToOneWithWhereWithoutProductsInput> = z.object({
  where: z.lazy(() => EventWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EventUpdateWithoutProductsInputSchema),z.lazy(() => EventUncheckedUpdateWithoutProductsInputSchema) ]),
}).strict();

export const EventUpdateWithoutProductsInputSchema: z.ZodType<Prisma.EventUpdateWithoutProductsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => EventTypeSchema),z.lazy(() => EnumEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  proposedTimes: z.lazy(() => ProposedTimeUpdateManyWithoutEventNestedInputSchema).optional(),
  patient: z.lazy(() => PatientUpdateOneWithoutAppointmentsNestedInputSchema).optional()
}).strict();

export const EventUncheckedUpdateWithoutProductsInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutProductsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => EventTypeSchema),z.lazy(() => EnumEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  patientId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  proposedTimes: z.lazy(() => ProposedTimeUncheckedUpdateManyWithoutEventNestedInputSchema).optional()
}).strict();

export const CityCreateWithoutCountyInputSchema: z.ZodType<Prisma.CityCreateWithoutCountyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CityUncheckedCreateWithoutCountyInputSchema: z.ZodType<Prisma.CityUncheckedCreateWithoutCountyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CityCreateOrConnectWithoutCountyInputSchema: z.ZodType<Prisma.CityCreateOrConnectWithoutCountyInput> = z.object({
  where: z.lazy(() => CityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CityCreateWithoutCountyInputSchema),z.lazy(() => CityUncheckedCreateWithoutCountyInputSchema) ]),
}).strict();

export const CityCreateManyCountyInputEnvelopeSchema: z.ZodType<Prisma.CityCreateManyCountyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CityCreateManyCountyInputSchema),z.lazy(() => CityCreateManyCountyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CityUpsertWithWhereUniqueWithoutCountyInputSchema: z.ZodType<Prisma.CityUpsertWithWhereUniqueWithoutCountyInput> = z.object({
  where: z.lazy(() => CityWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CityUpdateWithoutCountyInputSchema),z.lazy(() => CityUncheckedUpdateWithoutCountyInputSchema) ]),
  create: z.union([ z.lazy(() => CityCreateWithoutCountyInputSchema),z.lazy(() => CityUncheckedCreateWithoutCountyInputSchema) ]),
}).strict();

export const CityUpdateWithWhereUniqueWithoutCountyInputSchema: z.ZodType<Prisma.CityUpdateWithWhereUniqueWithoutCountyInput> = z.object({
  where: z.lazy(() => CityWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CityUpdateWithoutCountyInputSchema),z.lazy(() => CityUncheckedUpdateWithoutCountyInputSchema) ]),
}).strict();

export const CityUpdateManyWithWhereWithoutCountyInputSchema: z.ZodType<Prisma.CityUpdateManyWithWhereWithoutCountyInput> = z.object({
  where: z.lazy(() => CityScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CityUpdateManyMutationInputSchema),z.lazy(() => CityUncheckedUpdateManyWithoutCountyInputSchema) ]),
}).strict();

export const CityScalarWhereInputSchema: z.ZodType<Prisma.CityScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CityScalarWhereInputSchema),z.lazy(() => CityScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CityScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CityScalarWhereInputSchema),z.lazy(() => CityScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  countyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CountyCreateWithoutCitiesInputSchema: z.ZodType<Prisma.CountyCreateWithoutCitiesInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  code: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CountyUncheckedCreateWithoutCitiesInputSchema: z.ZodType<Prisma.CountyUncheckedCreateWithoutCitiesInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  code: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CountyCreateOrConnectWithoutCitiesInputSchema: z.ZodType<Prisma.CountyCreateOrConnectWithoutCitiesInput> = z.object({
  where: z.lazy(() => CountyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CountyCreateWithoutCitiesInputSchema),z.lazy(() => CountyUncheckedCreateWithoutCitiesInputSchema) ]),
}).strict();

export const CountyUpsertWithoutCitiesInputSchema: z.ZodType<Prisma.CountyUpsertWithoutCitiesInput> = z.object({
  update: z.union([ z.lazy(() => CountyUpdateWithoutCitiesInputSchema),z.lazy(() => CountyUncheckedUpdateWithoutCitiesInputSchema) ]),
  create: z.union([ z.lazy(() => CountyCreateWithoutCitiesInputSchema),z.lazy(() => CountyUncheckedCreateWithoutCitiesInputSchema) ]),
  where: z.lazy(() => CountyWhereInputSchema).optional()
}).strict();

export const CountyUpdateToOneWithWhereWithoutCitiesInputSchema: z.ZodType<Prisma.CountyUpdateToOneWithWhereWithoutCitiesInput> = z.object({
  where: z.lazy(() => CountyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CountyUpdateWithoutCitiesInputSchema),z.lazy(() => CountyUncheckedUpdateWithoutCitiesInputSchema) ]),
}).strict();

export const CountyUpdateWithoutCitiesInputSchema: z.ZodType<Prisma.CountyUpdateWithoutCitiesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CountyUncheckedUpdateWithoutCitiesInputSchema: z.ZodType<Prisma.CountyUncheckedUpdateWithoutCitiesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateManyUserInputSchema: z.ZodType<Prisma.AccountCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  provider: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.coerce.date().optional().nullable(),
  refresh_token_expires_in: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable()
}).strict();

export const TokenCreateManyUserInputSchema: z.ZodType<Prisma.TokenCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => TokenTypeSchema),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const PatientCreateManyUserInputSchema: z.ZodType<Prisma.PatientCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string().optional().nullable(),
  dob: z.coerce.date().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
  status: z.lazy(() => StatusSchema).optional(),
  smsNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TokenUpdateWithoutUserInputSchema: z.ZodType<Prisma.TokenUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TokenTypeSchema),z.lazy(() => EnumTokenTypeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TokenUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.TokenUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TokenTypeSchema),z.lazy(() => EnumTokenTypeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TokenUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.TokenUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TokenTypeSchema),z.lazy(() => EnumTokenTypeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PatientUpdateWithoutUserInputSchema: z.ZodType<Prisma.PatientUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  county: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  smsNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  emailNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  appointments: z.lazy(() => EventUpdateManyWithoutPatientNestedInputSchema).optional()
}).strict();

export const PatientUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.PatientUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  county: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  smsNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  emailNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  appointments: z.lazy(() => EventUncheckedUpdateManyWithoutPatientNestedInputSchema).optional()
}).strict();

export const PatientUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.PatientUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  county: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  smsNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  emailNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EventCreateManyPatientInputSchema: z.ZodType<Prisma.EventCreateManyPatientInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  date: z.coerce.date(),
  start: z.coerce.date().optional().nullable(),
  end: z.coerce.date().optional().nullable(),
  allDay: z.boolean().optional(),
  type: z.lazy(() => EventTypeSchema).optional(),
  status: z.lazy(() => EventStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const EventUpdateWithoutPatientInputSchema: z.ZodType<Prisma.EventUpdateWithoutPatientInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => EventTypeSchema),z.lazy(() => EnumEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  proposedTimes: z.lazy(() => ProposedTimeUpdateManyWithoutEventNestedInputSchema).optional(),
  products: z.lazy(() => ProductUpdateManyWithoutEventNestedInputSchema).optional()
}).strict();

export const EventUncheckedUpdateWithoutPatientInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutPatientInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => EventTypeSchema),z.lazy(() => EnumEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  proposedTimes: z.lazy(() => ProposedTimeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  products: z.lazy(() => ProductUncheckedUpdateManyWithoutEventNestedInputSchema).optional()
}).strict();

export const EventUncheckedUpdateManyWithoutPatientInputSchema: z.ZodType<Prisma.EventUncheckedUpdateManyWithoutPatientInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => EventTypeSchema),z.lazy(() => EnumEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProposedTimeCreateManyEventInputSchema: z.ZodType<Prisma.ProposedTimeCreateManyEventInput> = z.object({
  id: z.string().cuid().optional(),
  date: z.coerce.date(),
  start: z.coerce.date().optional().nullable(),
  end: z.coerce.date().optional().nullable(),
  status: z.lazy(() => EventStatusSchema).optional(),
  notified: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductCreateManyEventInputSchema: z.ZodType<Prisma.ProductCreateManyEventInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  price: z.number(),
  priceMax: z.number().optional().nullable(),
  image: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => ProductCreatetagsInputSchema),z.string().array() ]).optional(),
  isDeleted: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProposedTimeUpdateWithoutEventInputSchema: z.ZodType<Prisma.ProposedTimeUpdateWithoutEventInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProposedTimeUncheckedUpdateWithoutEventInputSchema: z.ZodType<Prisma.ProposedTimeUncheckedUpdateWithoutEventInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProposedTimeUncheckedUpdateManyWithoutEventInputSchema: z.ZodType<Prisma.ProposedTimeUncheckedUpdateManyWithoutEventInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  start: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => EventStatusSchema),z.lazy(() => EnumEventStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductUpdateWithoutEventInputSchema: z.ZodType<Prisma.ProductUpdateWithoutEventInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  priceMax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => ProductUpdatetagsInputSchema),z.string().array() ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductUncheckedUpdateWithoutEventInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutEventInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  priceMax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => ProductUpdatetagsInputSchema),z.string().array() ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductUncheckedUpdateManyWithoutEventInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutEventInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  priceMax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => ProductUpdatetagsInputSchema),z.string().array() ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CityCreateManyCountyInputSchema: z.ZodType<Prisma.CityCreateManyCountyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CityUpdateWithoutCountyInputSchema: z.ZodType<Prisma.CityUpdateWithoutCountyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CityUncheckedUpdateWithoutCountyInputSchema: z.ZodType<Prisma.CityUncheckedUpdateWithoutCountyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CityUncheckedUpdateManyWithoutCountyInputSchema: z.ZodType<Prisma.CityUncheckedUpdateManyWithoutCountyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithAggregationInputSchema.array(),AccountOrderByWithAggregationInputSchema ]).optional(),
  by: AccountScalarFieldEnumSchema.array(),
  having: AccountScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const ProfileFindFirstArgsSchema: z.ZodType<Prisma.ProfileFindFirstArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereInputSchema.optional(),
  orderBy: z.union([ ProfileOrderByWithRelationInputSchema.array(),ProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: ProfileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProfileScalarFieldEnumSchema,ProfileScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProfileFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProfileFindFirstOrThrowArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereInputSchema.optional(),
  orderBy: z.union([ ProfileOrderByWithRelationInputSchema.array(),ProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: ProfileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProfileScalarFieldEnumSchema,ProfileScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProfileFindManyArgsSchema: z.ZodType<Prisma.ProfileFindManyArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereInputSchema.optional(),
  orderBy: z.union([ ProfileOrderByWithRelationInputSchema.array(),ProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: ProfileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProfileScalarFieldEnumSchema,ProfileScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProfileAggregateArgsSchema: z.ZodType<Prisma.ProfileAggregateArgs> = z.object({
  where: ProfileWhereInputSchema.optional(),
  orderBy: z.union([ ProfileOrderByWithRelationInputSchema.array(),ProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: ProfileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProfileGroupByArgsSchema: z.ZodType<Prisma.ProfileGroupByArgs> = z.object({
  where: ProfileWhereInputSchema.optional(),
  orderBy: z.union([ ProfileOrderByWithAggregationInputSchema.array(),ProfileOrderByWithAggregationInputSchema ]).optional(),
  by: ProfileScalarFieldEnumSchema.array(),
  having: ProfileScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProfileFindUniqueArgsSchema: z.ZodType<Prisma.ProfileFindUniqueArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereUniqueInputSchema,
}).strict() ;

export const ProfileFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProfileFindUniqueOrThrowArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereUniqueInputSchema,
}).strict() ;

export const TokenFindFirstArgsSchema: z.ZodType<Prisma.TokenFindFirstArgs> = z.object({
  select: TokenSelectSchema.optional(),
  include: TokenIncludeSchema.optional(),
  where: TokenWhereInputSchema.optional(),
  orderBy: z.union([ TokenOrderByWithRelationInputSchema.array(),TokenOrderByWithRelationInputSchema ]).optional(),
  cursor: TokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TokenScalarFieldEnumSchema,TokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TokenFindFirstOrThrowArgs> = z.object({
  select: TokenSelectSchema.optional(),
  include: TokenIncludeSchema.optional(),
  where: TokenWhereInputSchema.optional(),
  orderBy: z.union([ TokenOrderByWithRelationInputSchema.array(),TokenOrderByWithRelationInputSchema ]).optional(),
  cursor: TokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TokenScalarFieldEnumSchema,TokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TokenFindManyArgsSchema: z.ZodType<Prisma.TokenFindManyArgs> = z.object({
  select: TokenSelectSchema.optional(),
  include: TokenIncludeSchema.optional(),
  where: TokenWhereInputSchema.optional(),
  orderBy: z.union([ TokenOrderByWithRelationInputSchema.array(),TokenOrderByWithRelationInputSchema ]).optional(),
  cursor: TokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TokenScalarFieldEnumSchema,TokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TokenAggregateArgsSchema: z.ZodType<Prisma.TokenAggregateArgs> = z.object({
  where: TokenWhereInputSchema.optional(),
  orderBy: z.union([ TokenOrderByWithRelationInputSchema.array(),TokenOrderByWithRelationInputSchema ]).optional(),
  cursor: TokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TokenGroupByArgsSchema: z.ZodType<Prisma.TokenGroupByArgs> = z.object({
  where: TokenWhereInputSchema.optional(),
  orderBy: z.union([ TokenOrderByWithAggregationInputSchema.array(),TokenOrderByWithAggregationInputSchema ]).optional(),
  by: TokenScalarFieldEnumSchema.array(),
  having: TokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TokenFindUniqueArgsSchema: z.ZodType<Prisma.TokenFindUniqueArgs> = z.object({
  select: TokenSelectSchema.optional(),
  include: TokenIncludeSchema.optional(),
  where: TokenWhereUniqueInputSchema,
}).strict() ;

export const TokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TokenFindUniqueOrThrowArgs> = z.object({
  select: TokenSelectSchema.optional(),
  include: TokenIncludeSchema.optional(),
  where: TokenWhereUniqueInputSchema,
}).strict() ;

export const PatientFindFirstArgsSchema: z.ZodType<Prisma.PatientFindFirstArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  where: PatientWhereInputSchema.optional(),
  orderBy: z.union([ PatientOrderByWithRelationInputSchema.array(),PatientOrderByWithRelationInputSchema ]).optional(),
  cursor: PatientWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PatientScalarFieldEnumSchema,PatientScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PatientFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PatientFindFirstOrThrowArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  where: PatientWhereInputSchema.optional(),
  orderBy: z.union([ PatientOrderByWithRelationInputSchema.array(),PatientOrderByWithRelationInputSchema ]).optional(),
  cursor: PatientWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PatientScalarFieldEnumSchema,PatientScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PatientFindManyArgsSchema: z.ZodType<Prisma.PatientFindManyArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  where: PatientWhereInputSchema.optional(),
  orderBy: z.union([ PatientOrderByWithRelationInputSchema.array(),PatientOrderByWithRelationInputSchema ]).optional(),
  cursor: PatientWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PatientScalarFieldEnumSchema,PatientScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PatientAggregateArgsSchema: z.ZodType<Prisma.PatientAggregateArgs> = z.object({
  where: PatientWhereInputSchema.optional(),
  orderBy: z.union([ PatientOrderByWithRelationInputSchema.array(),PatientOrderByWithRelationInputSchema ]).optional(),
  cursor: PatientWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PatientGroupByArgsSchema: z.ZodType<Prisma.PatientGroupByArgs> = z.object({
  where: PatientWhereInputSchema.optional(),
  orderBy: z.union([ PatientOrderByWithAggregationInputSchema.array(),PatientOrderByWithAggregationInputSchema ]).optional(),
  by: PatientScalarFieldEnumSchema.array(),
  having: PatientScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PatientFindUniqueArgsSchema: z.ZodType<Prisma.PatientFindUniqueArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  where: PatientWhereUniqueInputSchema,
}).strict() ;

export const PatientFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PatientFindUniqueOrThrowArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  where: PatientWhereUniqueInputSchema,
}).strict() ;

export const EventFindFirstArgsSchema: z.ZodType<Prisma.EventFindFirstArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereInputSchema.optional(),
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(),EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EventScalarFieldEnumSchema,EventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EventFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EventFindFirstOrThrowArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereInputSchema.optional(),
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(),EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EventScalarFieldEnumSchema,EventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EventFindManyArgsSchema: z.ZodType<Prisma.EventFindManyArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereInputSchema.optional(),
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(),EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EventScalarFieldEnumSchema,EventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EventAggregateArgsSchema: z.ZodType<Prisma.EventAggregateArgs> = z.object({
  where: EventWhereInputSchema.optional(),
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(),EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EventGroupByArgsSchema: z.ZodType<Prisma.EventGroupByArgs> = z.object({
  where: EventWhereInputSchema.optional(),
  orderBy: z.union([ EventOrderByWithAggregationInputSchema.array(),EventOrderByWithAggregationInputSchema ]).optional(),
  by: EventScalarFieldEnumSchema.array(),
  having: EventScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EventFindUniqueArgsSchema: z.ZodType<Prisma.EventFindUniqueArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereUniqueInputSchema,
}).strict() ;

export const EventFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EventFindUniqueOrThrowArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereUniqueInputSchema,
}).strict() ;

export const ProposedTimeFindFirstArgsSchema: z.ZodType<Prisma.ProposedTimeFindFirstArgs> = z.object({
  select: ProposedTimeSelectSchema.optional(),
  include: ProposedTimeIncludeSchema.optional(),
  where: ProposedTimeWhereInputSchema.optional(),
  orderBy: z.union([ ProposedTimeOrderByWithRelationInputSchema.array(),ProposedTimeOrderByWithRelationInputSchema ]).optional(),
  cursor: ProposedTimeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProposedTimeScalarFieldEnumSchema,ProposedTimeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProposedTimeFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProposedTimeFindFirstOrThrowArgs> = z.object({
  select: ProposedTimeSelectSchema.optional(),
  include: ProposedTimeIncludeSchema.optional(),
  where: ProposedTimeWhereInputSchema.optional(),
  orderBy: z.union([ ProposedTimeOrderByWithRelationInputSchema.array(),ProposedTimeOrderByWithRelationInputSchema ]).optional(),
  cursor: ProposedTimeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProposedTimeScalarFieldEnumSchema,ProposedTimeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProposedTimeFindManyArgsSchema: z.ZodType<Prisma.ProposedTimeFindManyArgs> = z.object({
  select: ProposedTimeSelectSchema.optional(),
  include: ProposedTimeIncludeSchema.optional(),
  where: ProposedTimeWhereInputSchema.optional(),
  orderBy: z.union([ ProposedTimeOrderByWithRelationInputSchema.array(),ProposedTimeOrderByWithRelationInputSchema ]).optional(),
  cursor: ProposedTimeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProposedTimeScalarFieldEnumSchema,ProposedTimeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProposedTimeAggregateArgsSchema: z.ZodType<Prisma.ProposedTimeAggregateArgs> = z.object({
  where: ProposedTimeWhereInputSchema.optional(),
  orderBy: z.union([ ProposedTimeOrderByWithRelationInputSchema.array(),ProposedTimeOrderByWithRelationInputSchema ]).optional(),
  cursor: ProposedTimeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProposedTimeGroupByArgsSchema: z.ZodType<Prisma.ProposedTimeGroupByArgs> = z.object({
  where: ProposedTimeWhereInputSchema.optional(),
  orderBy: z.union([ ProposedTimeOrderByWithAggregationInputSchema.array(),ProposedTimeOrderByWithAggregationInputSchema ]).optional(),
  by: ProposedTimeScalarFieldEnumSchema.array(),
  having: ProposedTimeScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProposedTimeFindUniqueArgsSchema: z.ZodType<Prisma.ProposedTimeFindUniqueArgs> = z.object({
  select: ProposedTimeSelectSchema.optional(),
  include: ProposedTimeIncludeSchema.optional(),
  where: ProposedTimeWhereUniqueInputSchema,
}).strict() ;

export const ProposedTimeFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProposedTimeFindUniqueOrThrowArgs> = z.object({
  select: ProposedTimeSelectSchema.optional(),
  include: ProposedTimeIncludeSchema.optional(),
  where: ProposedTimeWhereUniqueInputSchema,
}).strict() ;

export const ProductFindFirstArgsSchema: z.ZodType<Prisma.ProductFindFirstArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema,ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProductFindFirstOrThrowArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema,ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductFindManyArgsSchema: z.ZodType<Prisma.ProductFindManyArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema,ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductAggregateArgsSchema: z.ZodType<Prisma.ProductAggregateArgs> = z.object({
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProductGroupByArgsSchema: z.ZodType<Prisma.ProductGroupByArgs> = z.object({
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithAggregationInputSchema.array(),ProductOrderByWithAggregationInputSchema ]).optional(),
  by: ProductScalarFieldEnumSchema.array(),
  having: ProductScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProductFindUniqueArgsSchema: z.ZodType<Prisma.ProductFindUniqueArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
}).strict() ;

export const ProductFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProductFindUniqueOrThrowArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
}).strict() ;

export const CountyFindFirstArgsSchema: z.ZodType<Prisma.CountyFindFirstArgs> = z.object({
  select: CountySelectSchema.optional(),
  include: CountyIncludeSchema.optional(),
  where: CountyWhereInputSchema.optional(),
  orderBy: z.union([ CountyOrderByWithRelationInputSchema.array(),CountyOrderByWithRelationInputSchema ]).optional(),
  cursor: CountyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CountyScalarFieldEnumSchema,CountyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CountyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CountyFindFirstOrThrowArgs> = z.object({
  select: CountySelectSchema.optional(),
  include: CountyIncludeSchema.optional(),
  where: CountyWhereInputSchema.optional(),
  orderBy: z.union([ CountyOrderByWithRelationInputSchema.array(),CountyOrderByWithRelationInputSchema ]).optional(),
  cursor: CountyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CountyScalarFieldEnumSchema,CountyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CountyFindManyArgsSchema: z.ZodType<Prisma.CountyFindManyArgs> = z.object({
  select: CountySelectSchema.optional(),
  include: CountyIncludeSchema.optional(),
  where: CountyWhereInputSchema.optional(),
  orderBy: z.union([ CountyOrderByWithRelationInputSchema.array(),CountyOrderByWithRelationInputSchema ]).optional(),
  cursor: CountyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CountyScalarFieldEnumSchema,CountyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CountyAggregateArgsSchema: z.ZodType<Prisma.CountyAggregateArgs> = z.object({
  where: CountyWhereInputSchema.optional(),
  orderBy: z.union([ CountyOrderByWithRelationInputSchema.array(),CountyOrderByWithRelationInputSchema ]).optional(),
  cursor: CountyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CountyGroupByArgsSchema: z.ZodType<Prisma.CountyGroupByArgs> = z.object({
  where: CountyWhereInputSchema.optional(),
  orderBy: z.union([ CountyOrderByWithAggregationInputSchema.array(),CountyOrderByWithAggregationInputSchema ]).optional(),
  by: CountyScalarFieldEnumSchema.array(),
  having: CountyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CountyFindUniqueArgsSchema: z.ZodType<Prisma.CountyFindUniqueArgs> = z.object({
  select: CountySelectSchema.optional(),
  include: CountyIncludeSchema.optional(),
  where: CountyWhereUniqueInputSchema,
}).strict() ;

export const CountyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CountyFindUniqueOrThrowArgs> = z.object({
  select: CountySelectSchema.optional(),
  include: CountyIncludeSchema.optional(),
  where: CountyWhereUniqueInputSchema,
}).strict() ;

export const CityFindFirstArgsSchema: z.ZodType<Prisma.CityFindFirstArgs> = z.object({
  select: CitySelectSchema.optional(),
  include: CityIncludeSchema.optional(),
  where: CityWhereInputSchema.optional(),
  orderBy: z.union([ CityOrderByWithRelationInputSchema.array(),CityOrderByWithRelationInputSchema ]).optional(),
  cursor: CityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CityScalarFieldEnumSchema,CityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CityFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CityFindFirstOrThrowArgs> = z.object({
  select: CitySelectSchema.optional(),
  include: CityIncludeSchema.optional(),
  where: CityWhereInputSchema.optional(),
  orderBy: z.union([ CityOrderByWithRelationInputSchema.array(),CityOrderByWithRelationInputSchema ]).optional(),
  cursor: CityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CityScalarFieldEnumSchema,CityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CityFindManyArgsSchema: z.ZodType<Prisma.CityFindManyArgs> = z.object({
  select: CitySelectSchema.optional(),
  include: CityIncludeSchema.optional(),
  where: CityWhereInputSchema.optional(),
  orderBy: z.union([ CityOrderByWithRelationInputSchema.array(),CityOrderByWithRelationInputSchema ]).optional(),
  cursor: CityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CityScalarFieldEnumSchema,CityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CityAggregateArgsSchema: z.ZodType<Prisma.CityAggregateArgs> = z.object({
  where: CityWhereInputSchema.optional(),
  orderBy: z.union([ CityOrderByWithRelationInputSchema.array(),CityOrderByWithRelationInputSchema ]).optional(),
  cursor: CityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CityGroupByArgsSchema: z.ZodType<Prisma.CityGroupByArgs> = z.object({
  where: CityWhereInputSchema.optional(),
  orderBy: z.union([ CityOrderByWithAggregationInputSchema.array(),CityOrderByWithAggregationInputSchema ]).optional(),
  by: CityScalarFieldEnumSchema.array(),
  having: CityScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CityFindUniqueArgsSchema: z.ZodType<Prisma.CityFindUniqueArgs> = z.object({
  select: CitySelectSchema.optional(),
  include: CityIncludeSchema.optional(),
  where: CityWhereUniqueInputSchema,
}).strict() ;

export const CityFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CityFindUniqueOrThrowArgs> = z.object({
  select: CitySelectSchema.optional(),
  include: CityIncludeSchema.optional(),
  where: CityWhereUniqueInputSchema,
}).strict() ;

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
}).strict() ;

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
  create: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
  update: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
}).strict() ;

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccountCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountCreateManyAndReturnArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema,AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(),
}).strict() ;

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const ProfileCreateArgsSchema: z.ZodType<Prisma.ProfileCreateArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  data: z.union([ ProfileCreateInputSchema,ProfileUncheckedCreateInputSchema ]),
}).strict() ;

export const ProfileUpsertArgsSchema: z.ZodType<Prisma.ProfileUpsertArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereUniqueInputSchema,
  create: z.union([ ProfileCreateInputSchema,ProfileUncheckedCreateInputSchema ]),
  update: z.union([ ProfileUpdateInputSchema,ProfileUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProfileCreateManyArgsSchema: z.ZodType<Prisma.ProfileCreateManyArgs> = z.object({
  data: z.union([ ProfileCreateManyInputSchema,ProfileCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProfileCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProfileCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProfileCreateManyInputSchema,ProfileCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProfileDeleteArgsSchema: z.ZodType<Prisma.ProfileDeleteArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereUniqueInputSchema,
}).strict() ;

export const ProfileUpdateArgsSchema: z.ZodType<Prisma.ProfileUpdateArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  data: z.union([ ProfileUpdateInputSchema,ProfileUncheckedUpdateInputSchema ]),
  where: ProfileWhereUniqueInputSchema,
}).strict() ;

export const ProfileUpdateManyArgsSchema: z.ZodType<Prisma.ProfileUpdateManyArgs> = z.object({
  data: z.union([ ProfileUpdateManyMutationInputSchema,ProfileUncheckedUpdateManyInputSchema ]),
  where: ProfileWhereInputSchema.optional(),
}).strict() ;

export const ProfileDeleteManyArgsSchema: z.ZodType<Prisma.ProfileDeleteManyArgs> = z.object({
  where: ProfileWhereInputSchema.optional(),
}).strict() ;

export const TokenCreateArgsSchema: z.ZodType<Prisma.TokenCreateArgs> = z.object({
  select: TokenSelectSchema.optional(),
  include: TokenIncludeSchema.optional(),
  data: z.union([ TokenCreateInputSchema,TokenUncheckedCreateInputSchema ]),
}).strict() ;

export const TokenUpsertArgsSchema: z.ZodType<Prisma.TokenUpsertArgs> = z.object({
  select: TokenSelectSchema.optional(),
  include: TokenIncludeSchema.optional(),
  where: TokenWhereUniqueInputSchema,
  create: z.union([ TokenCreateInputSchema,TokenUncheckedCreateInputSchema ]),
  update: z.union([ TokenUpdateInputSchema,TokenUncheckedUpdateInputSchema ]),
}).strict() ;

export const TokenCreateManyArgsSchema: z.ZodType<Prisma.TokenCreateManyArgs> = z.object({
  data: z.union([ TokenCreateManyInputSchema,TokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TokenCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TokenCreateManyAndReturnArgs> = z.object({
  data: z.union([ TokenCreateManyInputSchema,TokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TokenDeleteArgsSchema: z.ZodType<Prisma.TokenDeleteArgs> = z.object({
  select: TokenSelectSchema.optional(),
  include: TokenIncludeSchema.optional(),
  where: TokenWhereUniqueInputSchema,
}).strict() ;

export const TokenUpdateArgsSchema: z.ZodType<Prisma.TokenUpdateArgs> = z.object({
  select: TokenSelectSchema.optional(),
  include: TokenIncludeSchema.optional(),
  data: z.union([ TokenUpdateInputSchema,TokenUncheckedUpdateInputSchema ]),
  where: TokenWhereUniqueInputSchema,
}).strict() ;

export const TokenUpdateManyArgsSchema: z.ZodType<Prisma.TokenUpdateManyArgs> = z.object({
  data: z.union([ TokenUpdateManyMutationInputSchema,TokenUncheckedUpdateManyInputSchema ]),
  where: TokenWhereInputSchema.optional(),
}).strict() ;

export const TokenDeleteManyArgsSchema: z.ZodType<Prisma.TokenDeleteManyArgs> = z.object({
  where: TokenWhereInputSchema.optional(),
}).strict() ;

export const PatientCreateArgsSchema: z.ZodType<Prisma.PatientCreateArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  data: z.union([ PatientCreateInputSchema,PatientUncheckedCreateInputSchema ]),
}).strict() ;

export const PatientUpsertArgsSchema: z.ZodType<Prisma.PatientUpsertArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  where: PatientWhereUniqueInputSchema,
  create: z.union([ PatientCreateInputSchema,PatientUncheckedCreateInputSchema ]),
  update: z.union([ PatientUpdateInputSchema,PatientUncheckedUpdateInputSchema ]),
}).strict() ;

export const PatientCreateManyArgsSchema: z.ZodType<Prisma.PatientCreateManyArgs> = z.object({
  data: z.union([ PatientCreateManyInputSchema,PatientCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PatientCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PatientCreateManyAndReturnArgs> = z.object({
  data: z.union([ PatientCreateManyInputSchema,PatientCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PatientDeleteArgsSchema: z.ZodType<Prisma.PatientDeleteArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  where: PatientWhereUniqueInputSchema,
}).strict() ;

export const PatientUpdateArgsSchema: z.ZodType<Prisma.PatientUpdateArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  data: z.union([ PatientUpdateInputSchema,PatientUncheckedUpdateInputSchema ]),
  where: PatientWhereUniqueInputSchema,
}).strict() ;

export const PatientUpdateManyArgsSchema: z.ZodType<Prisma.PatientUpdateManyArgs> = z.object({
  data: z.union([ PatientUpdateManyMutationInputSchema,PatientUncheckedUpdateManyInputSchema ]),
  where: PatientWhereInputSchema.optional(),
}).strict() ;

export const PatientDeleteManyArgsSchema: z.ZodType<Prisma.PatientDeleteManyArgs> = z.object({
  where: PatientWhereInputSchema.optional(),
}).strict() ;

export const EventCreateArgsSchema: z.ZodType<Prisma.EventCreateArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  data: z.union([ EventCreateInputSchema,EventUncheckedCreateInputSchema ]),
}).strict() ;

export const EventUpsertArgsSchema: z.ZodType<Prisma.EventUpsertArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereUniqueInputSchema,
  create: z.union([ EventCreateInputSchema,EventUncheckedCreateInputSchema ]),
  update: z.union([ EventUpdateInputSchema,EventUncheckedUpdateInputSchema ]),
}).strict() ;

export const EventCreateManyArgsSchema: z.ZodType<Prisma.EventCreateManyArgs> = z.object({
  data: z.union([ EventCreateManyInputSchema,EventCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EventCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EventCreateManyAndReturnArgs> = z.object({
  data: z.union([ EventCreateManyInputSchema,EventCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EventDeleteArgsSchema: z.ZodType<Prisma.EventDeleteArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereUniqueInputSchema,
}).strict() ;

export const EventUpdateArgsSchema: z.ZodType<Prisma.EventUpdateArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  data: z.union([ EventUpdateInputSchema,EventUncheckedUpdateInputSchema ]),
  where: EventWhereUniqueInputSchema,
}).strict() ;

export const EventUpdateManyArgsSchema: z.ZodType<Prisma.EventUpdateManyArgs> = z.object({
  data: z.union([ EventUpdateManyMutationInputSchema,EventUncheckedUpdateManyInputSchema ]),
  where: EventWhereInputSchema.optional(),
}).strict() ;

export const EventDeleteManyArgsSchema: z.ZodType<Prisma.EventDeleteManyArgs> = z.object({
  where: EventWhereInputSchema.optional(),
}).strict() ;

export const ProposedTimeCreateArgsSchema: z.ZodType<Prisma.ProposedTimeCreateArgs> = z.object({
  select: ProposedTimeSelectSchema.optional(),
  include: ProposedTimeIncludeSchema.optional(),
  data: z.union([ ProposedTimeCreateInputSchema,ProposedTimeUncheckedCreateInputSchema ]),
}).strict() ;

export const ProposedTimeUpsertArgsSchema: z.ZodType<Prisma.ProposedTimeUpsertArgs> = z.object({
  select: ProposedTimeSelectSchema.optional(),
  include: ProposedTimeIncludeSchema.optional(),
  where: ProposedTimeWhereUniqueInputSchema,
  create: z.union([ ProposedTimeCreateInputSchema,ProposedTimeUncheckedCreateInputSchema ]),
  update: z.union([ ProposedTimeUpdateInputSchema,ProposedTimeUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProposedTimeCreateManyArgsSchema: z.ZodType<Prisma.ProposedTimeCreateManyArgs> = z.object({
  data: z.union([ ProposedTimeCreateManyInputSchema,ProposedTimeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProposedTimeCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProposedTimeCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProposedTimeCreateManyInputSchema,ProposedTimeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProposedTimeDeleteArgsSchema: z.ZodType<Prisma.ProposedTimeDeleteArgs> = z.object({
  select: ProposedTimeSelectSchema.optional(),
  include: ProposedTimeIncludeSchema.optional(),
  where: ProposedTimeWhereUniqueInputSchema,
}).strict() ;

export const ProposedTimeUpdateArgsSchema: z.ZodType<Prisma.ProposedTimeUpdateArgs> = z.object({
  select: ProposedTimeSelectSchema.optional(),
  include: ProposedTimeIncludeSchema.optional(),
  data: z.union([ ProposedTimeUpdateInputSchema,ProposedTimeUncheckedUpdateInputSchema ]),
  where: ProposedTimeWhereUniqueInputSchema,
}).strict() ;

export const ProposedTimeUpdateManyArgsSchema: z.ZodType<Prisma.ProposedTimeUpdateManyArgs> = z.object({
  data: z.union([ ProposedTimeUpdateManyMutationInputSchema,ProposedTimeUncheckedUpdateManyInputSchema ]),
  where: ProposedTimeWhereInputSchema.optional(),
}).strict() ;

export const ProposedTimeDeleteManyArgsSchema: z.ZodType<Prisma.ProposedTimeDeleteManyArgs> = z.object({
  where: ProposedTimeWhereInputSchema.optional(),
}).strict() ;

export const ProductCreateArgsSchema: z.ZodType<Prisma.ProductCreateArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  data: z.union([ ProductCreateInputSchema,ProductUncheckedCreateInputSchema ]),
}).strict() ;

export const ProductUpsertArgsSchema: z.ZodType<Prisma.ProductUpsertArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
  create: z.union([ ProductCreateInputSchema,ProductUncheckedCreateInputSchema ]),
  update: z.union([ ProductUpdateInputSchema,ProductUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProductCreateManyArgsSchema: z.ZodType<Prisma.ProductCreateManyArgs> = z.object({
  data: z.union([ ProductCreateManyInputSchema,ProductCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProductCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProductCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProductCreateManyInputSchema,ProductCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProductDeleteArgsSchema: z.ZodType<Prisma.ProductDeleteArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
}).strict() ;

export const ProductUpdateArgsSchema: z.ZodType<Prisma.ProductUpdateArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  data: z.union([ ProductUpdateInputSchema,ProductUncheckedUpdateInputSchema ]),
  where: ProductWhereUniqueInputSchema,
}).strict() ;

export const ProductUpdateManyArgsSchema: z.ZodType<Prisma.ProductUpdateManyArgs> = z.object({
  data: z.union([ ProductUpdateManyMutationInputSchema,ProductUncheckedUpdateManyInputSchema ]),
  where: ProductWhereInputSchema.optional(),
}).strict() ;

export const ProductDeleteManyArgsSchema: z.ZodType<Prisma.ProductDeleteManyArgs> = z.object({
  where: ProductWhereInputSchema.optional(),
}).strict() ;

export const CountyCreateArgsSchema: z.ZodType<Prisma.CountyCreateArgs> = z.object({
  select: CountySelectSchema.optional(),
  include: CountyIncludeSchema.optional(),
  data: z.union([ CountyCreateInputSchema,CountyUncheckedCreateInputSchema ]),
}).strict() ;

export const CountyUpsertArgsSchema: z.ZodType<Prisma.CountyUpsertArgs> = z.object({
  select: CountySelectSchema.optional(),
  include: CountyIncludeSchema.optional(),
  where: CountyWhereUniqueInputSchema,
  create: z.union([ CountyCreateInputSchema,CountyUncheckedCreateInputSchema ]),
  update: z.union([ CountyUpdateInputSchema,CountyUncheckedUpdateInputSchema ]),
}).strict() ;

export const CountyCreateManyArgsSchema: z.ZodType<Prisma.CountyCreateManyArgs> = z.object({
  data: z.union([ CountyCreateManyInputSchema,CountyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CountyCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CountyCreateManyAndReturnArgs> = z.object({
  data: z.union([ CountyCreateManyInputSchema,CountyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CountyDeleteArgsSchema: z.ZodType<Prisma.CountyDeleteArgs> = z.object({
  select: CountySelectSchema.optional(),
  include: CountyIncludeSchema.optional(),
  where: CountyWhereUniqueInputSchema,
}).strict() ;

export const CountyUpdateArgsSchema: z.ZodType<Prisma.CountyUpdateArgs> = z.object({
  select: CountySelectSchema.optional(),
  include: CountyIncludeSchema.optional(),
  data: z.union([ CountyUpdateInputSchema,CountyUncheckedUpdateInputSchema ]),
  where: CountyWhereUniqueInputSchema,
}).strict() ;

export const CountyUpdateManyArgsSchema: z.ZodType<Prisma.CountyUpdateManyArgs> = z.object({
  data: z.union([ CountyUpdateManyMutationInputSchema,CountyUncheckedUpdateManyInputSchema ]),
  where: CountyWhereInputSchema.optional(),
}).strict() ;

export const CountyDeleteManyArgsSchema: z.ZodType<Prisma.CountyDeleteManyArgs> = z.object({
  where: CountyWhereInputSchema.optional(),
}).strict() ;

export const CityCreateArgsSchema: z.ZodType<Prisma.CityCreateArgs> = z.object({
  select: CitySelectSchema.optional(),
  include: CityIncludeSchema.optional(),
  data: z.union([ CityCreateInputSchema,CityUncheckedCreateInputSchema ]),
}).strict() ;

export const CityUpsertArgsSchema: z.ZodType<Prisma.CityUpsertArgs> = z.object({
  select: CitySelectSchema.optional(),
  include: CityIncludeSchema.optional(),
  where: CityWhereUniqueInputSchema,
  create: z.union([ CityCreateInputSchema,CityUncheckedCreateInputSchema ]),
  update: z.union([ CityUpdateInputSchema,CityUncheckedUpdateInputSchema ]),
}).strict() ;

export const CityCreateManyArgsSchema: z.ZodType<Prisma.CityCreateManyArgs> = z.object({
  data: z.union([ CityCreateManyInputSchema,CityCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CityCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CityCreateManyAndReturnArgs> = z.object({
  data: z.union([ CityCreateManyInputSchema,CityCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CityDeleteArgsSchema: z.ZodType<Prisma.CityDeleteArgs> = z.object({
  select: CitySelectSchema.optional(),
  include: CityIncludeSchema.optional(),
  where: CityWhereUniqueInputSchema,
}).strict() ;

export const CityUpdateArgsSchema: z.ZodType<Prisma.CityUpdateArgs> = z.object({
  select: CitySelectSchema.optional(),
  include: CityIncludeSchema.optional(),
  data: z.union([ CityUpdateInputSchema,CityUncheckedUpdateInputSchema ]),
  where: CityWhereUniqueInputSchema,
}).strict() ;

export const CityUpdateManyArgsSchema: z.ZodType<Prisma.CityUpdateManyArgs> = z.object({
  data: z.union([ CityUpdateManyMutationInputSchema,CityUncheckedUpdateManyInputSchema ]),
  where: CityWhereInputSchema.optional(),
}).strict() ;

export const CityDeleteManyArgsSchema: z.ZodType<Prisma.CityDeleteManyArgs> = z.object({
  where: CityWhereInputSchema.optional(),
}).strict() ;