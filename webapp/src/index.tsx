import {Store, AnyAction} from 'redux';

import {GlobalState} from '@mattermost/types/store';

import {Client4} from '@mattermost/client';

import manifest from './manifest';

// eslint-disable-next-line import/no-unresolved
import MenuIcon from './components/header/MenuIcon';

import {setSiteUrl} from './client';
import RightHandSidebar from './components/rhs/rhs_main';
import {setToggleRHSAction} from './actions';

type WindowObject = {
    location: {
        origin: string;
        protocol: string;
        hostname: string;
        port: string;
    };
    basename?: string;
}

// From mattermost-webapp/utils
function getSiteURLFromWindowObject(obj: WindowObject): string {
    let siteURL = '';
    if (obj.location.origin) {
        siteURL = obj.location.origin;
    } else {
        siteURL = obj.location.protocol + '//' + obj.location.hostname + (obj.location.port ? ':' + obj.location.port : '');
    }

    if (siteURL[siteURL.length - 1] === '/') {
        siteURL = siteURL.substring(0, siteURL.length - 1);
    }

    if (obj.basename) {
        siteURL += obj.basename;
    }

    if (siteURL[siteURL.length - 1] === '/') {
        siteURL = siteURL.substring(0, siteURL.length - 1);
    }

    return siteURL;
}

function getSiteURL(): string {
    return getSiteURLFromWindowObject(window);
}

export default class Plugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public async initialize(registry: PluginRegistry, store: Store<GlobalState, AnyAction>) {
        const siteUrl = getSiteURL();
        setSiteUrl(siteUrl);
        const client = new Client4();
        client.setUrl(siteUrl);

        // registerRightHandSidebarComponent returns {toggleRHSPlugin} at runtime —
        // a Redux action object that must be dispatched, not called directly.
        // The declared return type { id: string } is incomplete, so we cast via unknown.
        const {toggleRHSPlugin} = registry.registerRightHandSidebarComponent(RightHandSidebar, 'Wiki') as unknown as {toggleRHSPlugin: AnyAction};

        // Store toggle in redux so other parts of the plugin can trigger it
        store.dispatch(setToggleRHSAction(() => store.dispatch(toggleRHSPlugin)) as AnyAction);

        // Bind it to the channel header button
        registry.registerChannelHeaderButtonAction(
            MenuIcon,
            () => store.dispatch(toggleRHSPlugin),
            'Toggle Wiki',
        );
    }
}

declare global {
    interface Window {
        registerPlugin(id: string, plugin: Plugin): void;
    }
}

window.registerPlugin(manifest.id, new Plugin());
