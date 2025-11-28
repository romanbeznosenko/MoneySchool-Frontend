/**
 * @fileoverview Type definitions for API responses
 * All API responses follow the CustomResponse wrapper format from the backend
 */

/**
 * Generic CustomResponse wrapper from backend
 * @template T
 * @typedef {Object} CustomResponse
 * @property {T} data - The actual response data
 * @property {string} message - A message providing additional details about the response
 * @property {string} httpStatus - The HTTP status of the response (e.g., "OK", "CREATED")
 */

/**
 * Class access token data
 * @typedef {Object} ClassAccessTokenData
 * @property {string} token - The 4-digit access code for the class
 */

/**
 * Class access token response
 * @typedef {CustomResponse<ClassAccessTokenData>} ClassAccessTokenResponse
 */

/**
 * Class data
 * @typedef {Object} ClassData
 * @property {number} id - The class ID
 * @property {string} name - The class name
 * @property {number} memberCount - Number of members in the class
 * @property {Object} [treasurer] - The treasurer information
 * @property {string} [treasurer.name] - Treasurer's name
 * @property {string} [treasurer.fullName] - Treasurer's full name
 * @property {string} [treasurer.email] - Treasurer's email
 * @property {string} [treasurer.avatar] - Treasurer's avatar URL
 */

/**
 * Single class response
 * @typedef {CustomResponse<ClassData>} ClassResponse
 */

/**
 * Paginated classes list data
 * @typedef {Object} ClassesListData
 * @property {ClassData[]} items - Array of classes
 * @property {number} total - Total number of classes
 * @property {number} page - Current page number
 * @property {number} limit - Items per page
 */

/**
 * Paginated classes list response
 * @typedef {CustomResponse<ClassesListData>} ClassesListResponse
 */

/**
 * Empty response (for delete, etc.)
 * @typedef {CustomResponse<null>} EmptyResponse
 */

/**
 * User data
 * @typedef {Object} UserData
 * @property {number} id - User ID
 * @property {string} email - User email
 * @property {string} [fullName] - User's full name
 * @property {string} [avatar] - User's avatar URL
 * @property {string} role - User role (e.g., "USER", "ADMIN")
 */

/**
 * User response
 * @typedef {CustomResponse<UserData>} UserResponse
 */

export {};
