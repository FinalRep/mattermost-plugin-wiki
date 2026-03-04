// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled, {css} from 'styled-components';

const RHSTitle = () => {
    return (
        <RHSTitleText>
            {/* product name; don't translate */}
            {'WikiDocs'}
        </RHSTitleText>
    );
};

const RHSTitleText = styled.div<{ clickable?: boolean }>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;

    overflow: hidden;
    text-overflow: ellipsis;

    border-radius: 4px;

    ${(props) => props.clickable && css`
        &:hover {
            background: rgba(var(--center-channel-color-rgb), 0.08);
            fill: rgba(var(--center-channel-color-rgb), 0.72);
        }

        &:active,
        &--active,
        &--active:hover {
            background: rgba(var(--button-bg-rgb), 0.08);
            color: var(--button-bg);
        }
    `}
`;

export default RHSTitle;
