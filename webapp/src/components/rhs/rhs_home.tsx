// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import Scrollbars from 'react-custom-scrollbars-2';
import styled from 'styled-components';

import {GlobalState} from '@mattermost/types/store';

import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';
import {getCurrentChannel, getCurrentChannelId} from 'mattermost-redux/selectors/entities/channels';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import {FormattedMessage, useIntl} from 'react-intl';

import {createWikiDoc, deleteWikiDoc, saveWikiDoc} from '../../client';
import {useWikiDocsCrud} from '../../hooks/wikiDocs';
import {canUserUpdateWikiDoc} from '../../selectors';

import {PaginationRow} from '../pagination_row';

import {displayWikiDocCreateModal, displayWikiDocViewModal} from '../../actions';

import {
    renderThumbVertical,
    renderTrackHorizontal,
    renderView,
    RHSContainer,
    RHSContent,
} from './rhs_shared';

const WelcomeBlock = styled.div`
    padding: 1rem 2rem 2rem;
    color: rgba(var(--center-channel-color-rgb), 0.72);
`;

const WelcomeDesc = styled.p`
    font-size: 15px;
    line-height: 21px;
    font-weight: 1000;
`;

const WelcomeWarn = styled(WelcomeDesc)`
    color: rgba(var(--error-text-color-rgb), 0.72);
`;

const Header = styled.div`
    min-height: 13rem;
    margin-bottom: 4rem;
    display: grid;
`;

const Heading = styled.h4`
    font-size: 18px;
    line-height: 24px;
    font-weight: 700;
    color: rgba(var(--center-channel-color-rgb), 0.72);
    margin-bottom: 0.25rem;
`;

const SubHeading = styled.p`
    font-size: 12px;
    font-weight: 400;
    color: rgba(var(--center-channel-color-rgb), 0.56);
    margin-top: 0;
    margin-bottom: 1rem;
`;

const PaginationContainer = styled.div`
    position: relative;
    height: 0;
    top: -5rem;
    display: flex;
    justify-content: center;
    padding-top: 1rem;

    button {
        height: 3.25rem;
    }
`;

const ListSection = styled.div`
    margin-top: 1rem;
    margin-bottom: 5rem;
    box-shadow: 0px -1px 0px rgba(var(--center-channel-color-rgb), 0.08);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    grid-template-rows: repeat(auto-fill, minmax(32px, 1fr));
    position: relative;

    &::after {
        content: '';
        display: block;
        position: absolute;
        width: 100%;
        height: 1px;
        bottom: 0;
        box-shadow: 0px -1px 0px rgba(var(--center-channel-color-rgb), 0.08);
    }
`;

const ListItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0 0.5rem;
    margin: 0 2.75rem;
    box-shadow: 0px -1px 0px rgba(var(--center-channel-color-rgb), 0.08);

    > div:first-of-type {
        cursor: pointer;
    }

    > div {
        display: flex;
        overflow: hidden;
        flex-direction: column;
    }
`;

const RHSHome = () => {
    const dispatch = useDispatch<ThunkDispatch<GlobalState, undefined, AnyAction>>();
    const {formatMessage} = useIntl();

    const currentChannelId = useSelector<GlobalState, string>(getCurrentChannelId);
    const currentTeam = useSelector((state: GlobalState) => getCurrentTeam(state));
    const currentChannel = useSelector((state: GlobalState) => getCurrentChannel(state));
    const currentUserId = useSelector<GlobalState, string>(getCurrentUserId);
    const canEdit = useSelector<GlobalState, boolean>(canUserUpdateWikiDoc);

    const teamName = currentTeam?.display_name ?? '';
    const channelName = currentChannel?.display_name ?? '';

    const [
        wikiDocs,
        {totalCount, params},
        {setPage, fetchWikiDocs},
    ] = useWikiDocsCrud({
        page: 0,
        per_page: 10,
    });

    const createNew = async (name: string, description: string, status: string, content: string) => {
        await createWikiDoc(currentChannelId, currentUserId, currentTeam?.id ?? '', name, description, status, content);
        fetchWikiDocs();
    };

    const updateWiki = async (id: string, name: string, content: string) => {
        await saveWikiDoc({id, name, content});
        fetchWikiDocs();
    };

    const deleteEntry = async (id: string) => {
        await deleteWikiDoc(id);
        fetchWikiDocs();
    };

    const hasWikiDocs = Boolean(wikiDocs?.length);

    const pageHeader = (
        <>
            <Heading>
                <FormattedMessage defaultMessage='Wiki' />
            </Heading>
            <SubHeading>
                {formatMessage(
                    {defaultMessage: '{team} · #{channel}'},
                    {team: teamName, channel: channelName},
                )}
            </SubHeading>
        </>
    );

    let headerContent;

    if (hasWikiDocs) {
        const list = (
            <>
                {wikiDocs ?
                    <>
                        <ListSection>
                            {wikiDocs.map((wikiDoc, index) => (
                                <ListItem key={'wikiList' + index}>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(displayWikiDocViewModal({wikiDoc, canEdit, updateFunc: updateWiki}));
                                        }}
                                    >
                                        {wikiDoc.name}
                                    </div>
                                    {canEdit &&
                                        <button
                                            className={'icon-trash-can-outline icon-16 btn-icon'}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteEntry(wikiDoc.id);
                                            }}
                                        />
                                    }
                                </ListItem>
                            ))}
                        </ListSection>
                        <PaginationContainer>
                            <PaginationRow
                                page={params.page}
                                perPage={params.per_page}
                                totalCount={totalCount}
                                setPage={setPage}
                            />
                        </PaginationContainer>
                    </> :
                    <span>
                        <FormattedMessage defaultMessage='No wiki docs yet.' />
                    </span>
                }
            </>
        );

        headerContent = (
            <WelcomeBlock>
                {pageHeader}
                <WelcomeDesc>
                    <FormattedMessage defaultMessage='Your Pages:' />
                </WelcomeDesc>
                <div>
                    {list}
                    {canEdit ?
                        <span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(displayWikiDocCreateModal({createFunc: createNew}));
                                }}
                            >
                                <FormattedMessage defaultMessage='Add New' />
                            </button>
                        </span> :
                        <span>
                            <WelcomeWarn>
                                <FormattedMessage defaultMessage="You don't have permission to create wiki pages in this channel." />
                            </WelcomeWarn>
                        </span>
                    }
                </div>
            </WelcomeBlock>
        );
    }

    if (!headerContent) {
        headerContent = (
            <WelcomeBlock>
                {pageHeader}
                <WelcomeDesc>
                    <FormattedMessage defaultMessage='Informative pages to help you navigate this channel.' />
                </WelcomeDesc>
                {canEdit ?
                    <>
                        <WelcomeWarn>
                            <FormattedMessage defaultMessage='No wiki pages yet — add the first one!' />
                        </WelcomeWarn>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                dispatch(displayWikiDocCreateModal({createFunc: createNew}));
                            }}
                        >
                            <FormattedMessage defaultMessage='Add New' />
                        </button>
                    </> :
                    <WelcomeWarn>
                        <FormattedMessage defaultMessage="No wiki pages yet, and you don't have permission to create any in this channel." />
                    </WelcomeWarn>
                }
            </WelcomeBlock>
        );
    }

    return (
        <RHSContainer>
            <RHSContent>
                <Scrollbars
                    autoHide={true}
                    autoHideTimeout={500}
                    autoHideDuration={500}
                    renderThumbVertical={renderThumbVertical}
                    renderView={renderView}
                    renderTrackHorizontal={renderTrackHorizontal}
                    style={{position: 'absolute'}}
                >
                    {true && <Header>{headerContent}</Header>}
                </Scrollbars>
            </RHSContent>
        </RHSContainer>
    );
};

export default RHSHome;
