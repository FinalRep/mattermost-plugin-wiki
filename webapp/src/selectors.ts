
import {GlobalState} from '@mattermost/types/store';

import {haveIChannelPermission} from 'mattermost-redux/selectors/entities/roles';

import {getCurrentChannel} from 'mattermost-redux/selectors/entities/channels';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

import Permissions from 'mattermost-redux/constants/permissions';
import {General} from 'mattermost-redux/constants';
import {isCurrentUserSystemAdmin} from 'mattermost-redux/selectors/entities/users';

import {RHSState} from './types/rhs';
import {WikiPluginState} from './reducer';
import {id as pluginId} from './manifest';

const pluginState = (state: GlobalState): WikiPluginState => state['plugins-' + pluginId as keyof GlobalState] as unknown as WikiPluginState || {} as WikiPluginState;

export const currentRHSState = (state: GlobalState): RHSState => pluginState(state).rhsState;

export const isWikiRHSOpen = (state: GlobalState): boolean => pluginState(state).rhsOpen;

export const selectToggleRHS = (state: GlobalState): () => void => pluginState(state).toggleRHSFunction;

export const isDirectOrGroupChannel = (state: GlobalState): boolean => {
    const channel = getCurrentChannel(state);
    if (!channel) {
        return false;
    }
    return channel.type === General.DM_CHANNEL || channel.type === General.GM_CHANNEL;
};

export const canUserUpdateWikiDoc = (state: GlobalState) => {
    const channel = getCurrentChannel(state);
    if (!channel) {
        return false;
    }

    // Wiki is not supported in DMs or group messages
    if (channel.type === General.DM_CHANNEL || channel.type === General.GM_CHANNEL) {
        return false;
    }

    let canManageChannel = false;
    if (channel.type === General.OPEN_CHANNEL) {
        canManageChannel = haveIChannelPermission(state, channel.team_id, channel.id, Permissions.MANAGE_PUBLIC_CHANNEL_PROPERTIES);
    } else if (channel.type === General.PRIVATE_CHANNEL) {
        canManageChannel = haveIChannelPermission(state, channel.team_id, channel.id, Permissions.MANAGE_PRIVATE_CHANNEL_PROPERTIES);
    }

    return canManageChannel || isCurrentUserSystemAdmin(state);
};

export const useEditorColorMode = () => {
    const theme = useSelector((state: GlobalState) => getTheme(state));

    // Mattermost themes have a sidebarBg colour — check its luminance
    // to determine if we're in a dark or light theme
    const bg = theme?.centerChannelBg ?? '#ffffff';

    // Parse hex to RGB and check luminance
    const hex = bg.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = ((0.299 * r) + (0.587 * g) + (0.114 * b)) / 255;

    return luminance > 0.5 ? 'light' : 'dark';
};
