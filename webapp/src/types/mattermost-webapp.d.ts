import {Store} from 'redux';
import {GlobalState} from '@mattermost/types/lib/store';

export interface PluginRegistry {
    registerRightHandSidebarComponent(
        component: React.ComponentType | null,
        title: string
    ): {toggleRHSPlugin: AnyAction};
    registerChannelHeaderButtonAction(
        icon: React.ComponentType,
        action: () => void,
        tooltipText: string
    ): { id: string };
}

declare global {
    interface Window {
        registerPlugin(id: string, plugin: { initialize: (registry: PluginRegistry, store: Store<GlobalState>) => void }): void;
    }
    type PluginRegistry = {
        registerRightHandSidebarComponent(component: React.ComponentType, title: string): { id: string };
        registerChannelHeaderButtonAction(icon: React.ComponentType, action: () => void, tooltip: string): { id: string };
        toggleRHSPlugin(id: string): void;
    }
}
export {};
