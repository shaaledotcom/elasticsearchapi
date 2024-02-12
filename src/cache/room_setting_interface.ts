export interface RoomSettingInterface {
    callSetting: CallSettingInterface;
    roomDuration: RoomDurationInterface;
    roomMode: { type: string, isActive: boolean }[];
    openClass?: { roomDuration: RoomDurationInterface, scheduleThreshold: RoomDurationInterface,startThreshold: RoomDurationInterface, }
}

export interface RoomDurationInterface {
    duration: number,
    type: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'
}

export interface CallSettingInterface {
    audio: boolean;
    background: boolean;
    breakout: boolean;
    chat: boolean;
    floatSelf: boolean;
    leaveButton: boolean;
    locking: boolean;
    logo: boolean;
    minimal: boolean;
    moreButton: boolean;
    participantCount: boolean;
    people: boolean;
    personality: boolean;
    pipButton: boolean;
    preCallReview: boolean;
    screenShare: boolean;
    settingsButton: boolean;
    timer: boolean;
    video: boolean;
    recording: boolean;
    roomIntegrations: boolean;
}
