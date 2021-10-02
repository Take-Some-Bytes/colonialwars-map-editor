/* eslint-env browser */
/**
 * @Fileoverview File to store schemas of configurations files.
 */

import Joi from 'joi'

import constants from '../constants.js'

const { ID_REGEXP, NAME_REGEXP, MAP_CONFIG_LIMITS, REGEXP } = constants
const { DESCRIPTION_MULTI_LINE, DESCRIPTION_SINGLE_LINE } = REGEXP

const IdSchema = Joi.string().pattern(ID_REGEXP, 'id')
const NameSchema = Joi.string().pattern(NAME_REGEXP, 'name')
const MultiLineDescSchema = Joi.string().pattern(DESCRIPTION_MULTI_LINE, 'multi-line-desc')
const SingleLineDescSchema = Joi.string().pattern(DESCRIPTION_SINGLE_LINE, 'single-line-desc')
const Vector2dSchema = Joi.object({
  x: Joi.number().integer(),
  y: Joi.number().integer()
})
const StaticImgSchema = Joi.object().pattern(
  Joi.string().valid('x', 'y', 'w', 'h'),
  Joi.number().integer()
)
const DynAnimationSchema = StaticImgSchema.keys({
  frameSie: Joi.number().integer()
})
const TeamSchema = Joi.object({
  name: Joi
    .string()
    .max(MAP_CONFIG_LIMITS.MAX_TEAM_NAME_LEN)
    .pattern(constants.REGEXP.TEAM_NAME, 'team name'),
  description: SingleLineDescSchema.max(MAP_CONFIG_LIMITS.MAX_TEAM_DESC_LEN),
  maxPlayers: Joi
    .number()
    .integer()
    .min(MAP_CONFIG_LIMITS.MIN_PLAYERS_ON_TEAM)
    .max(MAP_CONFIG_LIMITS.MAX_PLAYERS_ON_TEAM),

  spawnPosition: Vector2dSchema
})
const GraphicsDataSchema = Joi.object().pattern(IdSchema, Joi.object({
  id: IdSchema,
  name: NameSchema,
  file: Joi.string(),
  angles: Joi.number().integer().valid(1, 2, 4, 8),
  hasAnimations: Joi.boolean(),
  mainImg: StaticImgSchema,
  // The following three images are optional.
  damaged1Img: StaticImgSchema.allow(null).optional(),
  damaged2Img: StaticImgSchema.allow(null).optional(),
  constructing1Img: StaticImgSchema.allow(null).optional(),
  // Animations are only required if hasAnimations is true.
  animations: Joi
    .when('hasAnimations', {
      is: Joi.equal(true),
      then: Joi.object().pattern(
        Joi.string().valid(...constants.VALID_ANIMATIONS),
        DynAnimationSchema
      ),
      otherwise: Joi.any().allow(null).optional()
    })
}))

export const MapConfigSchema = Joi.object({
  meta: Joi.object({
    name: NameSchema,
    mode: Joi.string().valid(...constants.VALID_GAME_MODES),
    tileType: Joi.string().valid(...constants.VALID_TILE_TYPES),
    description: MultiLineDescSchema.max(MAP_CONFIG_LIMITS.MAX_MAP_DESC_LEN),
    unitDataExtends: Joi.string(),
    buildingDataExtends: Joi.string(),
    graphicsDataExtends: Joi.string(),
    maxPlayers: Joi
      .number()
      .integer()
      .min(MAP_CONFIG_LIMITS.MIN_PLAYERS_MAP),
    defaultHeight: Joi
      .number()
      .integer()
      .min(MAP_CONFIG_LIMITS.MIN_DEFAULT_HEIGHT)
      .max(MAP_CONFIG_LIMITS.MAX_DEFAULT_HEIGHT),
    worldLimits: Vector2dSchema,
    teams: Joi
      .array()
      .min(MAP_CONFIG_LIMITS.MIN_TEAMS)
      .max(MAP_CONFIG_LIMITS.MAX_TEAMS)
      .items(TeamSchema)
  }),
  data: Joi.object({
    graphicsData: GraphicsDataSchema
  }),
  configType: Joi.string().valid('map-config')
}).prefs({ presence: 'required', convert: false })
