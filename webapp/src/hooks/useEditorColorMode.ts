import {useSelector} from 'react-redux';

import {GlobalState} from '@mattermost/types/store';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

type ColorMode = 'light' | 'dark';

const useEditorColorMode = (): ColorMode => {
    const theme = useSelector((state: GlobalState) => getTheme(state));

    const bg = theme?.centerChannelBg ?? '#ffffff';
    const hex = bg.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Perceived luminance — below 0.5 means dark background
    const luminance = ((0.299 * r) + (0.587 * g) + (0.114 * b)) / 255;

    return luminance > 0.5 ? 'light' : 'dark';
};

export default useEditorColorMode;
