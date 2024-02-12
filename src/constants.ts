
// error constants

export const invalidProfileValue = {code: 'ERR_INVALID_PROFILE', message: "Profile is not valid"};
export const invalidProfileTypeId = {code: 'ERR_INVALID_PROFILE_TYPE_ID', message: "Profile Type ID is not valid"};
export const invalidProfileUrl = {code: 'ERR_INVALID_PROFILE_URL', message: "Profile url is not valid"};
export const invalidTokenError = {code: 'ERR_INVALID_TOKEN', message: "Authorization Token is not valid"};
export const invalidInternalServer = {code: 'ERR_INTERNAL_SERVER_ERROR', message: "Internal Server Error"};
export const invalidNameValue = {code: 'ERR_INVALID_NAME', message: "Name is not valid"};
export const invalidEmailValue = {code: 'ERR_INVALID_EMAIL', message: "Email is not valid"};
export const invalidUniqueUrl = {code: 'ERR_INVALID_UNIQUE_URL', message: "Url is not Unique"};
export const invalidAccess = {code: 'ERR_INVALID_ACCESS', message: "Access restricted for this query"};
export const invalidSubProfileTypeId = {code: 'ERR_INVALID_SUB_PROFILE_TYPE_ID', message: "Sub Profile Type ID is not valid"};
export const invalidCategoryId = {code: 'ERR_INVALID_CATEGORY_ID', message: "Category ID is not valid"};
export const invalidScheduleId = {code: 'ERR_INVALID_SCHEDULE_ID', message: "Schedule ID is not valid"};
export const invalidCourseUrl = {code: 'ERR_INVALID_COURSE_URL', message: "Course url is not valid"};
export const invalidVideoId = {code: 'ERR_INVALID_VIDEO_ID', message: "Video ID is not valid"};
export const invalidCourseVideoId = {code: 'ERR_INVALID_COURSE_VIDEO_ID', message: "Course Video ID is not valid"};
export const invalidOrderId = {code: 'ERR_INVALID_ORDER_ID', message: "Order ID is not valid"};
export const invalidAudioId = {code: 'ERR_INVALID_AUDIO_ID', message: "Audio ID is not valid"};

export const cloudfront = {
    keyPairAccessId: 'APKAISQA5IRR4DP5XYMQ',
    // privateKeyFile: 'shaale-key-pair\\pk-APKAI56Q7GLULFO4AZXQ',
    // hlsFolder: 'https://vod.shaale.com/58c182ec-5279-41a4-b0d6-bf7beeedaad0/hls/*',
    // hlsUrl: 'https://vod.shaale.com/58c182ec-5279-41a4-b0d6-bf7beeedaad0/hls/2.1%20Varieties%20of%20Avadhaana.m3u8',
    domain: 'shaale.com'
}