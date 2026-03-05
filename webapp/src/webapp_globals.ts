// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {AnyAction} from 'redux';
import {History} from 'history';

type OpenModalPayload = {
    modalId: string;
    dialogType: React.ElementType;
    dialogProps?: Record<string, unknown>;
}

type ModalsType = {
    openModal: (payload: OpenModalPayload) => AnyAction;
}

export const {
    formatText,
    messageHtmlToComponent,

    // @ts-ignore
} = global.PostUtils ?? {};

export const {
    modals,
    browserHistory,

// @ts-ignore
}: {modals: ModalsType, browserHistory: History} = global.WebappUtils ?? {};

export const {
    Timestamp,
    Textbox,

    // @ts-ignore
} = global.Components ?? {};
